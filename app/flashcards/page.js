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
  const handleCreateNew = () => {
      router.push("/generate")
    }

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
    <Container maxWidth="lg" sx={{ 
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        paddingTop: 4,
        paddingBottom: 8
      }}>
        <Nav/>
        
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h3" sx={{
            marginTop:2,
            fontWeight: 1000,
            color: '#2d3748',
            fontFamily: 'Poppins, sans-serif',
            background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Your Flashcard Sets
          </Typography>
          
          <Button 
            variant="contained" 
            onClick={handleCreateNew}
            sx={{
              marginTop:2,
              padding: '10px 24px',
              borderRadius: '50px',
              background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
              boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .2)',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #43a047 30%, #5cb860 90%)',
                boxShadow: '0 4px 8px 3px rgba(76, 175, 80, .3)'
              }
            }}
          >
            + Create New Set
          </Button>
        </Box>

        {/* Flashcard Sets Grid */}
        {flashcards.length > 0 ? (
          <Grid container spacing={4}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.12)'
                  }
                }}>
                  <CardActionArea 
                    onClick={() => handleCardClick(flashcard.name)}
                    sx={{ 
                      height: '100%',
                      padding: 3
                    }}
                  >


                    <CardContent sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>

                      
                      <Box>
                        <Typography variant="h5" sx={{
                          fontWeight: 600,
                          marginBottom: 1.5,
                          color: '#2d3748',
                          fontFamily: 'Roboto, sans-serif'
                        }}>
                          {flashcard.name}
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: '#718096',
                          marginBottom: 2
                        }}>
                          {flashcard.description || 'No description available'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="caption" sx={{
                          color: '#a0aec0',
                          fontStyle: 'italic'
                        }}>
                          Last updated: {new Date(flashcard.updatedAt || Date.now()).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: 4,
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ 
              marginBottom: 2,
              color: '#718096',
              fontWeight: 500
            }}>
              You don't have any flashcard sets yet
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleCreateNew}
              sx={{
                padding: '10px 24px',
                borderRadius: '50px',
                background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .2)',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              Create Your First Set
            </Button>
          </Box>
        )}

        {/* Back Button */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          marginTop: 6
        }}>
          <Button 
            variant="outlined" 
            onClick={handleBack}
            sx={{
              padding: '10px 32px',
              borderRadius: '50px',
              borderColor: '#3f51b5',
              color: '#3f51b5',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(63, 81, 181, 0.04)',
                borderColor: '#3f51b5'
              }
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    )
}
