import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const BaseUrl=process.env.REACT_APP_BASE_URL

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
        <FlexBetween>
            <Typography color={dark} variant="h5" fontWeight="500">Sponsored</Typography>
            <Typography color={medium}>Create Ad</Typography>
        </FlexBetween>
        <img 
            width="100%"
            height="auto"
            alt="advert"
            src={`${BaseUrl}/assets/info4.jpeg`}
            style={{borderRadius:".5rem", m: ".75rem 0"}}
        />
        <FlexBetween>
            <Typography color={main}>BudsBeast</Typography>
            <Typography color={medium}>budsbeast.com</Typography>
        </FlexBetween>
        <Typography color={medium} m=".5rem 0">
            Budsbeast lets you know what going on in your neighbourhood kitchen
        </Typography>
    </WidgetWrapper>
  )

}
export default AdvertWidget;