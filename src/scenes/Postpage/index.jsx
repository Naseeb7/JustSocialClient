import { useTheme } from "@emotion/react";
import { Box, Button, InputBase, TextField, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navBar";
import PostWidget from "scenes/widgets/PostWidget";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const Postpage = () => {
  const [currentPost, setCurrentPost] = useState(null);
  const [comment, setComment] = useState(null);
  const [isComments, setIsComments] = useState(false);
  const { postId } = useParams();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const theme=useTheme()

  const getPost = async () => {
    const response = await fetch(`${BaseUrl}/posts/${postId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCurrentPost(data);
  };

  useEffect(() => {
    getPost();
  }, []);

  const handleComment =async () => {
    if(comment){
        const response = await fetch(`${BaseUrl}/posts/${postId}/comment`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "content-Type": "application/json",
            },
            body: JSON.stringify({ userId: loggedInUser._id,
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                comment: comment,
                userPicturePath: loggedInUser.picturePath}),
          });
          const updatedPost = await response.json();
          console.log(updatedPost)
          setCurrentPost(updatedPost)
    }
    };

  return (currentPost &&
    <Box>
        <Navbar/>
      <FlexBetween>
        <PostWidget
          postId={currentPost._id}
          postUserId={currentPost.userId}
          name={`${currentPost.firstName} ${currentPost.lastName}`}
          description={currentPost.description}
          location={currentPost.location}
          picturePath={currentPost.picturePath}
          userPicturePath={currentPost.userPicturePath}
          likes={currentPost.likes}
          comments={currentPost.comments}
        />
      </FlexBetween>
      <Box color={theme.palette.primary.main} sx={{background:theme.palette.background.alt}}>
        <TextField onChange={(e) => setComment(e.target.value)} />
        <Button onClick={handleComment}>Comment</Button>
      </Box>
      <FlexBetween display="flex" flexDirection="column" background={theme.palette.background.alt}>
        {currentPost.comments.map((comment)=>{
            return <Box mt="1rem">
                <UserImage image={comment.userPicturePath} size="55px" />
            <Typography color={theme.palette.neutral.main}>{comment.firstName} {comment.lastName}</Typography>
            <Typography color={theme.palette.neutral.main}>{comment.comment}</Typography>
            <Typography color={theme.palette.neutral.main}>{new Date(comment.createdAt).toLocaleString()}</Typography>
            </Box>
        })}
      </FlexBetween>
    </Box>
  );
};

export default Postpage;
