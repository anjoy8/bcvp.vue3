import { get, post, put, del, type BaseResponse, type PageModel } from '@/utils/axiosInstance';

/**
 * 请求的入参接口
 * @interface PermissionRequest
 */
export interface PermissionRequest {
  page: number;
  pageSize: number;
  key: string;
  f: string;
}

/**
 * 实体模型响应接口
 * @interface Permission
 */
export interface Permission {
  MenuType: string;
  Code: string; // 菜单代码
  Name: string; // 菜单名称
  IsButton: boolean; // 是否是按钮
  IsHide: boolean; // 是否隐藏
  IskeepAlive: boolean; // 是否保持活跃
  Func: string | null; // 功能，可能为 null
  OrderSort: number; // 排序
  Icon: string; // 图标
  Description: string; // 描述
  Enabled: boolean; // 是否启用
  CreateId: string; // 创建 ID
  CreateBy: string; // 创建者
  CreateTime: string; // 创建时间
  ModifyId: string | null; // 修改 ID，可能为 null
  ModifyBy: string | null; // 修改者，可能为 null
  ModifyTime: string; // 修改时间
  IsDeleted: boolean; // 是否已删除
  PnameArr: string[]; // 上级名称数组
  PCodeArr: string[]; // 上级代码数组
  MName: string | null; // 模块名称，可能为 null
  hasChildren: boolean; // 是否有子菜单
  Children: any[]; // 子菜单数组
  Module: any | null; // 模块，可能为 null
  Pid: string; // 上级 ID
  Mid: string; // 模块 ID
  PidArr: string[]; // 上级 ID 数组
  Id: string; // 菜单 ID
}

/**
 * 菜单树模型响应接口
 * @interface Permission
 */
export interface PermissionNode {
  value: string; // 值
  Pid: string; // 父级ID
  label: string; // 标签名称
  order: number; // 排序
  isbtn: boolean; // 是否为按钮
  disabled: boolean; // 是否禁用
  children: PermissionNode[] | null; // 子节点
  btns: PermissionNode[] | null; // 按钮列表
}

// 获取业务数据列表
export const getPermissionListApi = async (params: PermissionRequest): Promise<BaseResponse<Permission[]>> => {
  try {
    const response = await get<BaseResponse<Permission[]>>('/api/permission/GetTreeTable', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 新增业务数据
export const addPermission = async (params: Permission): Promise<BaseResponse<string>> => {
  try {
    const response = await post<BaseResponse<string>>('/api/permission/post', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 编辑业务数据
export const editPermission = async (params: Permission): Promise<BaseResponse<string>> => {
  try {
    const response = await put<BaseResponse<string>>('/api/permission/put', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 删除业务数据
export const removePermission = async (id: string): Promise<BaseResponse<string>> => {
  try {
    const response = await del<BaseResponse<string>>('/api/permission/delete', { id: id });
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 菜单树业务数据
export const getPermissionTree = async (pid: string): Promise<BaseResponse<PermissionNode>> => {
  try {
    const response = await get<BaseResponse<PermissionNode>>('/api/permission/getpermissiontree', { pid: pid });
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};