import { get, post, put, del, type BaseResponse, type PageModel } from '@/utils/axiosInstance';

/**
 * 请求的入参接口
 * @interface BlogRequest
 */
export interface BlogRequest {
  page: number;
  pageSize: number;
  key: string;
  f: string;
}

/**
 * 实体模型响应接口
 * @interface Blog
 */
export interface Blog {
  bID: string;
  bsubmitter: string;
  User: string | null;
  btitle: string;
  bcategory: string;
  bcontent: string;
  btraffic: number;
  bcommentNum: number;
  bUpdateTime: string;
  bCreateTime: string;
  bRemark: string;
  IsDeleted: boolean;
  Comments: string | null;
}

// 获取业务数据列表
export const getBlogListApi = async (params: BlogRequest): Promise<BaseResponse<PageModel<Blog>>> => {
  try {
    const response = await get<BaseResponse<PageModel<Blog>>>('/api/blog', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 新增业务数据
export const addBlog = async (params: Blog): Promise<BaseResponse<string>> => {
  try {
    const response = await post<BaseResponse<string>>('/api/blog/post', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 编辑业务数据
export const editBlog = async (params: Blog): Promise<BaseResponse<string>> => {
  try {
    const response = await put<BaseResponse<string>>('/api/blog/put', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 删除业务数据
export const removeBlog = async (id: string): Promise<BaseResponse<string>> => {
  try {
    const response = await del<BaseResponse<string>>('/api/blog/delete', { id: id });
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};