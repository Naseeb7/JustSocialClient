import { Box, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "scenes/navBar";
import UserWidget from "scenes/widgets/UserWidget";
import PostUploadWidget from "scenes/widgets/PostUploadWidget"
import FeedsWidget from "scenes/widgets/FeedsWidget";
import FriendsListWidget from "scenes/widgets/FriendsListWidget";
import { addNotification, setNotifications } from "state";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const HomePage = () => {
  const socket = useRef();
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);
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
  },[])

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
            read : false,
          }
          dispatch(addNotification({notification : newNotification}))
      });
    }
  }, [user]);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        p="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        // display="flex"
        gap=".5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "37%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
            <PostUploadWidget picturePath={picturePath} />
            <FeedsWidget userId={_id} />
        </Box>
        {(isNonMobileScreens && _id) && (
            <Box flexBasis="26%">
                  <FriendsListWidget userId={_id} />
            </Box>
        )}

      </Box>
    </Box>
  );
};

export default HomePage;
