import { useTheme } from "@emotion/react";
import UserImage from "components/UserImage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useEffect, useState } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Picker from "emoji-picker-react";
import { EmojiEmotionsOutlined } from "@mui/icons-material";
import Messages from "components/Messages";
import "./index.css";
import { setFriends } from "state";

const {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  Badge,
} = require("@mui/material");

const BaseUrl = process.env.REACT_APP_BASE_URL;

const Chatroom = ({ socket }) => {
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);
  const token = useSelector((state) => state.token);
  const onlineUsers = useSelector((state) => state.onlineUsers);
  const navigate = useNavigate();
  const [currentSelected, setCurrentSelected] = useState(null);
  const [sentMessage, setSentMessage] = useState(null);
  const [isEmoji, setIsemoji] = useState(false);
  const [message, setMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket.current) {
      socket.current.off("message-receive");
      socket.current.on("message-receive", (data) => {
        if(data.from === currentSelected._id){
          setArrivalMessage({
            fromSelf: false,
            message: data.message,
            created: new Date().getTime(),
          });
        }
      });
      socket.current.off("typing-data");
      socket.current.on("typing-data", (data) => {
        if(data.from === currentSelected._id){
          setTyping(data.typing);
          setTimeout(() => {
            setTyping(false);
          }, 1500);
        }
      });
    }
  }, [currentSelected]); //eslint-disable-line react-hooks/exhaustive-deps

  const getFriends = async () => {
    const response = await fetch(`${BaseUrl}/users/${user._id}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

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
    // eslint-disable-next-line
    const data = await response.json();
    socket.current.off("send-message");
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
      from : user._id,
      to: currentSelected._id,
      typing: true,
    });
  };

  return (
    <Box>
      <Box display="flex" flexDirection="row" height="89vh">
        <Box
          id="contactBox"
          display="flex"
          flexDirection="column"
          gap=".75rem"
          p=".5rem"
          flexBasis={
            isNonMobileScreens ? "25%" : isMobileMenuToggled ? "10%" : "40%"
          }
          backgroundColor={theme.palette.background.alt}
          borderRadius=".75rem 0 0 .75rem"
          m=".35rem"
          mr="0.1rem"
          onClick={() => {
            if (!isNonMobileScreens) {
              setIsMobileMenuToggled(!isMobileMenuToggled);
            }
          }}
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
                  key={`${friend._id}${friend.firstName}`}
                  p=".5rem"
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
                  borderRadius="1rem"
                  onClick={() => {
                    if (!isMobileMenuToggled) {
                      setCurrentSelected(friend);
                      setMessage("");
                    }
                    setIsemoji(false);
                  }}
                  //   border="2px solid red"
                >
                  <Badge
                    color={
                      onlineUsers.includes(friend._id) ? "primary" : "secondary"
                    }
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: onlineUsers.includes(friend._id)
                          ? theme.palette.primary.main
                          : theme.palette.neutral.medium,
                        padding: ".32rem",
                      },
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    overlap="circular"
                    variant="dot"
                  >
                    <UserImage image={friend.picturePath} size="45px" />
                  </Badge>
                  {!isMobileMenuToggled && (
                      <Typography
                        color={theme.palette.neutral.main}
                        variant="h5"
                        fontWeight="500"
                      >
                        {friend.firstName} {friend.lastName}
                      </Typography>
                  )}
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
            p=".5rem"
            flexBasis={
              isNonMobileScreens ? "75%" : isMobileMenuToggled ? "90%" : "60%"
            }
            width="100%"
            // border="2px solid blue"
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
              p=".5rem"
              backgroundColor={theme.palette.background.alt}
              borderRadius=".75rem .75rem 0 0"
            >
              <IconButton
                onClick={() => {
                  navigate(`/profile/${currentSelected._id}`);
                  navigate(0);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                    cursor: "pointer",
                  },
                }}
              >
                <UserImage image={currentSelected.picturePath} size="35px" />
              </IconButton>
              <Box position="relative" minWidth="30%">
                <Typography
                  variant="h5"
                  fontWeight="300"
                  color={theme.palette.neutral.dark}
                >
                  {currentSelected.firstName}
                </Typography>
                <Typography
                  fontSize="x-small"
                  color={theme.palette.neutral.dark}
                >
                  {onlineUsers.includes(currentSelected._id) && "online"}
                </Typography>
              </Box>
            </Box>

            {/* Secpnd row */}
            <Box height="100%" overflow="auto">
              <Messages
                selectedUser={currentSelected}
                socket={socket.current}
                sentMessage={sentMessage}
                arrivalMessage={arrivalMessage}
                typing={typing}
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
