import { useState } from "react";
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
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setisMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

    const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75 rem">
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
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding=".1rem 1.5rem"
            ml=".5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
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
          <IconButton>
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
              <MenuItem value={fullName}>
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
              <InputBase placeholder="Search..." />
              <IconButton>
                <Search />
              </IconButton>
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
