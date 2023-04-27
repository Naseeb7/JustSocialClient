import { useState } from "react";
import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Postpage from "scenes/Postpage";

function App() {
  const mode = useSelector((state) => state.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isAuth=Boolean(useSelector((state)=>state.token))

  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/"/>} />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/"/>} />
            <Route path="/post/:postId" element={isAuth ? <Postpage /> : <Navigate to="/"/>} />
          </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
