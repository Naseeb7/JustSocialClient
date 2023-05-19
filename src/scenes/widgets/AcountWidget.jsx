import { useTheme } from "@emotion/react";
import { PhotoCameraOutlined } from "@mui/icons-material";
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
import UserImage from "components/UserImage";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "state";
import Lottie from "lottie-react";
import animationData from "animations/uploading.json";
import animationData2 from "animations/loading.json";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const AccountWidget = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEditPassword, setisEditPassword] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [location, setLocation] = useState(user.location);
  const [occupation, setOccupation] = useState(user.occupation);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [ConfirmPassword, setConfirmPassword] = useState(null);
  const [success, setSuccess] = useState(true);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profilePicLoading, setProfilePicLoading] = useState(false);
  const [image, setImage] = useState(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate=useNavigate()

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUpdate = async () => {
      setUpdateLoading(true)
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
      setUpdateLoading(false)
  };

  const handleChangePassword = async () => {
    setPasswordLoading(true)
    if (
      newPassword === ConfirmPassword &&
      newPassword !== "" &&
      oldPassword !== newPassword
    ) {
      const response = await fetch(
        `${BaseUrl}/users/${user._id}/changepassword`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: oldPassword,
            newPassword: newPassword,
          }),
        }
      );
    setPasswordLoading(false)
      const updatedUser = await response.json();
      if (updatedUser.success === false) {
        setWrongPassword(true);
      } else if (updatedUser.success === true) {
        document.getElementById("Notification").innerHTML =
          "Password changed successfully";
        setTimeout(() => {
          document.getElementById("Notification").innerHTML = "";
        }, 5000);
        document.getElementById("oldPassword").value = null;
        document.getElementById("newPassword").value = null;
        document.getElementById("confirmPassword").value = null;
      }
    } else if (oldPassword === newPassword) {
      document.getElementById("Notification").innerHTML =
        "Old and new passwords cannot be same";
      setTimeout(() => {
        document.getElementById("Notification").innerHTML = "";
      }, 5000);
    }
  };

  const handleDeleteAccount=async ()=>{
    const response = await fetch(
      `${BaseUrl}/users/${user._id}/deleteuser`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-Type": "application/json",
        },
        body: JSON.stringify({password : password}),
      }
    );
    const data=await response.json();
    if(data.success===true){
      navigate("/")
    }else{
      setSuccess(false)
    }
  }

  const handleProfilePicture = async () => {
    setProfilePicLoading(true)
    const formData = new FormData();
    formData.append("picture", image);
    formData.append("newPicturePath", image.name);
    formData.append("currentPicturePath", user.picturePath);
    const response = await fetch(`${BaseUrl}/users/${user._id}/changepicture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const updatedUser = await response.json();
    setProfilePicLoading(false)
    if (updatedUser.success === true) {
      dispatch(setUser({ user: updatedUser.user }));
      setImage(null);
      document.getElementById("pictureNotification").innerHTML =
        "Profile picture changed successfully!";
      setTimeout(() => {
        document.getElementById("pictureNotification").innerHTML = "";
      }, 2000);
    } else {
      document.getElementById("pictureNotification").innerHTML =
        "Something went wrong! Please try again!";
      setTimeout(() => {
        document.getElementById("pictureNotification").innerHTML = "";
      }, 2000);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
        position="relative"
      >
        {!image ? (
          <Box
            display="flex"
            flexDirection="column"
            p="2rem"
            justifyContent="center"
            alignItems="center"
          >
            <UserImage image={user.picturePath} size="200" />

            <Dropzone
              acceptedFiles=".jpg, .jpeg, .png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  display="flex"
                  width="100%"
                  p=".6rem"
                  m=".5rem"
                  backgroundColor={theme.palette.background.default}
                  borderRadius="1rem"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: theme.palette.background.alt,
                      color: theme.palette.neutral.main,
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  {!image && (
                    <Box display="flex">
                      <PhotoCameraOutlined /> Change profile picture
                    </Box>
                  )}
                </Box>
              )}
            </Dropzone>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap=".75rem"
            p="1rem"
          >
            <img
              src={URL.createObjectURL(image)}
              height="200px"
              width="200px"
              style={{ objectFit: "cover", borderRadius: "50%" }}
              alt={image.name}
            />
            Preview
            <Box display="flex" width="100%" justifyContent="space-evenly">
              {profilePicLoading ? (
                <Lottie
                animationData={animationData}
                loop={true}
              />
              ):(
                <Button
                sx={{
                  p: ".25rem 0",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  "&:hover": { color: theme.palette.primary.main },
                }}
                onClick={handleProfilePicture}
              >
                Change
              </Button>
              )}
              <Button
                sx={{
                  p: ".25rem 0",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  "&:hover": { color: "red" },
                }}
                onClick={() => {
                  setImage(null);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
        <Typography
          position="absolute"
          bottom="0"
          m=".5rem"
          id="pictureNotification"
          sx={{ color: theme.palette.primary.main }}
        ></Typography>
      </Box>
      {!isEdit ? (
        <Box>
          <Divider
            variant="middle"
            textAlign="center"
            sx={{ m: "1rem", color: theme.palette.neutral.mediumMain }}
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
                setisEditPassword(false)
                setIsDelete(false)
                setSuccess(true)
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
            <Box display="flex" width="50%" justifyContent="space-between">
              {updateLoading ? (
                <Lottie
                animationData={animationData2}
                loop={true}
              />
              ) : (
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
              )}
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
            position="relative"
          >
            <FormControl sx={{ width: "80%" }} variant="outlined">
              <InputLabel htmlFor="oldPassword">Old Password</InputLabel>
              <OutlinedInput
                id="oldPassword"
                error={wrongPassword && true}
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
                  setWrongPassword(false);
                }}
              />
              <FormHelperText error={wrongPassword && true}>
                {!wrongPassword
                  ? "Please enter your current password to verify"
                  : "Wrong password! please enter the correct password"}
              </FormHelperText>
            </FormControl>

            <TextField
              id="newPassword"
              label="New Password"
              sx={{ width: "80%" }}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              type="password"
            />

            <TextField
              id="confirmPassword"
              label="Confirm new Password"
              sx={{ width: "80%" }}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              error={newPassword !== ConfirmPassword && true}
              helperText={
                newPassword !== ConfirmPassword && "Both passwords must be same"
              }
            />

            <Typography
              position="absolute"
              bottom="-1rem"
              m=".5rem"
              id="Notification"
              sx={{ color: theme.palette.primary.main }}
            ></Typography>
          </Box>
        )}
        <Box display="flex" justifyContent="center" width="100%" m=".75rem">
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
                setIsEdit(false)
                setIsDelete(false)
              }}
            >
              Change Password
            </Button>
          ) : (
            <Box display="flex" width="50%" justifyContent="space-between">
              {passwordLoading ? (
                <Lottie
                animationData={animationData2}
                loop={true}
              />
              ) : (
                <Button
                sx={{
                  p: ".5rem 0",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  "&:hover": { color: theme.palette.primary.main },
                }}
                disabled={
                  (!oldPassword ||
                    ConfirmPassword === "" ||
                    newPassword !== ConfirmPassword) &&
                  true
                }
                onClick={handleChangePassword}
              >
                Change
              </Button>
              )}
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
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        alignItems="center"
        gap="1rem"
        p="1.5rem 0"
      >
        {isDelete ? (
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
            gap="1.5rem"
            p="1rem"
          >
            <Box display="flex" flexDirection="column" alignItems="center" color={theme.palette.neutral.main}>
            <Typography variant="h5" fontWeight="500">Are you sure you want to delete the account?</Typography>
            <Typography fontSize="x-small">**This action cannot be undone!</Typography>
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
                  "&:hover": { color: "red" },
                }}
                onClick={handleDeleteAccount}
              >
                Delete
              </Button>
              <Button
                sx={{
                  p: ".5rem 0",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.alt,
                  "&:hover": { color: theme.palette.primary.main },
                }}
                onClick={() => {
                  setIsDelete(!isDelete);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Button
            sx={{
              width: "60%",
              p: ".5rem 0",
              backgroundColor: "red",
              color: theme.palette.primary.light,
              "&:hover": { color: theme.palette.primary.main ,backgroundColor: "#FFCCCB" },
            }}
            onClick={() => {
              setIsDelete(!isDelete);
              setisEditPassword(false)
              setIsEdit(false)
            }}
          >
            Delete account
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AccountWidget;
