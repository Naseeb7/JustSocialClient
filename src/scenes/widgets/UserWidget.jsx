import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  PersonRemoveOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setFriends } from "state";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const friendId=useParams()
  const token = useSelector((state) => state.token);
  const {_id} = useSelector((state) => state.user);
  const userFriends = useSelector((state) => state.user.friends);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const primaryDark = palette.primary.dark;
  const primaryLight = palette.primary.light;
  const dispatch=useDispatch()

  const isFriend = userFriends.find((friend) => friend._id === userId);

  const getUser = async () => {
    const response = await fetch(`${BaseUrl}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const patchFriend = async () => {
      const response = await fetch(`${BaseUrl}/users/${_id}/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
  };

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* First Row */}
      <FlexBetween
        gap=".5rem"
        pb="1.1rem"
      >
        <FlexBetween gap="1rem" onClick={() => {
          navigate(`/profile/${userId}`);
        }}>
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        {userId===_id ? ( 
        <IconButton onClick={()=>{navigate(`/account/${user._id}`)}}>
        <ManageAccountsOutlined />
        </IconButton>
        ):(
          <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: ".6rem" }}
      >
        {isFriend ? (
            <PersonRemoveOutlined sx={{color: primaryDark,}} />
        ) : (
            <PersonAddOutlined sx={{color: primaryDark}} />
        )}
      </IconButton>
        )}
      </FlexBetween>

      <Divider />

      {/* Second Row */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb=".5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>
              
      <Divider />        
      {/* Third Row */}
      <Box p="1rem 0">
        <FlexBetween mb=".5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your posts</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />
      {/* Fourth Row */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>
        <FlexBetween gap="1rem" mb=".5rem">
          <FlexBetween gap="1rem">
            <img src="https://i.ibb.co/PCtBMxY/twitter.png" alt="twitter" />
            <Typography color={main} fontWeight="500">
              Twitter
            </Typography>
            <Typography color={medium}>Social Network</Typography>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="https://i.ibb.co/5M9D679/linkedin.png" alt="linkedin" />
            <Typography color={main} fontWeight="500">
              LinkedIn
            </Typography>
            <Typography color={medium}>Network Platform</Typography>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
