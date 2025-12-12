import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

// API基础URL - 请根据实际情况修改
export const API_BASE_URL = 'http://your-domain.com';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  async (config) => {
    // 添加token到请求头
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    const { data } = response;

    // API返回格式: { code: 0, message: '', data: {} }
    if (data.code === 0) {
      return data;
    } else {
      // 显示错误消息
      showMessage({
        message: data.message || '请求失败',
        type: 'danger',
      });
      return Promise.reject(new Error(data.message || '请求失败'));
    }
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          await AsyncStorage.removeItem('userToken');
          showMessage({
            message: '登录已过期，请重新登录',
            type: 'warning',
          });
          // TODO: 跳转到登录页
          break;
        case 403:
          showMessage({
            message: '没有权限',
            type: 'danger',
          });
          break;
        case 404:
          showMessage({
            message: '请求的资源不存在',
            type: 'danger',
          });
          break;
        case 500:
          showMessage({
            message: '服务器错误',
            type: 'danger',
          });
          break;
        default:
          showMessage({
            message: data?.message || '请求失败',
            type: 'danger',
          });
      }
    } else if (error.request) {
      showMessage({
        message: '网络连接失败',
        type: 'danger',
      });
    } else {
      showMessage({
        message: error.message || '请求失败',
        type: 'danger',
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
