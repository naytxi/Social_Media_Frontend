import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/UserSlice";
import postReducer from "./features/PostSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer, 
  },
});

export default store;
