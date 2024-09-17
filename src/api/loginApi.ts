import { get } from '@/utils/axiosInstance';

/**
 * 请求的入参接口
 * @interface LoginRequest
 * @property {string} name - 用户名
 * @property {string} pass - 密码
 */
export interface LoginRequest {
  name: string;
  pass: string;
}

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
 * 登录响应接口
 * @interface LoginResponse
 * @property {boolean} success - 是否登录成功
 * @property {string} token - JWT token
 * @property {number} expires_in - token 的有效时长（秒）
 * @property {string} token_type - token 类型，通常为 "Bearer"
 */
export interface LoginResponse {
  success: boolean;
  token: string;
  expires_in: number;
  token_type: string;
}

/**
 * 发起登录请求
 * @function login
 * @param {LoginRequest} params - 登录请求的参数
 * @returns {Promise<BaseResponse<LoginResponse>>} 返回一个包含登录响应数据的 Promise
 * @throws {Error} 请求失败时抛出错误
 */
export const login = async (params: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
  try {
    const response = await get<BaseResponse<LoginResponse>>('/api/Login/JWTToken3.0', {
      name: params.name,
      pass: params.pass,
    });
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};
