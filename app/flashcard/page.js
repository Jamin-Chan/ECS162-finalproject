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
      <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <Box sx={{ 
          my: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <Alert severity="info" sx={{ mb: 3, width: '100%', maxWidth: 500 }}>
            Please log in to view flashcards.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            href="/login"
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  if (!search) {
    return (
      <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <Box sx={{ 
          my: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: 500 }}>
            No flashcard set selected.
          </Alert>
          <Button
            variant="contained"
            color="primary"
            href="/flashcards"
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            Back to Flashcards
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <Box sx={{ 
        my: 4,
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 'bold',
            color: 'text.primary'
          }}>
            Flashcard Set: {search}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              href="/generate"
              sx={{
                px: 3,
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Generate More
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              href="/flashcards"
              sx={{
                px: 3,
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Back
            </Button>
          </Box>
        </Box>

        {flashcards.length === 0 ? (
          <Box sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Alert severity="info" sx={{ width: '100%', maxWidth: 500 }}>
              This flashcard set is empty.
            </Alert>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {flashcards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardActionArea 
                      onClick={() => handleCardClick(index)}
                    sx={{ height: '100%' }}
                  >
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
        )}
      </Box>
    </Container>
  );
}