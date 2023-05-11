import { useTheme } from "@emotion/react";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "scenes/navBar";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import FriendsListWidget from "scenes/widgets/FriendsListWidget";
import { useEffect, useRef, useState } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "emoji-picker-react";
import { EmojiEmotionsOutlined } from "@mui/icons-material";
import Messages from "components/Messages";
import "./index.css";
import { io } from "socket.io-client";

const {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  useMediaQuery,
} = require("@mui/material");

const BaseUrl = process.env.REACT_APP_BASE_URL;

const Chatroom = () => {
  const socket = useRef();
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const [currentSelected, setCurrentSelected] = useState(null);
  const [sentMessage, setSentMessage] = useState(null);
  const [isEmoji, setIsemoji] = useState(false);
  const [message, setMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (user) {
      socket.current = io(BaseUrl, {
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: Infinity,
      });
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("message-receive", (message) => {
        setArrivalMessage({
          fromSelf: false,
          message: message,
          created: new Date().getTime(),
        });
      });
      socket.current.on("typing", (data) => {
        setTyping(data);
        setTimeout(() => {
          setTyping(false);
        }, 2000);
      });
    }
  }, []);

  const onEmojiClick = (e) => {
    let newmsg = message + e.emoji;
    setMessage(newmsg);
  };

  const handleSendMessage = async () => {
    const response = await fetch(`${BaseUrl}/message/${user._id}/addmessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        from: user._id,
        to: currentSelected._id,
        message: message,
      }),
    });
    const data = await response.json();
    socket.current.emit("send-message", {
      from: user._id,
      to: currentSelected._id,
      message: message,
    });
    setIsemoji(false);
    setMessage("");
    setSentMessage(message);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    socket.current.emit("typing", {
      to: currentSelected._id,
      typing: true,
    });
  };

  return (
    <Box>
      <Navbar />
      <Box display="flex" flexDirection="row" height="89vh">
        <Box
          id="contactBox"
          display="flex"
          flexDirection="column"
          gap=".5rem"
          p="1rem"
          flexBasis={isNonMobileScreens ? "25%" : "40%"}
          backgroundColor={theme.palette.background.alt}
          borderRadius=".75rem 0 0 .75rem"
          m=".35rem"
          mr="0.1rem"
        >
          <Typography
            variant="h4"
            fontWeight="500"
            color={theme.palette.neutral.medium}
          >
            Chats
          </Typography>
          {user.friends.length !== 0 ? (
            <Box>
              {user.friends.map((friend) => (
                <Box
                  key={friend._id}
                  p=".25rem"
                  m=".5rem 0"
                  display="flex"
                  gap="1rem"
                  alignItems="center"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: theme.palette.neutral.light,
                    },
                  }}
                  backgroundColor={
                    currentSelected === friend
                      ? theme.palette.neutral.lesslight
                      : null
                  }
                  borderRadius=".75rem"
                  onClick={() => {
                    setCurrentSelected(friend);
                    setIsemoji(false);
                    setMessage("");
                  }}
                  //   border="2px solid red"
                >
                  <IconButton
                    onClick={() => {
                      navigate(`/profile/${friend._id}`);
                      navigate(0);
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                        cursor: "pointer",
                      },
                    }}
                  >
                    <UserImage image={friend.picturePath} size="45px" />
                  </IconButton>
                  <Box>
                    <Typography
                      color={theme.palette.neutral.main}
                      variant="h5"
                      fontWeight="500"
                    >
                      {friend.firstName} {friend.lastName}
                    </Typography>
                    <Typography
                      color={theme.palette.neutral.medium}
                      fontSize=".75rem"
                    >
                      {friend.occupation}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: theme.palette.neutral.medium }}>
              Add friends to start chatting
            </Typography>
          )}
        </Box>

        {currentSelected ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            // gap=".5rem"
            p="1rem"
            flexBasis={isNonMobileScreens ? "75%" : "60%"}
            width="100%"
            //   border="2px solid blue"
            position="relative"
            borderRadius="0 .75rem .75rem 0"
            m=".35rem"
            ml="0.1rem"
            backgroundColor={theme.palette.neutral.light}
          >
            {/* First row */}
            <Box
              display="flex"
              alignItems="center"
              gap=".75rem"
              // border="2px solid green"
              width="100%"
              p="1rem"
              backgroundColor={theme.palette.background.alt}
              borderRadius=".75rem .75rem 0 0"
            >
              <UserImage image={currentSelected.picturePath} size="35px" />
              <Box position="relative" minWidth="30%">
                <Typography
                  variant="h5"
                  fontWeight="300"
                  color={theme.palette.neutral.dark}
                >
                  {currentSelected.firstName}
                </Typography>
                {typing && (
                  <Typography fontSize="x-small" position="absolute">
                    {currentSelected.firstName} is typing....
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Secpnd row */}
            <Box height="100%" overflow="auto">
              <Messages
                selectedUser={currentSelected}
                socket={socket.current}
                sentMessage={sentMessage}
                arrivalMessage={arrivalMessage}
              />
            </Box>

            {/* Third row */}
            <Box>
              <Box
                display="flex"
                flexDirection="row"
                p=".65rem"
                //   border="2px solid red"
                backgroundColor={theme.palette.background.alt}
                borderRadius="0 0 .75rem .75rem"
                position="relative"
              >
                {isEmoji && (
                  <Box
                    id="emojiBox"
                    m=".5rem 0"
                    position="absolute"
                    bottom="3rem"
                    // border="2px solid red"
                  >
                    <Picker
                      height="40vh"
                      theme={mode === "dark" ? "dark" : "light"}
                      onEmojiClick={onEmojiClick}
                      previewConfig={{ showPreview: false }}
                      searchDisabled={true}
                    />
                  </Box>
                )}
                {isEmoji ? (
                  <IconButton
                    onClick={() => {
                      setIsemoji(!isEmoji);
                    }}
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => setIsemoji(!isEmoji)}>
                    <EmojiEmotionsOutlined />
                  </IconButton>
                )}
                <TextField
                  id="messageText"
                  value={message}
                  variant="standard"
                  sx={{ width: "100%" }}
                  placeholder="Enter your message here....."
                  onChange={handleChange}
                  onFocus={() => setIsemoji(false)}
                  multiline
                  // size="small"
                />
                <Button
                  sx={{
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.background.alt,
                    },
                  }}
                  onClick={handleSendMessage}
                >
                  <SendOutlinedIcon />
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap=".5rem"
            p="1rem"
            flexBasis="75%"
            width="100%"
          >
            <Typography
              variant="h4"
              fontWeight="500"
              color={theme.palette.neutral.medium}
            >
              Select an user to view chat
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chatroom;
