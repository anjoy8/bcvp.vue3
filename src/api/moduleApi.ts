import { get, post, put, del, type BaseResponse, type PageModel } from '@/utils/axiosInstance';

/**
 * 请求的入参接口
 * @interface ModuleRequest
 */
export interface ModuleRequest {
  page: number;
  pageSize: number;
  key: string;
  f: string;
}

/**
 * 实体模型响应接口
 * @interface Module
 */
export interface Module {
  IsDeleted: boolean;
  Name: string;
  LinkUrl: string;
  Area: string | null;
  Controller: string | null;
  Action: string | null;
  Icon: string | null;
  Code: string | null;
  OrderSort: number;
  Description: string | null;
  IsMenu: boolean;
  Enabled: boolean;
  CreateId: string;
  CreateBy: string;
  CreateTime: string;
  ModifyId: string | null;
  ModifyBy: string | null;
  ModifyTime: string;
  ParentId: string;
  Id: string;
}

// 获取业务数据列表
export const getModuleListApi = async (params: ModuleRequest): Promise<BaseResponse<PageModel<Module>>> => {
  try {
    const response = await get<BaseResponse<PageModel<Module>>>('/api/module/get', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};
