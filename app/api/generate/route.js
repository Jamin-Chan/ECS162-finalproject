import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `You are a flashcard creator. Your task is to create exactly 10 flashcards from the given text.
Rules:
1. Create exactly 10 flashcards
2. Each flashcard should have a question (front) and answer (back)
3. Both front and back should be one sentence long
4. The front should be a clear question
5. The back should be a direct answer to the question
6. Return ONLY a JSON object in this exact format, with no additional text or markdown:
{
  "flashcards": [
    {
      "question": "What is the capital of France?",
      "answer": "The capital of France is Paris."
    }
  ]
}`;

export async function POST(req) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generation_config: {
        temperature: 0.7,
        top_p: 1,
        top_k: 32,
        max_output_tokens: 2048,
      },
    });

    const data = await req.text();
    console.log("Input text:", data);

    const prompt = `${systemPrompt}\n\nCreate flashcards from this text:\n${data}`;
    console.log("Full prompt:", prompt);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    console.log("Raw API response:", responseText);

    // Remove any markdown formatting if present
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
    console.log("Cleaned JSON:", cleanJson);

    try {
      const flashcards = JSON.parse(cleanJson);
      console.log("Parsed flashcards:", flashcards);

      if (!flashcards.flashcards || !Array.isArray(flashcards.flashcards)) {
        throw new Error("Invalid flashcard format: missing flashcards array");
      }

      if (flashcards.flashcards.length !== 10) {
        throw new Error(
          `Invalid number of flashcards: expected 10, got ${flashcards.flashcards.length}`
        );
      }

      // Validate each flashcard
      flashcards.flashcards.forEach((card, index) => {
        if (!card.question || !card.answer) {
          throw new Error(
            `Invalid flashcard at index ${index}: missing question or answer`
          );
        }
      });

      return NextResponse.json(flashcards.flashcards);
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      console.error("Raw response:", responseText);
      return NextResponse.json(
        { error: `Failed to parse flashcard response: ${parseError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: `Failed to generate flashcards: ${error.message}` },
      { status: 500 }
    );
  }
}
