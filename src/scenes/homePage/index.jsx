import { Box, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import UserWidget from "scenes/widgets/UserWidget";
import PostUploadWidget from "scenes/widgets/PostUploadWidget"
import FeedsWidget from "scenes/widgets/FeedsWidget";
import FriendsListWidget from "scenes/widgets/FriendsListWidget";
import { setNotifications } from "state";
import { useEffect } from "react";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const HomePage = ({socket}) => {
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch=useDispatch()

  const getUserNotifications = async () => {
    const response = await fetch(`${BaseUrl}/users/${_id}/notifications`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setNotifications({notifications : data}))
  };

  useEffect(()=>{
    getUserNotifications();
  },[]) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Box
        width="100%"
        p="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap=".5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
          {(!isNonMobileScreens && _id) && (
            <Box flexBasis="26%">
                  <FriendsListWidget userId={_id} />
            </Box>
        )}
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "37%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
            <PostUploadWidget picturePath={picturePath} />
            <FeedsWidget userId={_id} socket={socket} />
        </Box>
        {(isNonMobileScreens && _id) && (
            <Box flexBasis="26%">
                  <FriendsListWidget userId={_id} socket={socket} />
            </Box>
        )}

      </Box>
    </Box>
  );
};

export default HomePage;
