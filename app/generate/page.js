"use client";

import Nav from "../../public/pages/Nav.js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  Box,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CardContent,
  CardActionArea,
  Alert,
} from "@mui/material";

export default function Generate() {
  const [text, setText] = useState("");
  const [flipped, setFlipped] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const router = useRouter();
  const { user } = useAuth();

  const saveFlashcards = async () => {
    if (!user) {
      alert("Please log in to save flashcards.");
      router.push("/login");
      return;
    }

    if (!setName) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setSetName("");
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <Container maxWidth="md">
      <Box>
        <Nav />
      </Box>

      <Box sx={{ my: 10 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        {!user && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please log in to save your flashcards.
          </Alert>
        )}
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent sx={{
                      height: '100%',
                      padding: 0,
                      perspective: '1000px'
                    }}>
                      <Box sx={{
                        position: 'relative',
                        width: '100%',
                        height: '250px',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s',
                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0)'
                      }}>
                        {/* Front of Card */}
                        <Box sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 3,
                          backgroundColor: '#ffffff',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          boxSizing: 'border-box'
                        }}>
                          <Typography variant="overline" sx={{
                            color: '#9e9e9e',
                            marginBottom: 1
                          }}>
                            Question
                          </Typography>
                          <Typography variant="h6" sx={{
                            textAlign: 'center',
                            fontWeight: 500,
                            color: '#424242'
                          }}>
                            {card.question}
                          </Typography>
                          <Typography variant="caption" sx={{
                            position: 'absolute',
                            bottom: 10,
                            color: '#9e9e9e'
                          }}>
                            Click to flip
                          </Typography>
                        </Box>

                        {/* Back of Card */}
                        <Box sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 3,
                          backgroundColor: '#f5f5f5',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          boxSizing: 'border-box',
                          transform: 'rotateY(180deg)'
                        }}>
                          <Typography variant="overline" sx={{
                            color: '#9e9e9e',
                            marginBottom: 1
                          }}>
                            Answer
                          </Typography>
                          <Typography variant="h6" sx={{
                            textAlign: 'center',
                            fontWeight: 500,
                            color: '#424242'
                          }}>
                            {card.answer}
                          </Typography>
                          <Typography variant="caption" sx={{
                            position: 'absolute',
                            bottom: 10,
                            color: '#9e9e9e'
                          }}>
                            Click to flip back
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            sx={{ mt: 2 }}
            disabled={!user}
          >
            Save Flashcards
          </Button>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
