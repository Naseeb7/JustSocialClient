import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";

const BaseUrl=process.env.REACT_APP_BASE_URL

const UserImage = ({image, size="60px"})=>{
    const theme=useTheme()
    return (
        <Box width={size} height={size} backgroundColor={theme.palette.background.alt} borderRadius="50%">
            <img
                style={{objectFit: "cover", borderRadius: "50%"}}
                width={size}
                height={size}
                alt="user"
                src={`${BaseUrl}/assets/${image}`}
            />
        </Box>
    )
}

export default UserImage;