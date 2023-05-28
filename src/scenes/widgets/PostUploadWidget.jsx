import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
  AddLocationAltOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeeds } from "state";
import Lottie from "lottie-react";
import animationData from "animations/uploading.json";

const BaseUrl = process.env.REACT_APP_BASE_URL;

const PostUploadWidget = ({ picturePath, isProfile = false }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [isLocation, setIsLocation] = useState(false);
  const [location, setLocation] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const [loading, setLoading] = useState(false);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    formData.append("location", location);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
    const response = await fetch(`${BaseUrl}/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await response.json();
    if (isProfile) {
      dispatch(setFeeds({ posts: data.userposts }));
    } else {
      dispatch(setFeeds({ posts: data.posts }));
    }
    setImage(null);
    setPost("");
    setLocation("");
    setIsImage(false);
    setLoading(false)
  };

  return (
    <WidgetWrapper>
      <Box display="flex" justifyContent="space-around">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="what's on your mind today?"
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "75%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            p: "1rem 2rem",
          }}
          multiline
        />
      </Box>
      {isLocation && (
        <Box
          display="flex"
          gap="1rem"
          mt="1rem"
          width="100%"
          justifyContent="center"
        >
          <InputBase
            placeholder="location"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            sx={{
              width: "55%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              p: ".2rem 1rem",
            }}
          />
        </Box>
      )}
      {isImage && (
        <Box
          borderRadius="10px"
          border={`1px solid ${medium}`}
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg, .jpeg, .png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  padding="1rem"
                  width="100%"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap=".25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>
        {isNonMobileScreens ? (
          <>
            <FlexBetween
              gap=".25rem"
              onClick={() => setIsLocation(!isLocation)}
            >
              <AddLocationAltOutlined sx={{ color: mediumMain }} />
              <Typography
                sx={{
                  color: mediumMain,
                  "&:hover": { cursor: "pointer", color: medium },
                }}
              >
                Location
              </Typography>
            </FlexBetween>
          </>
        ) : (
          <>
            <FlexBetween
              gap=".25rem"
              onClick={() => setIsLocation(!isLocation)}
            >
              <AddLocationAltOutlined sx={{ color: mediumMain }} />
              <Typography
                sx={{
                  color: mediumMain,
                  "&:hover": { cursor: "pointer", color: medium },
                }}
              >
                Location
              </Typography>
            </FlexBetween>
          </>
        )}

        {loading ? (
          <Lottie
            animationData={animationData}
            loop={true}
          />
        ) : (
          <Button
            disabled={!post}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        )}
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default PostUploadWidget;
