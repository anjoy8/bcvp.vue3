<template>
  <section style="background-color: #fff;">
    <el-form ref="editForm" :model="editForm" label-width="80px" @submit.prevent="onSubmit"
      style="margin:20px;width:60%;min-width:600px;">
      <el-form-item label="我的昵称">
        <el-input v-model="editForm.uRealName"></el-input>
      </el-form-item>

      <el-form-item label="旧密码" prop="uLoginPWD">
        <el-input v-model="editForm.uLoginPWD" type="text" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="uLoginPWDNew">
        <el-input v-model="editForm.uLoginPWDNew" show-password auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="uLoginPWDConfirm">
        <el-input v-model="editForm.uLoginPWDConfirm" show-password auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="头像">
        <el-upload class="avatar-uploader" action="/images/Upload/Pic" :show-file-list="false" :headers="token"
          :data="ruleForm" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="editForm.tdLogo" :src="editForm.tdLogo" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon plus-sign"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="留言/备注">
        <el-input type="textarea" v-model="editForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit" type="primary">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// Define the structure of the form data
interface EditForm {
  uRealName: string;
  uLoginPWD: string;
  uLoginPWDNew: string;
  uLoginPWDConfirm: string;
  tdLogo?: string;
  desc: string;
}
interface RuleForm {
  max_ver: string;
  min_ver: string;
  enable: string;
}

// Token header for the upload
const token = reactive({ Authorization: 'Bearer some-token' });

// Initial form data
const editForm = reactive<EditForm>({
  uRealName: '',
  uLoginPWD: '',
  uLoginPWDNew: '',
  uLoginPWDConfirm: '',
  tdLogo: undefined,
  desc: '',
});
const ruleForm = reactive<RuleForm>({
  max_ver: '',
  min_ver: '',
  enable: '',
});

// Handle form submission
const onSubmit = () => {
  // Handle form submission logic
  console.log('Form submitted:', editForm);
};

// Handle upload success
const handleAvatarSuccess = (response: any, file: File) => {
  editForm.tdLogo = URL.createObjectURL(file);
};

// Check before uploading avatar
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    alert('上传头像图片只能是 JPG 格式!');
  }
  if (!isLt2M) {
    alert('上传头像图片大小不能超过 2MB!');
  }
  return isJPG && isLt2M;
};

// Handle the cancel button click event
const onCancel = (event: Event) => {
  event.preventDefault();
  console.log('Cancel button clicked');
};
</script>

<style scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
}

.plus-sign {
  font-size: 28px;
  color: #8c939d;
}
</style>