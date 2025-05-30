"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  AppBar,
  Typography,
  Toolbar,
  Container,
  Link,
  Button,
} from "@mui/material";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

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

export default function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <ThemeProvider theme={buttonTheme}>
      <AppBar sx={{ width: "100vw", bgcolor: "#9facc2" }}>
        <Toolbar>
          <Link
            underline="none"
            href="/"
            style={{ flexGrow: 1, paddingLeft: 10 }}
            color="white"
          >
            <Typography variant="h6">GenCard AI</Typography>
          </Link>
          {user ? (
            <>
              <Typography variant="body1" sx={{ mr: 2, color: "white" }}>
                {user.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" href="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
