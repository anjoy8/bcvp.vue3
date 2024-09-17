<template>
    <div class="login">
        <h1>登录</h1>
        <form @submit.prevent="onSubmit">
            <div>
                <label for="name">用户名</label>
                <input v-model="loginForm.name" id="name" type="text" required />
            </div>
            <div>
                <label for="pass">密码</label>
                <input v-model="loginForm.pass" id="pass" type="password" required />
            </div>
            <button type="submit" :disabled="loading">
                {{ loading ? '登录中...' : '登录' }}
            </button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/loginApi';
import { useAuthStore } from '@/stores/auth';
import type { LoginRequest, BaseResponse, LoginResponse } from '@/api/loginApi';

const router = useRouter();
const authStore = useAuthStore();
const loginForm = ref<LoginRequest>({
    name: '',
    pass: '',
});
const loading = ref(false);
const errorMessage = ref<string | null>(null);

/**
 * 登录表单提交处理函数
 */
const onSubmit = async () => {
    loading.value = true;
    errorMessage.value = null;

    try {
        const response: BaseResponse<LoginResponse> = await login(loginForm.value);
        if (response.success) {
            // 保存 token 到 Pinia
            authStore.setToken(response.response.token);
            router.push({ name: 'about' });
        } else {
            // 登录失败，显示错误信息
            errorMessage.value = response.msg;
        }
    } catch (error) {
        // 请求错误处理
        errorMessage.value = '登录失败，请重试';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
}

.error {
    color: red;
    margin-top: 1rem;
}
</style>

<!-- 
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { login } from '@/api/loginApi';
import type { LoginRequest } from '@/api/loginApi';

export default defineComponent({
    name: 'Login',
    setup() {
        // 定义两个响应式变量，用于用户名和密码输入
        const name = ref<string>('blogadmin');
        const pass = ref<string>('blogadmin');

        // 定义用于显示 token 的变量
        const token = ref<string | null>(null);

        // 登录请求函数
        const handleLogin = async () => {
            try {
                const params: LoginRequest = {
                    name: name.value,
                    pass: pass.value,
                };

                // 发起请求并处理响应
                const response = await login(params);
                if (response.success && response.response.token) {
                    token.value = response.response.token;
                } else {
                    alert('登录失败: ' + response.msg);
                }
            } catch (error) {
                console.error('请求错误:', error);
                alert('请求失败');
            }
        };

        return {
            name,
            pass,
            token,
            handleLogin,
        };
    },
});
</script>
 -->