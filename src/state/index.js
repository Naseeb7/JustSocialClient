import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode : "light",
    user : null,
    token : null,
    posts: [],
    users:[],
    notifications:[],
};

export const authSlice= createSlice({
    name : "auth",
    initialState,
    reducers: {
        setMode:(state)=>{
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin : (state,action)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
        },
        setUser : (state,action)=>{
            state.user=action.payload.user;
        },
        setNotifications : (state,action)=>{
            state.notifications=action.payload.notifications;
        },
        addNotification : (state,action)=>{
            const newNotifications=[...state.notifications,action.payload.notification]
            state.notifications=newNotifications
        },
        setLogout : (state)=>{
            state.user=null;
            state.token=null;
        },
        setFriends : (state,action)=>{
            if(state.user){
                state.user.friends=action.payload.friends;
            }else{
                console.log("No friends");
            }
        },
        setFeeds : (state,action)=>{
            state.posts=action.payload.posts;
        },
        setPost: (state,action)=>{
            const updatedPosts =state.posts.map((post)=>{
                if(post._id=== action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts=updatedPosts;
        },
        setUsers : (state,action)=>{
            state.users=action.payload.users;
        }
    }
})

export const {setMode,setLogin,setLogout,setFriends,setFeeds,setPost,setUser,setUsers,setNotifications,addNotification}= authSlice.actions;
export default authSlice.reducer;