"use client"

import Nav from "../../../../final_project/flashcard-app/public/pages/Nav.js"
import { isLoaded, isSignedIn, useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { Container, Grid, Card, CardActionArea, Typography, CardContent, Box, AppBar, Toolbar, Button } from "@mui/material"
import { useSearchParams } from "next/navigation"
import { db } from "@/firebase"
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
  
    const searchParams = useSearchParams()
    const search = searchParams.get("id")
    
    useEffect(() => {
        async function getFlashcard() {
          if (!search || !user) return
      
          const docRef = doc(collection(doc(collection(db, "users"), user.id), "flashcardSets"), search)
          const docSnap = await getDoc(docRef)
          const docData = docSnap.data().flashcards

          const flashcards = []

          docData.forEach((doc) => {
            flashcards.push({ ...doc })
          })
          setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
      setFlipped((prev) => ({
        ...prev,
        [id]: !prev[id],
      }))
    }

    if(!isLoaded || !isSignedIn) {
      return <></>
    }

    return (
        <Container maxWidth="xl" sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <Nav/>
          <AppBar position="static" sx={{ 
            background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
            boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
            marginBottom: 4
          }}>
            <Toolbar>
              <Typography variant="h6" sx={{ 
                flexGrow: 1,
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600
              }}>
                Flashcard Master
              </Typography>
              <SignedOut>
                <Button 
                  color="inherit" 
                  href="/sign-in"
                  sx={{ 
                    marginRight: 2,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  href="/sign-up"
                  variant="outlined"
                  sx={{ 
                    borderColor: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Sign Up
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton/>
              </SignedIn>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ 
            padding: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: 4
          }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 3
            }}>
              <Typography variant="h4" component="h1" sx={{
                fontWeight: 700,
                color: '#3f51b5',
                fontFamily: 'Roboto, sans-serif'
              }}>
                Flashcard Set: {search}
              </Typography>
              <Box>
                <Button 
                  variant="contained" 
                  href="/generate"
                  sx={{
                    marginRight: 2,
                    background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                    boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #43a047 30%, #5cb860 90%)'
                    }
                  }}
                >
                  Generate More
                </Button>
                <Button 
                  variant="outlined" 
                  href="/flashcards"
                  sx={{
                    color: '#3f51b5',
                    borderColor: '#3f51b5',
                    '&:hover': {
                      backgroundColor: 'rgba(63, 81, 181, 0.04)',
                      borderColor: '#3f51b5'
                    }
                  }}
                >
                  Back to Sets
                </Button>
              </Box>
            </Box>
          </Box>
          
          <Grid container spacing={4} sx={{ padding: 3 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
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
                            {flashcard.front}
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
                            {flashcard.back}
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
        </Container>
    )
}