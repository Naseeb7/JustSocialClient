import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeeds } from "state";
import PostWidget from "./PostWidget";
import Lottie from "lottie-react";
import animationData from "../../animations/loading.json";
import { Box } from "@mui/material";

const BaseUrl=process.env.REACT_APP_BASE_URL

const FeedsWidget=({userId, isProfile=false, socket})=>{
    const dispatch=useDispatch()
    const posts=useSelector((state)=> state.posts);
    const token=useSelector((state)=> state.token);
    const [loading,setLoading]=useState(false)
    
    const getFeeds=async ()=>{
        setLoading(true)
        const response=await fetch(`${BaseUrl}/posts`,{
            method: "GET",
            headers : {Authorization : `Bearer ${token}`},
        })
        const data=await response.json();
        dispatch(setFeeds({posts : data}));
        setLoading(false)
    }
    const getUserPosts=async ()=>{
        const response=await fetch(`${BaseUrl}/posts/${userId}/posts`,{
            method: "GET",
            headers : {Authorization : `Bearer ${token}`},
        })
        const data=await response.json();
        dispatch(setFeeds({posts : data}));
    }

    useEffect(()=>{
        if(isProfile){
            getUserPosts();
        } else{
            getFeeds();
        }
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    return (
         <>
         {loading ? (
            <Box
            display="flex"
            justifyContent="center"
            mt=".5rem"
               // border="2px solid red"
            >
            <Lottie
               animationData={animationData}
               loop={true}
               style={{
                 width: "10%",
                 height: "100%",
                 // border: "2px solid green",
               }}
             />
            </Box>
         ) : (
            posts.slice(0).reverse().map(
                ({
                    _id,
                    userId,
                    firstName,
                    lastName,
                    description,
                    location,
                    picturePath,
                    userPicturePath,
                    likes,
                    comments,
                })=>(
                    // <>{lastName}</>
                    <PostWidget 
                    key={_id}
                    postId={_id}
                    postUserId={userId}
                    name={`${firstName} ${lastName}`}
                    description={description}
                    location={location}
                    picturePath={picturePath}
                    userPicturePath={userPicturePath}
                    likes={likes}
                    comments={comments}
                    isProfile={isProfile}
                    socket={socket}
                    />
                )
            )
        )}
        </>
    )
}
export default FeedsWidget;