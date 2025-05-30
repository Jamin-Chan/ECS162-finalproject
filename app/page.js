"use client";

import Nav from "../public/pages/Nav.js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  AppBar,
  Typography,
  Button,
  Toolbar,
  Grid,
  Container,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4caf50",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2.5rem",
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: "2rem",
      marginBottom: "2rem",
    },
    h6: {
      fontWeight: 600,
      marginBottom: "1rem",
    },
  },
});

export default function Home() {
  const router = useRouter();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Nav />

        {/* Hero Section */}
        <Container
          maxWidth="xl"
          sx={{
            py: 8,
            display: "flex",
            alignItems: "center",
            minHeight: isMobile ? "auto" : "100vh",
          }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  color: "primary.main",
                  mb: 4,
                }}
              >
                Welcome to GenCard AI
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Unlock the power of smart studying with GenCard, the ultimate
                AI-powered flashcard generator designed to transform the way you
                learn. Whether you are a student prepping for exams, a
                professional enhancing your skills, or just someone hungry for
                knowledge, GenCard is here to make studying more efficient,
                personalized, and fun.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href="/generate"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 18px rgba(25, 118, 210, 0.4)",
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  href="/flashcards"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    borderWidth: "2px",
                    "&:hover": {
                      borderWidth: "2px",
                      backgroundColor: "rgba(25, 118, 210, 0.04)",
                    },
                  }}
                >
                  My Flashcards
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              ></Box>
            </Grid>
          </Grid>
        </Container>

        {/* Features Section */}
        <Box
          sx={{
            py: 10,
            backgroundColor: "background.paper",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                color: "text.primary",
                mb: 6,
              }}
            >
              Powerful Features
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      Easy Topic Help
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.7,
                      }}
                    >
                      Got a topic you need to study? Just provide the topic and
                      let the app do the rest! The flashcard generator will
                      create 10 flashcards with a question on the front and the
                      answer on the back.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      Easy Text Input
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.7,
                      }}
                    >
                      Our flashcard generator is easy to use. Simply click Get
                      Started, type whatever you want, and click Generate
                      Flashcards and you are done! In the future, we plan on
                      adding more options for generating flashcards to improve
                      accessibility.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      Saves Flashcard History
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.7,
                      }}
                    >
                      Want to save and check out your previous sets of
                      flashcards? After generating a set, click Save. You can
                      click My Flashcards and find all the sets you have
                      created! Note: If you want see your history, you must
                      create and use an account to save the flashcard sets.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
