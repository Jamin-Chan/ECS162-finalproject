"use client";

import Nav from "../../public/pages/Nav.js";
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
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { collection, doc, getDoc } from "firebase/firestore";

export default function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;

      const docRef = doc(collection(db, "users"), user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcardSets || [];
        setFlashcards(collections);
      }
    }
    getFlashcards();
  }, [user]);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleBack = () => {
    router.push("/");
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Nav />
        <Box sx={{ my: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please log in to view your flashcards.
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

  return (
    <Container maxWidth="md">
      <Nav />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Flashcards
        </Typography>
        {flashcards.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            You haven't created any flashcard sets yet. Generate some flashcards
            to get started!
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {flashcards.map((set) => (
              <Grid item xs={12} sm={6} md={4} key={set.name}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(set.name)}>
                    <CardContent>
                      <Typography variant="h6">{set.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
