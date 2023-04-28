import { useTheme } from "@emotion/react";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import UserImage from "components/UserImage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navBar";
import PostWidget from "scenes/widgets/PostWidget";
import { setPost } from "state";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const Postpage = () => {
  const [comment, setComment] = useState(null);
  const { postId } = useParams();
  const posts = useSelector((state) => state.posts);
  const [currentPost, setCurrentPost] = useState(null);
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");

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
  }, [posts]);

  const handleComment = async () => {
    if (comment) {
      const response = await fetch(`${BaseUrl}/posts/${postId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUser._id,
          firstName: loggedInUser.firstName,
          lastName: loggedInUser.lastName,
          comment: comment,
          userPicturePath: loggedInUser.picturePath,
        }),
      });
      const updatedPost = await response.json();
      setCurrentPost(updatedPost);
      setComment(null);
      document.getElementById("commentText").value = null;
    }
  };



  const enterPress = (e) => {
    if (e.key === "Enter") {
      document.getElementById("commentBtn").click();
    }
  };

  return (
    currentPost && (
      <Box>
        <Navbar />
        <Box
          width="100%"
          p="1rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          // display="flex"
          gap=".5rem"
          justifyContent="center"
        >
          <Box
            flexBasis="50%"
            sx={{ background: theme.palette.background.alt }}
            borderRadius=".75rem"
          >
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
              isPostPage
            />
            <Box
              color={theme.palette.primary.main}
              //   border="2px solid red"
              display="flex"
              margin="0 2rem"
            >
              <Box
                sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}
              >
                <UserImage image={loggedInUser.picturePath} size="35px" />
                <TextField
                  id="commentText"
                  multiline
                  maxRows={6}
                  size="small"
                  sx={{ ml: ".5rem", width: "100%" }}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={enterPress}
                />
              </Box>
              <Button
                id="commentBtn"
                size="small"
                variant="standard"
                sx={{
                  padding: "0 1rem",
                }}
                onClick={handleComment}
              >
                Comment
              </Button>
            </Box>

            <Divider variant="middle" textAlign="left" sx={{ m: "2rem 1rem" }}>
              Comments
            </Divider>

            <Box
              display="flex"
              flexDirection="column"
              margin="1rem 2rem"
              background={theme.palette.background.alt}
            >
              {currentPost.comments.map((comment) => {
                return (
                  <Box mb="2rem">
                    <Box>
                      <Friend
                        friendId={comment.userId}
                        name={`${comment.firstName} ${comment.lastName}`}
                        userPicturePath={comment.userPicturePath}
                        size="25px"
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mt=".5rem"
                    >
                      <Typography
                        color={theme.palette.neutral.darker}
                        sx={{
                          fontWeight: "700",
                          m: ".5rem 0",
                          width: "75%",
                        }}
                      >
                        {comment.comment}
                      </Typography>
                      <Typography
                        color={theme.palette.neutral.main}
                        sx={{
                          fontSize: "x-small",
                          width: "20%",
                        }}
                      >
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {comment.userId===loggedInUser._id  && 
                    <IconButton onClick={async ()=>{
                        const response = await fetch(`${BaseUrl}/posts/${postId}/commentdelete/${comment._id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          const data = await response.json();
                          setCurrentPost(data)
                    }}>
                      <DeleteOutlineOutlined fontSize="small" />
                    </IconButton>}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    )
  );
};

export default Postpage;
