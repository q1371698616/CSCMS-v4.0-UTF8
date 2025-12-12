import apiClient from './config';

/**
 * 用户相关API
 */

// 用户注册
export const register = (data) => {
  return apiClient.post('/api/user/register', data);
};

// 用户登录
export const login = (data) => {
  return apiClient.post('/api/user/login', data);
};

// 获取用户信息
export const getUserProfile = (userId) => {
  const url = userId ? `/api/user/profile/${userId}` : '/api/user/profile';
  return apiClient.get(url);
};

// 更新用户信息
export const updateUserProfile = (data) => {
  return apiClient.post('/api/user/profile', data);
};

// 用户签到
export const checkin = () => {
  return apiClient.post('/api/user/checkin');
};

// 关注用户
export const followUser = (followUserId) => {
  return apiClient.post('/api/user/follow', { follow_user_id: followUserId });
};

// 获取关注列表
export const getFollowingList = (userId, page = 1, limit = 20) => {
  const url = userId ? `/api/user/following/${userId}` : '/api/user/following';
  return apiClient.get(url, { params: { page, limit } });
};

// 获取粉丝列表
export const getFollowersList = (userId, page = 1, limit = 20) => {
  const url = userId ? `/api/user/followers/${userId}` : '/api/user/followers';
  return apiClient.get(url, { params: { page, limit } });
};

// 退出登录
export const logout = () => {
  return apiClient.post('/api/user/logout');
};
