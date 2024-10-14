import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { ElMessage } from 'element-plus';


/**
 * 基础响应接口，使用泛型 T 来表示响应体
 * @template T
 * @interface BaseResponse
 * @property {number} status - HTTP 响应状态码
 * @property {boolean} success - 请求是否成功
 * @property {string} msg - 响应的消息
 * @property {string | null} [msgDev] - 开发用的详细信息，可能为空
 * @property {T} response - 具体的响应数据
 */
export interface BaseResponse<T> {
    status: number;
    success: boolean;
    msg: string;
    msgDev?: string | null;
    response: T;
}

/**
 * 分页响应基类接口，使用泛型 T 来表示数据列表
 * @template T
 * @interface PageModel
 * @property {number} PageSize - 每页条数
 * @property {number} dataCount - 数据总条数
 * @property {number} page - 当前页码
 * @property {number} pageCount - 总页数
 * @property {T} data - 具体的响应数据数组
 */
export interface PageModel<T> {
    PageSize: number;
    dataCount: number;
    page: number;
    pageCount: number;
    data: T[];
}

// 创建 axios 实例
const axiosInstance = axios.create({
    baseURL: '',  // 替换为你的 API 基础 URL
    timeout: 10000,  // 请求超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {  // 使用 InternalAxiosRequestConfig 类型
        const authStore = useAuthStore();
        if (authStore.token) {
            config.headers['Authorization'] = `Bearer ${authStore.token}`;  // 在请求头中添加 token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                // 未授权，跳转到登录页面
                router.push({ name: 'login' });
            } else if (status === 403) {
                // 无权限访问，提示用户
                ElMessage.error('无权限访问');
                router.push({ name: 'login' });
            } else if (status === 500) {
                // 服务器错误
                console.error('服务器错误');
            }
        }
        return Promise.reject(error);
    }
);

// 封装 get 请求
export const get = async <T>(url: string, params?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(url, { params });
    return response.data;
};

// 封装 post 请求
export const post = async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data);
    return response.data;
};

// 封装 put 请求
export const put = async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data);
    return response.data;
};

// 封装 delete 请求
export const del = async <T>(url: string, params?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, { params });
    return response.data;
};

export default axiosInstance;