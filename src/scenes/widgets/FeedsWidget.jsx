import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeeds } from "state";
import PostWidget from "./PostWidget";

const BaseUrl=process.env.REACT_APP_BASE_URL

const FeedsWidget=({userId, isProfile=false})=>{
    const dispatch=useDispatch()
    const posts=useSelector((state)=> state.posts);
    const token=useSelector((state)=> state.token);

    const shuffleArray=(array)=> {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i-1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    const getFeeds=async ()=>{
        const response=await fetch(`${BaseUrl}/posts`,{
            method: "GET",
            headers : {Authorization : `Bearer ${token}`},
        })
        const data=await response.json();
        shuffleArray(data)
        dispatch(setFeeds({posts : data}));
    }
    const getUserPosts=async ()=>{
        const response=await fetch(`${BaseUrl}/posts/${userId}/posts`,{
            method: "GET",
            headers : {Authorization : `Bearer ${token}`},
        })
        const data=await response.json();
        dispatch(setFeeds({posts : data}));
    }

    useEffect(()=>{
        if(isProfile){
            getUserPosts();
        } else{
            getFeeds();
        }
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    return (
         <>
        {posts.slice(0).reverse().map(
            ({
                _id,
                userId,
                firstName,
                lastName,
                description,
                location,
                picturePath,
                userPicturePath,
                likes,
                comments,
            })=>(
                // <>{lastName}</>
                <PostWidget 
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
                />
            )
        )}
        </>
    )
}
export default FeedsWidget;