import { useTheme } from "@emotion/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Lottie from "lottie-react";
import animationData2 from "../animations/loading.json";
import animationData from "../animations/typing.json";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const Messages = ({ selectedUser, sentMessage, arrivalMessage, typing }) => {
  const scrollRef = useRef();
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
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
  }, [sentMessage]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
      scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages, typing]); //eslint-disable-line react-hooks/exhaustive-deps

  const getAllMessages = async () => {
    setLoading(true)
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
    setLoading(false)
  };

  useEffect(() => {
    getAllMessages();
  }, [selectedUser]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
      <Box
      id="messageContainer"
      display="flex"
      flexDirection="column"
      overflow="auto"
      //   border="2px solid blue"
      height="100%"
      p=".5rem"
      backgroundColor={theme.palette.background.default}
    >
      {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
          <Lottie
                   animationData={animationData2}
                   loop={true}
                   style={{
                    height : "10%"
                     // border: "2px solid green",
                   }}
                 /></Box>
      ) : (
      <>
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
                <Typography>{message.message}</Typography>
                <Typography fontSize=".45rem" textAlign="right">
                  {new Date(message.created).toLocaleTimeString()}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
      {typing && (
        <Box
          flexDirection="row"
          alignItems="center"
          width="100%"
          height="12%"
          // border="2px solid red"
        >
          <Lottie
            animationData={animationData}
            loop={true}
            style={{
              width: "10%",
              height: "100%",
              // border: "2px solid green",
              padding: "0",
            }}
          />
        </Box>
      )}
      </>
      )}
    </Box>
  );
};

export default Messages;
