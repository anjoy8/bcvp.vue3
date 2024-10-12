import { get, type BaseResponse } from '@/utils/axiosInstance';

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

