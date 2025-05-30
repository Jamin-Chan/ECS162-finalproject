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
  Button,
  Alert,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/firebase";
import { useAuth } from "../context/AuthContext";
import { collection, doc, getDoc } from "firebase/firestore";

export default function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const { user } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!user || !search) return;

      const docRef = doc(
        collection(doc(collection(db, "users"), user.uid), "flashcardSets"),
        search
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data().flashcards;
        setFlashcards(docData);
      }
    }
    getFlashcard();
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Nav />
        <Box sx={{ my: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please log in to view flashcards.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            href="/login"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  if (!search) {
    return (
      <Container maxWidth="md">
        <Nav />
        <Box sx={{ my: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            No flashcard set selected.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            href="/flashcards"
            sx={{ mt: 2 }}
          >
            Back to Flashcards
          </Button>
        </Box>
      </Container>
    );
  }

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
        {flashcards.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            This flashcard set is empty.
          </Alert>
        ) : (
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
        )}
      </Box>
    </Container>
  );
}
