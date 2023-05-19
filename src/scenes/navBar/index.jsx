import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  setMode,
  setLogout,
  setUsers,
  addNotification,
  setNotifications,
} from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";

const BaseUrl = process.env.REACT_APP_BASE_URL;
const url = process.env.REACT_APP_HOST_URL;

const Navbar = ({ socket }) => {
  const [isMobileMenuToggled, setisMobileMenuToggled] = useState(false);
  const [q, setQ] = useState("");
  const [notificationcounter, setNotificationcounter] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.users);
  const mode = useSelector((state) => state.mode);
  const notifications = useSelector((state) => state.notifications);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notification) => notification.read === false
    ).length;
    setNotificationcounter(unreadNotifications);
  }, [notifications]); //eslint-disable-line react-hooks/exhaustive-deps

  const getUserNotifications = async () => {
    const response = await fetch(`${BaseUrl}/users/${user._id}/notifications`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setNotifications({ notifications: data }));
  };

  useEffect(() => {
    getUserNotifications();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const getAllUsers = async () => {
    const response = await fetch(`${BaseUrl}/users/${user._id}/getallusers`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setUsers({ users: data }));
  };

  useEffect(() => {
    getAllUsers();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  let result = users.filter((user) => {
    if (
      user.firstName.toLowerCase().includes(q.toLowerCase()) ||
      user.lastName.toLowerCase().includes(q.toLowerCase())
    ) {
      return user;
    }
    return null;
  });

  useEffect(() => {
    if (socket.current) {
      socket.current.off("get-notification");
      socket.current.on("get-notification", (data) => {
        const newNotification = {
          userId: data.userId,
          toUserId: data.toUserId,
          postId: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          type: data.type,
          notification: data.notification,
          userPicturePath: data.userPicturePath,
          postPicturePath: data.postPicturePath,
          read: window.location.href === `${url}/notifications` ? true : false,
        };
        dispatch(addNotification({ notification: newNotification }));
      });
    }
  }, [user]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75 rem" width="33%">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          JustSocial
        </Typography>
        {isNonMobileScreens && (
          <Box
            display="flex"
            flexDirection="column"
            position="relative"
            ml=".5rem"
            width="60%"
          >
            <InputBase
              sx={{
                backgroundColor: neutralLight,
                borderRadius: "9px",
                gap: "3rem",
                padding: ".1rem",
                pl: "1.5rem",
              }}
              placeholder="Search..."
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <Box
                display="flex"
                flexDirection="column"
                position="absolute"
                top="100%"
                zIndex="20"
                backgroundColor={theme.palette.background.alt}
                borderRadius="1rem"
              >
                {result.length !== 0 ? (
                  result.map((user) => {
                    return (
                      <Box
                        key={user._id}
                        display="flex"
                        gap=".5rem"
                        p=".5rem 1rem"
                        m=".5rem 1rem"
                        borderRadius="1rem"
                        sx={{
                          "&:hover": {
                            backgroundColor: theme.palette.background.default,
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => {
                          navigate(`/profile/${user._id}`);
                          navigate(0);
                        }}
                      >
                        <UserImage image={user.picturePath} size="20px" />
                        <Typography>{user.firstName}</Typography>
                        <Typography>{user.lastName}</Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Box
                    display="flex"
                    gap=".5rem"
                    p=".5rem 1rem"
                    m=".5rem 1rem"
                    borderRadius="1rem"
                  >
                    <Typography>No users with that name</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </FlexBetween>

      {/* Desktop Nav*/}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton
            onClick={() => {
              dispatch(setMode());
              setQ("");
            }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              navigate(`/${user._id}/chatroom`);
              setQ("");
            }}
          >
            <Message sx={{ color: dark, fontSize: "25px" }} />
          </IconButton>
          <IconButton
            onClick={() => {
              navigate("/notifications");
              setQ("");
            }}
          >
            <Badge badgeContent={notificationcounter} color="primary">
              <Notifications sx={{ color: dark, fontSize: "25px" }} />
            </Badge>
          </IconButton>
          <IconButton>
            <Help sx={{ color: dark, fontSize: "25px" }} />
          </IconButton>

          <FormControl variant="standard" value={fullName}>
            {/* <FormControl variant="standard"> */}
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: ".25rem",
                p: ".25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: ".25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem
                value={fullName}
                onClick={() => {
                  navigate(`/profile/${user._id}`);
                  navigate(0);
                }}
              >
                {/* <MenuItem> */}
                <Typography>{fullName}</Typography>
                {/* <Typography>Pradosh Chand</Typography> */}
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        !isMobileMenuToggled && (
          <Box>
            <IconButton
              onClick={() => setisMobileMenuToggled(!isMobileMenuToggled)}
              sx={{
                "&:focus": {
                  color: theme.palette.neutral.medium,
                },
              }}
            >
              <Badge
                color="primary"
                variant="dot"
                invisible={notificationcounter === 0 ? true : false}
              >
                <Menu />
              </Badge>
            </IconButton>
          </Box>
        )
      )}

      {/* Mobile Nav */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          top="0"
          p=".5rem"
          height="100%"
          gap="2rem"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={
            mode === "dark"
              ? "rgba(0, 0, 0, 0.655)"
              : "rgba(255, 255, 255, 0.675)"
          }
          borderRadius="1rem"
          // border="2px solid red"
        >
          {/* Close Icon */}
          <Box display="flex" justifyContent="flex-end" p=".15rem">
            <IconButton
              onClick={() => {
                setisMobileMenuToggled(!isMobileMenuToggled);
                setQ("");
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Menu Items */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="5rem"
          >
            <Box
              backgroundColor={neutralLight}
              borderRadius="1rem"
              gap="2rem"
              padding=".1rem .8rem"
              position="relative"
            >
              <InputBase
                placeholder="Search..."
                onChange={(e) => setQ(e.target.value)}
              />
              {q && (
                <Box
                  display="flex"
                  flexDirection="column"
                  position="absolute"
                  top="100%"
                  left="0"
                  zIndex="20"
                  backgroundColor={theme.palette.background.default}
                  borderRadius="1rem"
                >
                  {result.length !== 0 ? (
                    result.map((user) => {
                      return (
                        <Box
                          key={user._id}
                          display="flex"
                          gap=".5rem"
                          p=".5rem 1rem"
                          m=".5rem 1rem"
                          borderRadius="1rem"
                          sx={{
                            "&:hover": {
                              backgroundColor: theme.palette.background.alt,
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => {
                            navigate(`/profile/${user._id}`);
                            navigate(0);
                          }}
                        >
                          <UserImage image={user.picturePath} size="20px" />
                          <Typography>{user.firstName}</Typography>
                          <Typography>{user.lastName}</Typography>
                        </Box>
                      );
                    })
                  ) : (
                    <Box
                      display="flex"
                      gap=".5rem"
                      p=".5rem 1rem"
                      m=".5rem 1rem"
                      borderRadius="1rem"
                    >
                      <Typography>No users with that name</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <IconButton
              onClick={() => {
                navigate(`/${user._id}/chatroom`);
                setisMobileMenuToggled(!isMobileMenuToggled);
                setQ("");
              }}
            >
              <Message sx={{ color: dark, fontSize: "25px" }} />
            </IconButton>
            <IconButton
              onClick={() => {
                navigate("/notifications");
                setisMobileMenuToggled(!isMobileMenuToggled);
                setQ("");
              }}
            >
              <Badge badgeContent={notificationcounter} color="primary">
                <Notifications sx={{ color: dark, fontSize: "25px" }} />
              </Badge>
            </IconButton>
            <IconButton>
              <Help sx={{ color: dark, fontSize: "25px" }} />
            </IconButton>

            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>

            <FormControl variant="standard" value={fullName}>
              {/* <FormControl variant="standard"> */}
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: ".25rem",
                  p: ".25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: ".25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem
                  value={fullName}
                  onClick={() => {
                    navigate(`/profile/${user._id}`);
                    navigate(0);
                  }}
                >
                  {/* <MenuItem> */}
                  <Typography>{fullName}</Typography>
                  {/* <Typography>Pradosh Chand</Typography> */}
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
