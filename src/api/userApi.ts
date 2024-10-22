import { get, post, put, del, type BaseResponse, type PageModel } from '@/utils/axiosInstance';

/**
 * 请求的入参接口
 * @interface UserRequest
 */
export interface UserRequest {
  page: number;
  pageSize: number;
  key: string;
  f: string;
}

/**
 * 实体模型响应接口
 * @interface User
 */
export interface User {
  uLoginName: string; // 用户登录名
  uLoginPWD: string; // 用户登录密码（加密）
  uRealName: string; // 用户真实姓名
  uStatus: number; // 用户状态
  DepartmentId: string; // 部门ID
  uRemark: string; // 用户备注
  uCreateTime: string | null; // 创建时间
  uUpdateTime: string | null; // 更新时间
  uLastErrTime: string | null; // 上次错误时间
  uErrorCount: number; // 错误计数
  name: string | null; // 用户名，可能为空
  sex: number; // 性别
  age: number; // 年龄
  birth: string; // 生日
  addr: string | null; // 地址，可能为空
  tdIsDelete: boolean; // 是否已删除
  RoleNames: string[]; // 角色名称数组
  Dids: string[]; // 部门ID数组
  DepartmentName: string; // 部门名称
  uID: string; // 用户ID
  RIDs: string[]; // 角色ID数组
}

// 获取业务数据列表
export const getUserListApi = async (params: UserRequest): Promise<BaseResponse<PageModel<User>>> => {
  try {
    const response = await get<BaseResponse<PageModel<User>>>('/api/user/get', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 新增业务数据
export const addUser = async (params: User): Promise<BaseResponse<string>> => {
  try {
    const response = await post<BaseResponse<string>>('/api/user/post', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 编辑业务数据
export const editUser = async (params: User): Promise<BaseResponse<string>> => {
  try {
    const response = await put<BaseResponse<string>>('/api/user/put', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 删除业务数据
export const removeUser = async (id: string): Promise<BaseResponse<string>> => {
  try {
    const response = await del<BaseResponse<string>>('/api/user/delete', { id: id });
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};