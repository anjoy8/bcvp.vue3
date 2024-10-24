import { get, post, put, del, type BaseResponse, type PageModel } from '@/utils/axiosInstance';

/**
 * 请求的入参接口
 * @interface QuartzJobRequest
 */
export interface QuartzJobRequest {
  page: number;
  pageSize: number;
  key: string;
  f: string;
}

/**
 * 实体模型响应接口
 * @interface QuartzJob
 */
export interface QuartzJob {
  Name: string;
  JobGroup: string;
  Cron: string;
  AssemblyName: string;
  ClassName: string;
  Remark: string;
  RunTimes: number;
  BeginTime: string;
  EndTime: string;
  TriggerType: number;
  TriggerTypeBl: boolean;
  IntervalSecond: number;
  CycleRunTimes: number;
  CycleHasRunTimes: number;
  IsStart: boolean;
  JobParams: string;
  IsDeleted: boolean;
  CreateTime: string;
  Triggers: Trigger[];
  Id: string;
}
interface Trigger {
  jobId: string;
  jobName: string | null;
  jobGroup: string;
  triggerId: string;
  triggerName: string | null;
  triggerGroup: string;
  triggerStatus: string;
}

// 获取业务数据列表
export const getQuartzJobListApi = async (params: QuartzJobRequest): Promise<BaseResponse<PageModel<QuartzJob>>> => {
  try {
    const response = await get<BaseResponse<PageModel<QuartzJob>>>('/api/TasksQz/get', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 新增业务数据
export const addQuartzJob = async (params: QuartzJob): Promise<BaseResponse<string>> => {
  try {
    const response = await post<BaseResponse<string>>('/api/TasksQz/post', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 编辑业务数据
export const editQuartzJob = async (params: QuartzJob): Promise<BaseResponse<string>> => {
  try {
    const response = await put<BaseResponse<string>>('/api/TasksQz/put', params);
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};

// 删除业务数据
export const removeQuartzJob = async (jobId: string): Promise<BaseResponse<string>> => {
  try {
    const response = await del<BaseResponse<string>>('/api/TasksQz/delete', { jobId: jobId });
    return response;
  } catch (error) {
    throw new Error('请求失败');
  }
};