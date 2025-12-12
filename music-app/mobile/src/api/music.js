import apiClient from './config';

/**
 * 音乐相关API
 */

// 获取音乐列表
export const getMusicList = (params) => {
  return apiClient.get('/api/music/list', { params });
};

// 获取音乐详情
export const getMusicDetail = (musicId) => {
  return apiClient.get(`/api/music/detail/${musicId}`);
};

// 搜索音乐
export const searchMusic = (keyword, page = 1, limit = 20) => {
  return apiClient.get('/api/music/search', {
    params: { keyword, page, limit }
  });
};

// 播放音乐
export const playMusic = (musicId, playProgress = 0, device = 'mobile') => {
  return apiClient.post('/api/music/play', {
    music_id: musicId,
    play_progress: playProgress,
    device
  });
};

// 收藏音乐
export const collectMusic = (musicId) => {
  return apiClient.post('/api/music/collect', { music_id: musicId });
};

// 点赞音乐
export const likeMusic = (musicId) => {
  return apiClient.post('/api/music/like', { music_id: musicId });
};

// 获取播放历史
export const getPlayHistory = (page = 1, limit = 20) => {
  return apiClient.get('/api/music/history', { params: { page, limit } });
};

// 获取音乐分类
export const getMusicCategories = () => {
  return apiClient.get('/api/music/categories');
};

// 获取推荐音乐
export const getRecommendMusic = (limit = 10) => {
  return apiClient.get('/api/music/recommend', { params: { limit } });
};

// 获取歌手列表
export const getSingerList = (params) => {
  return apiClient.get('/api/singer/list', { params });
};

// 获取歌手详情
export const getSingerDetail = (singerId) => {
  return apiClient.get(`/api/singer/detail/${singerId}`);
};

// 获取专辑列表
export const getAlbumList = (params) => {
  return apiClient.get('/api/album/list', { params });
};

// 获取专辑详情
export const getAlbumDetail = (albumId) => {
  return apiClient.get(`/api/album/detail/${albumId}`);
};

// 获取播放列表
export const getPlaylist = (userId) => {
  return apiClient.get('/api/playlist/list', { params: { user_id: userId } });
};

// 创建播放列表
export const createPlaylist = (data) => {
  return apiClient.post('/api/playlist/create', data);
};

// 添加音乐到播放列表
export const addMusicToPlaylist = (playlistId, musicId) => {
  return apiClient.post('/api/playlist/add_music', {
    playlist_id: playlistId,
    music_id: musicId
  });
};
