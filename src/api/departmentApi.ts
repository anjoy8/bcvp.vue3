import { get, post, put, del, type BaseResponse } from '@/utils/axiosInstance';

/**
 * 请求的入参接口
 * @interface DepartmentRequest
 */
export interface DepartmentRequest {
  page: number;
  key: string;
  f: string;
}

/**
 * 部门响应接口
 * @interface Department
 */
export interface Department {
  CodeRelationship: string;
  Name: string;
  Leader: string;
  OrderSort: number;
  Enabled: boolean;
  Status: boolean;
  IsDeleted: boolean;
  CreateBy: string;
  CreateTime: string;
  ModifyBy: string | null;
  ModifyTime: string;
  hasChildren: boolean;
  Pid: string;
  PidArr: string[];
  Id: string;
}

// 获取菜单列表
export const getDepartmentListApi = async (params: DepartmentRequest): Promise<BaseResponse<Department[]>> => {
  try {
    const response = await get<BaseResponse<Department[]>>('/api/department/getTreeTable', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

/**
 * 机构树节点接口
 * @interface DepartmentNode
 */
export interface DepartmentNode {
  value: string;
  Pid: string;
  label: string;
  order: number;
  disabled: boolean;
  children: DepartmentNode[] | null;
}

// 获取部门全量树
export const getDepartmentTree = async (pid: string): Promise<BaseResponse<DepartmentNode>> => {
  try {
    const response = await get<BaseResponse<DepartmentNode>>('/api/department/getDepartmentTree', { pid: pid });
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 新增部门数据
export const addDepartment = async (params: Department): Promise<BaseResponse<string>> => {
  try {
    const response = await post<BaseResponse<string>>('/api/department/post', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 编辑部门数据
export const editDepartment = async (params: Department): Promise<BaseResponse<string>> => {
  try {
    const response = await put<BaseResponse<string>>('/api/department/put', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 删除部门数据
export const removeDepartment = async (id: string): Promise<BaseResponse<string>> => {
  try {
    const response = await del<BaseResponse<string>>('/api/department/delete', { id: id });
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};
