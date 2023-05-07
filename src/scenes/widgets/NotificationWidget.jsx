import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import UserImage from "components/UserImage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const NotificationWidget = ({ userId, token }) => {
  const [notifications, setNotifications] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const getUserNotifications = async () => {
    const response = await fetch(`${BaseUrl}/users/${userId}/notifications`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setNotifications(data);
  };

  useEffect(() => {
    getUserNotifications();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      display="flex"
      flexDirection="column"
      p="1rem"
      m="1rem"
      gap="1rem"
      backgroundColor={theme.palette.background.alt}
      borderRadius="2rem"
    >
      {notifications &&
        notifications.map((notification) => {
          return (
            <Box
              key={notification._id}
              display="flex"
              flexDirection="row"
              gap=".5rem"
              p=".5rem"
              alignItems="center"
              justifyContent="space-between"
              borderRadius="2rem"
              backgroundColor={theme.palette.background.default}
              sx={{
                "&:hover":{
                    backgroundColor: theme.palette.background.alt,
                }
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
              <Typography sx={{
                color:theme.palette.neutral.dark,
              }}>{notification.notification}</Typography>
                </Box>
              {notification.postPicturePath && (
                <img
                  src={`${BaseUrl}/assets/${notification.postPicturePath}`}
                  height="40px"
                  width="40px"
                  alt="Post"
                  style={{borderRadius: ".5rem"}}
                />
              )}
            </Box>
          );
        })}
    </Box>
  );
};

export default NotificationWidget;
