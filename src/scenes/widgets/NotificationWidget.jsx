import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const NotificationWidget = () => {
  const notifications=useSelector((state)=>state.notifications)
  const theme = useTheme();
  const navigate = useNavigate();
  
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
      {notifications.length !==0 ? (
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
                  onError={(e)=>{
                    e.target.onError = null;
                    e.target.src="https://i.ibb.co/zx3dYdR/no-image.jpg"
                }}
                />
              )}
            </Box>
          );
        })) : (
          <Box textAlign="center">
            <Typography sx={{ color: theme.palette.neutral.medium }}>No notifications yet.</Typography>
          </Box>
        )}
    </Box>
  );
};

export default NotificationWidget;
