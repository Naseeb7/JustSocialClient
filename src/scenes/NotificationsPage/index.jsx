import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navBar";
import FriendsListWidget from "scenes/widgets/FriendsListWidget";
import NotificationWidget from "scenes/widgets/NotificationWidget";

const NotificationPage = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens=useMediaQuery("(min-width : 1000px)")

  return (
    <Box>
      <Navbar />
      <Box display="flex" justifyContent="space-around">
        <Box flexBasis={isNonMobileScreens ? "50%" : "70%"}>
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
