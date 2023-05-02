import {
  ChatBubbleOutlineOutlined,
  DeleteOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFeeds, setPost } from "state";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  isPostPage=false
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const navigate=useNavigate()

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`${BaseUrl}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handlePostDelete=async ()=>{
    const response = await fetch(`${BaseUrl}/posts/${postId}/deletepost`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "content-Type": "application/json",  },
      body: JSON.stringify({ picturePath: picturePath }),
    });
    const data = await response.json();
    dispatch(setFeeds({posts : data}))
  }

  return (
    <WidgetWrapper
      m="2rem 0"
    >
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} mt="1rem" onClick={() => {!isPostPage && navigate(`/post/${postId}`)}}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: ".75rem", mt: ".75rem" }}
          src={`${BaseUrl}/assets/${picturePath}`}
          onClick={() => {!isPostPage && navigate(`/post/${postId}`)}}
        />
      )}
      <FlexBetween mt=".25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap=".3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          {!isPostPage && <FlexBetween gap=".3rem">
            <IconButton onClick={() => {!isPostPage && navigate(`/post/${postId}`)}} >
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>}
        </FlexBetween>
        <Box>
        {loggedInUserId===postUserId && <IconButton onClick={handlePostDelete}>
          <DeleteOutlineOutlined />
        </IconButton>}
        <IconButton onClick={()=>{navigator.clipboard.writeText(`${BaseUrl}/posts/${postId}`)}}>
          <ShareOutlined />
        </IconButton>
        </Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default PostWidget;
