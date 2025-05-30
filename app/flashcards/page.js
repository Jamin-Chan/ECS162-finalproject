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
  AppBar,
  Button,
  Toolbar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export default function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      const docRef = doc(collection(db, "users"), "default");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcardSets || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, []);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <Container maxWidth="md">
      <Nav />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Flashcards
        </Typography>
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
