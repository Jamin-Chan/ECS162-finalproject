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
} from "@mui/material";

let buttonTheme = createTheme({});
//the color is blue, and split into blue.main, blue.dark, blue.light
buttonTheme = createTheme(buttonTheme, {
  palette: {
    buttonBlue: buttonTheme.palette.augmentColor({
      color: {
        main: "#0000ff",
      },
      name: "buttonBlue",
    }),
  },
});

export default function Home() {
  const router = useRouter();

  return (
    <ThemeProvider theme={buttonTheme}>
      <Box>
        <Nav />
        <Box sx={{ my: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                  Welcome to GenCard AI
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  Generate flashcards using AI
                </Typography>
                <Box display="flex" flexDirection="row">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ margin: 2, bgcolor: "buttonBlue.light" }}
                    href="/generate"
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ margin: 2, bgcolor: "buttonBlue.light" }}
                    href="/flashcards"
                  >
                    My flashcards
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                height={"100vh"}
                display="flex"
                alignContent={"center"}
                alignItems="center"
                justifyContent={"center"}
              ></Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
