import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    repeatMode: 'off', // 'off', 'one', 'all'
    shuffleMode: false,
  },
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    addToPlaylist: (state, action) => {
      state.playlist.push(action.payload);
    },
    removeFromPlaylist: (state, action) => {
      const index = action.payload;
      state.playlist.splice(index, 1);
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setRepeatMode: (state, action) => {
      state.repeatMode = action.payload;
    },
    toggleShuffleMode: (state) => {
      state.shuffleMode = !state.shuffleMode;
    },
    playNext: (state) => {
      const currentIndex = state.playlist.findIndex(
        track => track.id === state.currentTrack?.id
      );
      if (currentIndex < state.playlist.length - 1) {
        state.currentTrack = state.playlist[currentIndex + 1];
      } else if (state.repeatMode === 'all') {
        state.currentTrack = state.playlist[0];
      }
    },
    playPrevious: (state) => {
      const currentIndex = state.playlist.findIndex(
        track => track.id === state.currentTrack?.id
      );
      if (currentIndex > 0) {
        state.currentTrack = state.playlist[currentIndex - 1];
      } else if (state.repeatMode === 'all') {
        state.currentTrack = state.playlist[state.playlist.length - 1];
      }
    },
    clearPlaylist: (state) => {
      state.playlist = [];
      state.currentTrack = null;
      state.isPlaying = false;
    },
  },
});

export const {
  setCurrentTrack,
  setPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  setIsPlaying,
  setCurrentTime,
  setDuration,
  setRepeatMode,
  toggleShuffleMode,
  playNext,
  playPrevious,
  clearPlaylist,
} = playerSlice.actions;

export default playerSlice.reducer;
