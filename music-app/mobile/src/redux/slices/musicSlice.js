import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as MusicAPI from '../../api/music';

// 异步操作
export const fetchMusicList = createAsyncThunk(
  'music/fetchMusicList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await MusicAPI.getMusicList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecommendMusic = createAsyncThunk(
  'music/fetchRecommendMusic',
  async (limit, { rejectWithValue }) => {
    try {
      const response = await MusicAPI.getRecommendMusic(limit);
      return response.data.list;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchMusic = createAsyncThunk(
  'music/searchMusic',
  async ({ keyword, page }, { rejectWithValue }) => {
    try {
      const response = await MusicAPI.searchMusic(keyword, page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    list: [],
    recommendList: [],
    searchResults: [],
    categories: [],
    loading: false,
    error: null,
    total: 0,
    currentPage: 1,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Music List
      .addCase(fetchMusicList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMusicList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchMusicList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Recommend Music
      .addCase(fetchRecommendMusic.fulfilled, (state, action) => {
        state.recommendList = action.payload;
      })
      // Search Music
      .addCase(searchMusic.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMusic.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.list;
      })
      .addCase(searchMusic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = musicSlice.actions;
export default musicSlice.reducer;
