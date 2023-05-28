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
                onError={(e)=>{
                    e.target.onError = null;
                    e.target.src="https://i.ibb.co/K9VP0Qn/person-icon-black-background-person-solid-vector-eps-90447225.jpg";
                }}
            />
        </Box>
    )
}

export default UserImage;