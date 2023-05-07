import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navBar";
import UserWidget from "scenes/widgets/UserWidget";
import PostUploadWidget from "scenes/widgets/PostUploadWidget"
import FeedsWidget from "scenes/widgets/FeedsWidget";
import FriendsListWidget from "scenes/widgets/FriendsListWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        p="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        // display="flex"
        gap=".5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "37%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
            <PostUploadWidget picturePath={picturePath} />
            <FeedsWidget userId={_id} />
        </Box>
        {(isNonMobileScreens && _id) && (
            <Box flexBasis="26%">
                  <FriendsListWidget userId={_id} />
            </Box>
        )}

      </Box>
    </Box>
  );
};

export default HomePage;
