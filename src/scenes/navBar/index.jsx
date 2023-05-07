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
  Divider,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setUsers } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const Navbar = () => {
  const [isMobileMenuToggled, setisMobileMenuToggled] = useState(false);
  const [q, setQ] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.users);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

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
  }, []);

  let result = users.filter((user) => {
    if (
      user.firstName.toLowerCase().includes(q.toLowerCase()) ||
      user.lastName.toLowerCase().includes(q.toLowerCase())
    ) {
      return user;
    }
    return null;
  });

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
                        onClick={()=>{navigate(`/profile/${user._id}`)}}
                      >
                        <UserImage image={user.picturePath} size="20px" />
                        <Typography>{user.firstName}</Typography>
                        <Typography>{user.lastName}</Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Box  display="flex"
                  gap=".5rem"
                  p=".5rem 1rem"
                  m=".5rem 1rem"
                  borderRadius="1rem">
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
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <Message sx={{ color: dark, fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={() => navigate("/notifications")}>
            <Notifications sx={{ color: dark, fontSize: "25px" }} />
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
        <Box>
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

          <IconButton
            onClick={() => setisMobileMenuToggled(!isMobileMenuToggled)}
            sx={{
              "&:focus": {
                color: theme.palette.neutral.medium,
              },
            }}
          >
            <Menu />
          </IconButton>
        </Box>
      )}

      {/* Mobile Nav */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          background={background}
        >
          {/* Close Icon */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setisMobileMenuToggled(!isMobileMenuToggled)}
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
            gap="3rem"
          >
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="2rem"
              padding=".1rem .8rem"
            >
              <InputBase
                placeholder="Search..."
                onChange={(e) => setQ(e.target.value)}
              />
            </FlexBetween>
            <Message sx={{ color: dark, fontSize: "25px" }} />
            <Notifications sx={{ color: dark, fontSize: "25px" }} />
            <Help sx={{ color: dark, fontSize: "25px" }} />
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
                <MenuItem value={fullName}>
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
