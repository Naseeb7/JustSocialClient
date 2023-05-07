import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const FriendsListWidget = ({ userId, isProfile=false }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const id = useSelector((state) => state.user._id);
  const [userFriends, setUserFriends] = useState([]);

  const getFriends = async () => {
    const response = await fetch(`${BaseUrl}/users/${userId}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (userId === id) {
      dispatch(setFriends({ friends: data }));
    } else {
      setUserFriends(data);
    }
  };

  useEffect(() => {
    getFriends();
  }, [isProfile ? friends : null]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={theme.palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        mb="1.5rem"
      >
        Friends List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {userId === id ? (
          <Box gap="1.5rem" display="flex" flexDirection="column">
            {friends.length !==0 ? (
              <Box>
               { friends.map((friend) => (
                <Friend
                  key={`${friend._id}${friend.firstName}`}
                  friendId={friend._id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  subtitle={friend.occupation}
                  userPicturePath={friend.picturePath}
                />
              ))}
              </Box>
              ):(
                <Typography sx={{color : theme.palette.neutral.light }}>No friends to show</Typography>
              )}
          </Box>
        ) : (
          <Box gap="1.5rem" display="flex" flexDirection="column">
            {userFriends.length !==0 ? (
              <Box>
               { userFriends.map((friend) => (
                <Friend
                  key={`${friend._id}${friend.firstName}`}
                  friendId={friend._id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  subtitle={friend.occupation}
                  userPicturePath={friend.picturePath}
                />
              ))}
              </Box>
              ):(
                <Typography sx={{color : theme.palette.neutral.light }}>No friends to show</Typography>
              )}
          </Box>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendsListWidget;
