import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
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

const BaseUrl = process.env.REACT_APP_BASE_URL;

const PostUploadWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isMobileMenuToggled, setisMobileMenuToggled] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [location, setLocation] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
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
    const posts = await response.json();
    dispatch(setFeeds({ posts }));
    setImage(null);
    setPost("");
    setLocation("")
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="what's on your mind today?"
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            p: "1rem 2rem",
          }}
        />
      </FlexBetween>
        <Box display="flex" gap="1rem" mt="1rem" width="100%" justifyContent="center">
        <InputBase
          placeholder="location"
          onChange={(e) => setLocation(e.target.value)}
          value={location}
          sx={{
            width: "30%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            p: ".2rem .5rem",
            textAlign:"center",
          }}
        />
        </Box>
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
            <FlexBetween gap=".25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography sx={{ color: mediumMain }}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap=".25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography sx={{ color: mediumMain }}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap=".25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography sx={{ color: mediumMain }}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <>
            <FlexBetween gap=".25rem" border="1px solid red" onClick={()=>{setisMobileMenuToggled(!isMobileMenuToggled)}}>
                <MoreHorizOutlined sx={{color : mediumMain}} />
            </FlexBetween>
          </>
        )}

        

        <Button 
            disabled={!post}
            onClick={handlePost}
            sx={{
                color: palette.background.alt,
                backgroundColor : palette.primary.main,
                borderRadius : "3rem"
            }}>Post</Button>
      </FlexBetween>
      {isMobileMenuToggled && (
          <Box
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          background={palette.background.alt}
          border="2px solid red"
        >

          {/* Menu Items */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <FlexBetween gap=".25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography sx={{ color: mediumMain }}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap=".25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography sx={{ color: mediumMain }}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap=".25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography sx={{ color: mediumMain }}>Audio</Typography>
            </FlexBetween>
          </FlexBetween>
        </Box>
        )}
    </WidgetWrapper>
  );
};

export default PostUploadWidget;
