import { Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendsListWidget from "scenes/widgets/FriendsListWidget";
import NotificationWidget from "scenes/widgets/NotificationWidget";
import { setNotifications } from "state";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const NotificationPage = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens=useMediaQuery("(min-width : 1000px)");
  const dispatch=useDispatch()

   const readAllNotifications = async () => {
    const response = await fetch(`${BaseUrl}/users/${user._id}/readnotifications`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setNotifications({notifications : data}))
  };

  useEffect(()=>{
    readAllNotifications();
  },[]) //eslint-disable-line react-hooks/exhaustive-deps
 
  return (
    <Box>
      <Box display="flex" justifyContent="space-around" >
        <Box flexBasis={isNonMobileScreens ? "50%" : "95%"}>
        <NotificationWidget userId={user._id} token={token} />
        </Box>
        {isNonMobileScreens && (
            <Box flexBasis="25%">
            <FriendsListWidget userId={user._id} />
            </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotificationPage;
