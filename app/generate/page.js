"use client"

import Nav from "../../../../final_project/flashcard-app/public/pages/Nav.js"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { db } from "@/firebase"
import { collection, doc, getDoc, setDoc, writeBatch } from "firebase/firestore"
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
  CardActionArea
} from "@mui/material"

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [text, setText] = useState("")
    const [flipped, setFlipped] = useState([])
    const [flashcards, setFlashcards] = useState([])
    const [setName, setSetName] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenDialog = () => setDialogOpen(true)
    const handleCloseDialog = () => setDialogOpen(false)
    const router = useRouter()

    const saveFlashcards = async () => {
        if (!setName) {
          alert("Please enter a name for your flashcard set.")
          return
        }

        try {
            const userDocRef = doc(collection(db, "users"), user.id)
            const userDocSnap = await getDoc(userDocRef)
        
            const batch = writeBatch(db)
        
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data()
              const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
              batch.update(userDocRef, { flashcardSets: updatedSets })
            } else {
              batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
            }
        
            const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName)
            batch.set(setDocRef, { flashcards })
        
            await batch.commit()
      
          alert("Flashcards saved successfully!")
          handleCloseDialog()
          setSetName("")
          router.push("/flashcards")
        } catch (error) {
          console.error("Error saving flashcards:", error)
          alert("An error occurred while saving flashcards. Please try again.")
        }
    }

    const handleSubmit = async () => {
        if (!text.trim()) {
        alert("Please enter some text to generate flashcards.")
        return
        }
    
        try {
        const response = await fetch("/api/generate", {
            method: "POST",
            body: text,
        })
    
        if (!response.ok) {
            throw new Error("Failed to generate flashcards")
        }
    
        const data = await response.json()
        setFlashcards(data)
        } catch (error) {
        console.error("Error generating flashcards:", error)
        alert("An error occurred while generating flashcards. Please try again.")
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
    }
    const handleBack = () => {
        router.push("/")
    }

    return (
        <Container maxWidth="md" sx={{ 
          paddingTop: 4,
          paddingBottom: 6,
          minHeight: '100vh'
        }}>
            <Box>
                <Nav/>    
            </Box>
            
            <Box sx={{ 
              my: 6,
              backgroundColor: 'white',
              borderRadius: 3,
              padding: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: 4,
                  background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Generate Flashcards
                </Typography>
                
                <TextField
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  label="Enter your text or notes to generate flashcards"
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e0',
                      },
                    }
                  }}
                  InputProps={{
                    style: {
                      fontSize: '1rem',
                      lineHeight: '1.6'
                    }
                  }}
                />
                
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  fullWidth
                  sx={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                    boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #43a047 30%, #5cb860 90%)',
                      boxShadow: '0 4px 8px 3px rgba(76, 175, 80, .3)'
                    }
                  }}
                >
                  Generate Flashcards
                </Button>
                
                {flashcards.length > 0 && (
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{
                      fontWeight: 600,
                      color: '#2d3748',
                      marginBottom: 3
                    }}>
                      Generated Flashcards
                    </Typography>
                    
                    <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{
                          height: '100%',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
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
                                          borderRadius: '12px',
                                          border: '1px solid #e2e8f0',
                                          boxSizing: 'border-box'
                                        }}>
                                            <Typography variant="overline" sx={{ 
                                              color: '#718096',
                                              marginBottom: 1,
                                              fontSize: '0.7rem'
                                            }}>
                                              Question
                                            </Typography>
                                            <Typography sx={{ 
                                              textAlign: 'center',
                                              fontWeight: 500,
                                              color: '#2d3748',
                                              fontSize: '1.1rem'
                                            }}>
                                              {flashcard.front}
                                            </Typography>
                                            <Typography variant="caption" sx={{ 
                                              position: 'absolute',
                                              bottom: 12,
                                              color: '#a0aec0',
                                              fontSize: '0.7rem'
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
                                          backgroundColor: '#f8fafc',
                                          borderRadius: '12px',
                                          border: '1px solid #e2e8f0',
                                          boxSizing: 'border-box',
                                          transform: 'rotateY(180deg)'
                                        }}>
                                            <Typography variant="overline" sx={{ 
                                              color: '#718096',
                                              marginBottom: 1,
                                              fontSize: '0.7rem'
                                            }}>
                                              Answer
                                            </Typography>
                                            <Typography sx={{ 
                                              textAlign: 'center',
                                              fontWeight: 500,
                                              color: '#2d3748',
                                              fontSize: '1.1rem'
                                            }}>
                                              {flashcard.back}
                                            </Typography>
                                            <Typography variant="caption" sx={{ 
                                              position: 'absolute',
                                              bottom: 12,
                                              color: '#a0aec0',
                                              fontSize: '0.7rem'
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
                    
                    <Box sx={{ 
                      mt: 5,
                      display: "flex",
                      justifyContent: "center",
                      gap: 3
                    }}>
                        <Button 
                          variant="contained" 
                          onClick={handleOpenDialog}
                          sx={{
                            padding: '12px 32px',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                            boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .2)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #3949ab 30%, #1e88e5 90%)'
                            }
                          }}
                        >
                          Save Flashcards
                        </Button>
                        
                        <Button 
                          variant="outlined" 
                          onClick={handleBack}
                          sx={{
                            padding: '12px 32px',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderColor: '#e2e8f0',
                            color: '#4a5568',
                            '&:hover': {
                              borderColor: '#cbd5e0',
                              backgroundColor: 'rgba(203, 213, 224, 0.04)'
                            }
                          }}
                        >
                          Back to Dashboard
                        </Button>
                    </Box>
                </Box>
                )}
                
                {flashcards.length === 0 && (
                <Box sx={{ 
                  mt: 4,
                  display: "flex",
                  justifyContent: "center"
                }}>
                    <Button 
                      variant="outlined" 
                      onClick={handleBack}
                      sx={{
                        padding: '12px 32px',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderColor: '#e2e8f0',
                        color: '#4a5568',
                        '&:hover': {
                          borderColor: '#cbd5e0',
                          backgroundColor: 'rgba(203, 213, 224, 0.04)'
                        }
                      }}
                    >
                      Back to Dashboard
                    </Button>
                </Box>
                )}
                
                <Dialog 
                  open={dialogOpen} 
                  onClose={handleCloseDialog}
                  PaperProps={{
                    sx: {
                      borderRadius: '12px',
                      padding: '8px'
                    }
                  }}
                >
                    <DialogTitle sx={{ 
                      fontWeight: 600,
                      color: '#2d3748',
                      paddingBottom: 1
                    }}>
                      Save Flashcard Set
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ 
                          color: '#718096',
                          marginBottom: 2
                        }}>
                          Please enter a name for your flashcard set.
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          label="Set Name"
                          type="text"
                          fullWidth
                          variant="outlined"
                          value={setName}
                          onChange={(e) => setSetName(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '& fieldset': {
                                borderColor: '#e2e8f0',
                              },
                              '&:hover fieldset': {
                                borderColor: '#cbd5e0',
                              },
                            }
                          }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ padding: '8px 24px 16px' }}>
                        <Button 
                          onClick={handleCloseDialog}
                          sx={{
                            color: '#718096',
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: 'rgba(113, 128, 150, 0.04)'
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={saveFlashcards} 
                          sx={{
                            color: '#3f51b5',
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: 'rgba(63, 81, 181, 0.04)'
                            }
                          }}
                        >
                          Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    )
}