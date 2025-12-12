import apiClient from './config';

/**
 * 消息相关API
 */

// 获取消息列表
export const getMessageList = (type, page = 1, limit = 20) => {
  return apiClient.get('/api/message/list', {
    params: { type, page, limit }
  });
};

// 获取未读消息数
export const getUnreadCount = () => {
  return apiClient.get('/api/message/unread_count');
};

// 标记消息为已读
export const markMessageAsRead = (messageId, type) => {
  return apiClient.post('/api/message/read', { message_id: messageId, type });
};

// 删除消息
export const deleteMessage = (messageId) => {
  return apiClient.post('/api/message/delete', { message_id: messageId });
};

// 发送私信
export const sendMessage = (toUserId, content) => {
  return apiClient.post('/api/message/send', {
    to_user_id: toUserId,
    content
  });
};

// 获取对话列表
export const getConversations = (page = 1, limit = 20) => {
  return apiClient.get('/api/message/conversations', {
    params: { page, limit }
  });
};

// 获取对话详情
export const getConversationMessages = (targetUserId, page = 1, limit = 50) => {
  return apiClient.get(`/api/message/conversation/${targetUserId}`, {
    params: { page, limit }
  });
};
