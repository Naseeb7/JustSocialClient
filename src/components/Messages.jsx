import { useTheme } from "@emotion/react";
import { Box, Typography, sliderClasses, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const Messages = ({ selectedUser, sentMessage, arrivalMessage }) => {
  const scrollRef = useRef();
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [messages, setMessages] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (sentMessage) {
      const msgs = [...messages];
      msgs.push({
        fromSelf: true,
        message: sentMessage,
        created: new Date().getTime(),
      });
      setMessages(msgs);
    }
  }, [sentMessage]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const getAllMessages = async () => {
    const response = await fetch(
      `${BaseUrl}/message/${user._id}/getallmessages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          from: user._id,
          to: selectedUser._id,
        }),
      }
    );
    const data = await response.json();
    setMessages(data);
  };

  useEffect(() => {
    getAllMessages();
  }, [selectedUser]);
  return (
    <Box
      id="messageContainer"
      display="flex"
      flexDirection="column"
      overflow="auto"
      //   border="2px solid blue"
      height="100%"
      p="1rem"
      gap=".5rem"
      sx={{
        // backgroundImage: `url("https://i.ibb.co/SBgx1cT/Wooden-Background.jpg")`,
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "cover",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {messages.map((message) => {
        return (
          <Box
            ref={scrollRef}
            key={message._id}
            display="flex"
            // border="2px solid red"
            p=".25rem"
            justifyContent={message.fromSelf ? "flex-end" : "flex-start"}
          >
            {message.fromSelf ? (
              <Box
                display="flex"
                flexDirection="column"
                p=".25rem .75rem"
                // border="2px solid red"
                backgroundColor={theme.palette.primary.lighter}
                borderRadius="1rem"
                minWidth="10%"
                maxWidth={isNonMobileScreens ? "40%" : "80%"}
                sx={{
                  overflowWrap: "break-word",
                }}
              >
                <Typography>{message.message}</Typography>
                <Typography fontSize=".45rem" textAlign="right">
                  {new Date(message.created).toLocaleTimeString()}
                </Typography>
              </Box>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                p=".25rem .75rem"
                // border="2px solid green"
                backgroundColor={theme.palette.neutral.light}
                borderRadius="1rem"
                minWidth="10%"
                maxWidth={isNonMobileScreens ? "40%" : "80%"}
                sx={{
                  overflowWrap: "break-word",
                }}
              >
                <Typography >{message.message}</Typography>
                <Typography fontSize=".45rem" textAlign="right">
                  {new Date(message.created).toLocaleTimeString()}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Messages;
