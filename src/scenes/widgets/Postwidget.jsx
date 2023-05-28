import {
  ChatBubbleOutlineOutlined,
  DeleteOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
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
  isPostPage = false,
  isProfile = false,
  socket
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const navigate = useNavigate();

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
    if(!isLiked){
      socket.current.emit("send-notification", {
        from: loggedInUserId,
        to: postUserId,
        userId: loggedInUserId,
        toUserId: postUserId,
        postId: postId,
        firstName: user.firstName,
        lastName: user.lastName,
        type: "post",
        notification: `${user.firstName} ${user.lastName} liked your post.`,
        userPicturePath: user.picturePath,
        postPicturePath: picturePath,
        read : false,
      });
    }
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handlePostDelete = async () => {
    const response = await fetch(
      `${BaseUrl}/posts/${loggedInUserId}/${postId}/deletepost`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-Type": "application/json",
        },
        body: JSON.stringify({ picturePath: picturePath }),
      }
    );
    const data = await response.json();
    if (isProfile) {
      dispatch(setFeeds({ posts: data.userposts }));
    } else {
      dispatch(setFeeds({ posts: data.posts }));
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        isProfile={isProfile}
        socket={socket}
      />
      <Typography
        color={main}
        mt="1rem"
        onClick={() => {
          !isPostPage && navigate(`/post/${postId}`);
        }}
      >
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: ".75rem", mt: ".75rem" }}
          src={`${BaseUrl}/assets/${picturePath}`}
          onClick={() => {
            !isPostPage && navigate(`/post/${postId}`);
          }}
          onError={(e)=>{
            e.target.onError = null;
            e.target.src="https://i.ibb.co/zx3dYdR/no-image.jpg"
        }}
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
          {!isPostPage && (
            <FlexBetween gap=".3rem">
              <IconButton
                onClick={() => {
                  !isPostPage && navigate(`/post/${postId}`);
                }}
              >
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          )}
        </FlexBetween>
        <Box>
          {loggedInUserId === postUserId && (
            <IconButton onClick={handlePostDelete}>
              <DeleteOutlineOutlined />
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              navigator.clipboard.writeText(`${BaseUrl}/posts/${postId}`);
            }}
          >
            <ShareOutlined />
          </IconButton>
        </Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default PostWidget;
