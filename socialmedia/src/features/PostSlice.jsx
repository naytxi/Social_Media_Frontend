import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as postService from "./PostService";


export const loadAllPosts = createAsyncThunk(
  "posts/loadAll",
  async (_, { rejectWithValue }) => {
    try {
      return await postService.fetchAllPosts();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const loadMyPosts = createAsyncThunk(
  "posts/loadMine",
  async (_, { rejectWithValue }) => {
    try {
      return await postService.fetchMyPosts();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId, alreadyLiked }, { rejectWithValue }) => {
    try {
      return alreadyLiked
        ? await postService.unlikePost(postId)
        : await postService.likePost(postId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, { rejectWithValue }) => {
    try {
      return await postService.fetchUserPosts(userId); 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    list: [],
    loading: false,
    error: null,
    showMyPosts: false,
  },
  reducers: {
    addPost: (state, action) => {
      state.list.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.list.findIndex((p) => p._id === action.payload._id);
      if (index >= 0) state.list[index] = action.payload;
    },
    deletePost: (state, action) => {
      state.list = state.list.filter((p) => p._id !== action.payload);
    },
    setShowMyPosts: (state, action) => {
      state.showMyPosts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(loadAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.showMyPosts = false;
      })
      .addCase(loadAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(loadMyPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.showMyPosts = true;
      })
      .addCase(loadMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     
      .addCase(toggleLike.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index >= 0) state.list[index] = action.payload;
      })

      
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.showMyPosts = false; 
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addPost, updatePost, deletePost, setShowMyPosts } =
  postSlice.actions;
export default postSlice.reducer;
