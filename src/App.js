import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Postpage from "scenes/Postpage";
import AccountPage from "scenes/accountPage";
import NotificationPage from "scenes/NotificationsPage";
import Chatroom from "scenes/chatRoom";
import { io } from "socket.io-client";
import Navbar from "scenes/navBar";
import { setonlineUsers } from "state";

const BaseUrl = process.env.REACT_APP_BASE_URL;
const url = process.env.REACT_APP_HOST_URL;

function App() {
  const socket = useRef();
  const mode = useSelector((state) => state.mode)
  const user = useSelector((state) => state.user);
  const onlineUsers = useSelector((state) => state.onlineUsers);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isAuth=Boolean(useSelector((state)=>state.token))
  const dispatch=useDispatch()

  useEffect(() => {
      if (user) {
        socket.current = io(BaseUrl, {
          reconnection: true,
          reconnectionDelay: 500,
          reconnectionAttempts: Infinity,
        });
      }
      
  }, []);

  useEffect(()=>{
    if(socket.current){
      socket.current.emit("add-user", user._id);
    }
  },[])

  useEffect(()=>{
    if(socket.current){
      socket.current.on("online-users",(data)=>{
        dispatch(setonlineUsers({ onlineUsers : data }))
        // console.log(data)
      });
      socket.current.on("connect",()=>{
        console.log("connected to backend")
      })
    }
  },[])

  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          {window.location.href!==`${url}/` && (isAuth && (<Navbar  socket={socket}/>))}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage socket={socket} /> : <Navigate to="/"/>} />
            <Route path="/notifications" element={isAuth ? <NotificationPage /> : <Navigate to="/"/>} />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage socket={socket} /> : <Navigate to="/"/>} />
            <Route path="/post/:postId" element={isAuth ? <Postpage socket={socket} /> : <Navigate to="/"/>} />
            <Route path="/account/:userId" element={isAuth ? <AccountPage /> : <Navigate to="/"/>} />
            <Route path="/:userId/chatroom" element={isAuth ? <Chatroom socket={socket} /> : <Navigate to="/"/>} />
          </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
