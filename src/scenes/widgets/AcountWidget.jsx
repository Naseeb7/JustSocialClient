import { useTheme } from "@emotion/react";
import { InputOutlined } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "state";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const AccountWidget = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isEditPassword, setisEditPassword] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [picturePath, setPicturePath] = useState(user.picturePath);
  const [location, setLocation] = useState(user.location);
  const [occupation, setOccupation] = useState(user.occupation);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [ConfirmPassword, setConfirmPassword] = useState(null);
  const [success, setSuccess] = useState(true);
  const [wrongPassword, setWrongPassword] = useState(true);
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${BaseUrl}/users/${user._id}/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          location: location,
          occupation: occupation,
          password: password,
        }),
      });
      const updatedUser = await response.json();
      if (updatedUser.success === true) {
        dispatch(setUser({ user: updatedUser.user }));
        setSuccess(true);
        document.getElementById("passwordVerify").value = null;
        setPassword(null);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center" p="1rem 0">
        <UserImage image={user.picturePath} size="200" />
      </Box>
      {!isEdit ? (
        <Box>
          <Divider
            variant="middle"
            textAlign="center"
            sx={{ m: "2rem 1rem", color: theme.palette.neutral.mediumMain }}
          >
            Account Details
          </Divider>
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
            gap="1rem"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              width="60%"
              p="1rem"
            >
              <Typography variant="h5" color={theme.palette.neutral.mediumMain}>
                Name :
              </Typography>
              <Typography variant="h5">
                {user.firstName} {user.lastName}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              width="60%"
              p="1rem"
            >
              <Typography variant="h5" color={theme.palette.neutral.mediumMain}>
                E-mail :
              </Typography>
              <Typography variant="h5">{user.email}</Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              width="60%"
              p="1rem"
            >
              <Typography variant="h5" color={theme.palette.neutral.mediumMain}>
                Location :
              </Typography>
              <Typography variant="h5">{user.location}</Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              width="60%"
              p="1rem"
            >
              <Typography variant="h5" color={theme.palette.neutral.mediumMain}>
                Occupation :
              </Typography>
              <Typography variant="h5">{user.occupation}</Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              width="60%"
              p="1rem"
            >
              <Typography variant="h5" color={theme.palette.neutral.mediumMain}>
                Friends :
              </Typography>
              <Typography variant="h5">{user.friends.length}</Typography>
            </Box>
            <Button
              sx={{
                width: "60%",
                p: ".5rem 0",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.alt,
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={() => {
                setIsEdit(!isEdit);
              }}
            >
              Edit Details
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Divider
            variant="middle"
            sx={{ m: "2rem 1rem", color: theme.palette.neutral.mediumMain }}
          >
            Update Details
          </Divider>
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
            gap="1rem"
            p="1rem"
          >
            <Box
              display="flex"
              justifyContent="space-around"
              alignItems="center"
              flexDirection={isNonMobileScreens ? "row" : "column"}
              width="100%"
              gap=".5rem"
            >
              <TextField
                defaultValue={user.firstName}
                label="First name"
                sx={{ width: isNonMobileScreens ? "50%" : "80%" }}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <TextField
                defaultValue={user.lastName}
                label="Last name"
                sx={{ width: isNonMobileScreens ? "50%" : "80%" }}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </Box>
            <Box display="flex" justifyContent="space-around" width="100%">
              <TextField
                defaultValue={user.location}
                label="Location"
                sx={{
                  width: "80%",
                }}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </Box>
            <Box display="flex" justifyContent="space-around" width="100%">
              <TextField
                defaultValue={user.occupation}
                label="Occupation"
                sx={{
                  width: "80%",
                }}
                onChange={(e) => {
                  setOccupation(e.target.value);
                }}
              />
            </Box>
            <Box display="flex" justifyContent="space-around" width="100%">
              <FormControl sx={{ width: "80%" }} variant="outlined">
                <InputLabel htmlFor="passwordVerify">Password</InputLabel>
                <OutlinedInput
                  id="passwordVerify"
                  error={!success && true}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <FormHelperText error={!success && true}>
                  {success
                    ? "Please enter your password to verify"
                    : "Wrong password! please enter the correct password"}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box display="flex" width="80%" justifyContent="space-evenly">
              <Button
                sx={{
                  p: ".5rem 0",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  "&:hover": { color: theme.palette.primary.main },
                }}
                onClick={handleUpdate}
                disabled={!password && true}
              >
                Update
              </Button>
              <Button
                sx={{
                  p: ".5rem 0",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  "&:hover": { color: "red" },
                }}
                onClick={() => {
                  setIsEdit(!isEdit);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        alignItems="center"
        gap="1rem"
        p="1.5rem 0"
      >
        {isEditPassword && (
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
            gap="1rem"
            p="1rem"
          >
             <FormControl sx={{ width: "80%" }} variant="outlined">
                <InputLabel htmlFor="oldPassword">Old Password</InputLabel>
                <OutlinedInput
                  id="oldPassword"
                  error={!wrongPassword && true}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Old Password"
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                />
                <FormHelperText error={!wrongPassword && true}>
                  {success
                    ? "Please enter your old password to verify"
                    : "Wrong password! please enter the correct password"}
                </FormHelperText>
              </FormControl>

            <TextField
              id="newPassword"
              label="New Password"
              sx={{ width:"80%" }}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              type="password"
            />

            <TextField
              id="confirmPassword"
              label="Confirm new Password"
              sx={{ width:"80%" }}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              error={newPassword!==ConfirmPassword && true}
              helperText={newPassword!==ConfirmPassword && "Both passwords must be same"}
            />
          </Box>
        )}
        <Box display="flex" justifyContent="center" width="100%">
          {!isEditPassword ? (
            <Button
              sx={{
                width: "60%",
                p: ".5rem 0",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.alt,
                "&:hover": { color: theme.palette.primary.main },
              }}
              onClick={() => {
                setisEditPassword(!isEditPassword);
              }}
            >
              Change Password
            </Button>
          ) : (
            <Box display="flex" width="80%" justifyContent="space-evenly">
              <Button
                sx={{
                  p: ".5rem 0",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  "&:hover": { color: theme.palette.primary.main },
                }}
                disabled={!password && true}
              >
                Update
              </Button>
              <Button
                sx={{
                  p: ".5rem 0",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  "&:hover": { color: "red" },
                }}
                onClick={() => {
                  setisEditPassword(!isEditPassword);
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountWidget;
