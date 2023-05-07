import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const Friend = ({ friendId, name, subtitle, userPicturePath, size, isProfile=false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
      const response = await fetch(`${BaseUrl}/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size={size ? size : "55px"} />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize=".75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {(_id!==friendId && !isProfile) && (
        <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: ".6rem" }}
      >
        {isFriend ? (
            <PersonRemoveOutlined fontSize={size ? "small" : "medium"} sx={{color: primaryDark,}} />
        ) : (
            <PersonAddOutlined sx={{color: primaryDark}} />
        )}
      </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
