import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import UserImage from "components/UserImage";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { addNotification, setNotifications } from "state";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const NotificationWidget = ({ userId, token }) => {
  const socket = useRef();
  const notifications=useSelector((state)=>state.notifications)
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch=useDispatch()

  useEffect(() => {
    if (user) {
      socket.current = io(BaseUrl);
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("get-notification", (data) => {
       const newNotification= 
          {
            userId: data.userId,
            toUserId : data.toUserId,
            postId: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            type: data.type,
            notification: data.notification,
            userPicturePath: data.userPicturePath,
            postPicturePath: data.postPicturePath,
            read : true,
          }
          dispatch(addNotification({notification : newNotification}))
      });
    }
  }, [user]);

  return (
    <Box
      display="flex"
      flexDirection="column-reverse"
      p="1rem"
      m="1rem"
      gap="1rem"
      backgroundColor={theme.palette.background.alt}
      borderRadius="1rem"
    >
      {notifications &&
        notifications.map((notification) => {
          return (
            <Box
              key={`${notification._id}${notification.userId}`}
              display="flex"
              flexDirection="row"
              gap=".5rem"
              p=".5rem"
              alignItems="center"
              justifyContent="space-between"
              borderRadius=".75rem"
              backgroundColor={theme.palette.background.default}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.background.alt,
                },
              }}
              onClick={() => {
                if (notification.type === "friend") {
                  navigate(`/profile/${notification.userId}`);
                } else if (notification.type === "post") {
                  navigate(`/post/${notification.postId}`);
                }
              }}
            >
              <Box display="flex" alignItems="center" gap="1rem">
                <UserImage image={notification.userPicturePath} size="40px" />
                <Typography
                  sx={{
                    color: theme.palette.neutral.dark,
                  }}
                >
                  {notification.notification}
                </Typography>
              </Box>
              {notification.postPicturePath && (
                <img
                  src={`${BaseUrl}/assets/${notification.postPicturePath}`}
                  height="40px"
                  width="40px"
                  alt="Post"
                  style={{ borderRadius: ".5rem" }}
                />
              )}
            </Box>
          );
        })}
    </Box>
  );
};

export default NotificationWidget;
