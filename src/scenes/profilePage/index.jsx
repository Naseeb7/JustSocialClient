import { Box, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navBar";
import FriendListWidget from "scenes/widgets/FriendsListWidget";
import PostUploadWidget from "scenes/widgets/PostUploadWidget";
import FeedsWidget from "scenes/widgets/FeedsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { useTheme } from "@emotion/react";

const BaseUrl=process.env.REACT_APP_BASE_URL

const ProfilePage=()=>{
    const [user,setUser]=useState(null)
    const {userId}=useParams();
    const theme=useTheme();
    const token=useSelector((state)=>state.token)
    const id=useSelector((state)=>state.user._id)
    const isNonMobileScreens=useMediaQuery("(min-width:1000px)")

    const getUser=async ()=>{
        const response=await fetch(`${BaseUrl}/users/${userId}`,
            {
                method: "GET",
                headers: {Authorization : `Bearer ${token}`}
            }
        )
        const data=await response.json();
        setUser(data)
    }

    useEffect(()=>{
        getUser();
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    if(!user) return null;

    return <Box>
    <Box
      width="100%"
      p="2rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      // display="flex"
      gap="2rem"
      justifyContent="center"
    >
      <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
        <UserWidget userId={userId} picturePath={user.picturePath} />
        <Box m="2rem 0" />
        <FriendListWidget userId={userId} isProfile />
      </Box>
      <Box
        flexBasis={isNonMobileScreens ? "50%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
        gap="1rem"
        display="flex"
        flexDirection="column"
      >
        {userId===id && (
          <PostUploadWidget picturePath={user.picturePath} isProfile />
        )}
        <Typography color={theme.palette.neutral.main} 
        variant="h2" 
        fontWeight="500"
        textAlign="center"
        >{user.firstName}'s posts</Typography>
          <FeedsWidget userId={userId} isProfile />
      </Box>
    </Box>
  </Box>
}

export default ProfilePage;