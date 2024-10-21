import { get, post, put, del, type BaseResponse, type PageModel } from '@/utils/axiosInstance';

/**
 * 请求的入参接口
 * @interface RoleRequest
 */
export interface RoleRequest {
  page: number;
  pageSize: number;
  key: string;
  f: string;
}

/**
 * 实体模型响应接口
 * @interface Role
 */
export interface Role {
  IsDeleted: boolean;
  Name: string;
  Description: string;
  OrderSort: number;
  Dids: string | null;
  AuthorityScope: number;
  Enabled: boolean;
  CreateId: string;
  CreateBy: string;
  CreateTime: string;
  ModifyId: string | null;
  ModifyBy: string | null;
  ModifyTime: string;
  Id: string;
}

// 获取业务数据列表
export const getRoleListApi = async (params: RoleRequest): Promise<BaseResponse<PageModel<Role>>> => {
  try {
    const response = await get<BaseResponse<PageModel<Role>>>('/api/role/get', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 新增业务数据
export const addRole = async (params: Role): Promise<BaseResponse<string>> => {
  try {
    const response = await post<BaseResponse<string>>('/api/role/post', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 编辑业务数据
export const editRole = async (params: Role): Promise<BaseResponse<string>> => {
  try {
    const response = await put<BaseResponse<string>>('/api/role/put', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 删除业务数据
export const removeRole = async (id: string): Promise<BaseResponse<string>> => {
  try {
    const response = await del<BaseResponse<string>>('/api/role/delete', { id: id });
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};