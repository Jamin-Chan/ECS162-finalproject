"use client";

import Nav from "../../public/pages/Nav.js";
import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  Typography,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

export default function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search) return;

      const docRef = doc(
        collection(doc(collection(db, "users"), "default"), "flashcardSets"),
        search
      );
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data().flashcards;

      const flashcards = [];

      docData.forEach((doc) => {
        flashcards.push({ ...doc });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container maxWidth="md">
      <Nav />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Flashcard Set: {search}
        </Typography>
        <Button color="primary" href="/generate" sx={{ mr: 2 }}>
          Generate More
        </Button>
        <Button color="primary" href="/flashcards">
          Back
        </Button>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {flashcards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent>
                    <Typography variant="h6">
                      {flipped[index] ? card.answer : card.question}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
