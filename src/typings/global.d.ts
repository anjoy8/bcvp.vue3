/* Menu */
declare namespace Menu {
  interface MenuOptions {
    id: string;
    pid: string;
    order: number;
    name: string;
    IsHide: boolean;
    IsButton: boolean;
    path: string;
    Func: string | null;
    component?: string | (() => Promise<unknown>);
    iconCls: string;
    meta: MetaProps;
    children?: MenuOptions[] | null;
  }
  interface MetaProps {
    title: string | null;
    requireAuth: boolean;
    NoTabPage: boolean;
    keepAlive: boolean;
  }
  export interface MenuRequest {
    uid: string;
  }
}

/* User */
declare namespace User {

  export interface UserResponse {
    uLoginName: string;
    uLoginPWD: string;
    uRealName: string;
    uStatus: number;
    DepartmentId: string;
    uRemark: string | null;
    uCreateTime: string;
    uUpdateTime: string;
    uLastErrTime: string;
    uErrorCount: number;
    name: string;
    sex: number;
    age: number;
    birth: string;
    addr: string | null;
    tdIsDelete: boolean;
    RoleNames: string[];
    Dids: string[];
    DepartmentName: string | null;
    uID: string;
    RIDs: string[];
  }
}