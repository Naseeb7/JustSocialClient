import { useTheme } from "@emotion/react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import AccountWidget from "scenes/widgets/AcountWidget";

const AccountPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width : 1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const theme=useTheme()

  return (
    <Box>
      <Box
        width="100%"
        p="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap=".5rem"
        justifyContent="space-around"
      >
        <Box flexBasis={isNonMobileScreens ? "50%" : undefined} 
            backgroundColor={theme.palette.background.alt}
            borderRadius="1rem"
            p="2rem"
        >
          <AccountWidget userId={_id} picturePath={picturePath} />
        </Box>

      </Box>
    </Box>
  );
};

export default AccountPage;
