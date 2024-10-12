<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="name">
      <el-input v-model="loginForm.name" placeholder="账号：blogadmin">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="pass">
      <el-input v-model="loginForm.pass" type="password" placeholder="密码：blogadmin" show-password
        autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading"
      @click="loginModule(loginFormRef)">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElNotification, ElMessage } from "element-plus";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { login, userInfo } from '@/api/loginApi';
import type { LoginRequest, LoginResponse } from '@/api/loginApi';
import type { BaseResponse } from '@/utils/axiosInstance';
import { useAuthStore } from '@/stores/auth';
import { useUserInfoStore } from '@/stores/userInfo';

import { initDynamicRouter } from '@/router/modules/dynamicRouter';

const router = useRouter();
const authStore = useAuthStore();
const userInfoStore = useUserInfoStore();
const loginForm = ref<LoginRequest>({
  name: '',
  pass: '',
});

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  pass: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);

// login
const loginModule = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const response: BaseResponse<LoginResponse> = await login(loginForm.value);
      if (response.success) {
        // 保存 token 到 Pinia
        authStore.setToken(response.response.token);

        const userInfoRes: BaseResponse<User.UserResponse> = await userInfo();
        userInfoStore.setUser(userInfoRes.response);

        const menuReq: Menu.MenuRequest = { uid: userInfoRes.response.uID };
        // 2.添加动态路由
        await initDynamicRouter(menuReq);

        ElNotification({
          title: '首页',
          message: "欢迎登录 BCVP.VUE3",
          type: "success",
          duration: 3000
        });

        router.push('/');
      } else {
        // 登录失败，显示错误信息
        ElMessage.error(response.msg || "请求失败！请您稍后重试");;
      }
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      loginModule(loginFormRef.value);
    }
  };
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>