<template>
  <div class="formBg">
    <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
      <h3 class="formTitle">系统登陆</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code" class="el-form-item__content">
        <el-input style="width: 250px" type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码"></el-input>
        <img :src="captchaUrl" @click="getCaptcha" title="点击更换">
      </el-form-item>
      <el-checkbox v-model="checked" class="formCheck">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitForm">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  import {getCodeImg, postRequest,getRequest} from '../utils/api'

export default {
  name: 'Login',
  data () {
    return {//'/captcha?time='+new Date(),
      captchaUrl: 'http://localhost:8008/captcha',
      captchaLoad: true,
      loginForm: {
        username: 'admin',
        password: '123',
        code: '',
        uuid: ''
      },
      checked: true,
      //整个页面加载
      loading: false,
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // 加载验证码
    this.getCaptcha();
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      this.getRequest('/captcha2?time=' + new Date()).then(resp => {
        if (resp) {
          this.captchaUrl = resp.captcha2;
        }
      })
    },
    submitForm() {
     this.$refs.loginForm.validate((valid) => {
        if (valid) {
          postRequest('/login',this.loginForm).then(resp => {
            if (resp) {
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              window.sessionStorage.getItem('tokenStr',tokenStr);
              // 跳转首页
              this.$router.replace('/home');
            }
          })
        } else {
          this.$message.error('请输入正确的信息！')
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
  .formBg{
    height: 900px;
    width: 100%;
    display: flex;
    justify-content: center;
    background: url('../assets/images/y1.jpg');
  }
  .loginContainer{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 440px;
    height: 380px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .formTitle{
    margin: 0px auto 40px auto;
  }
  .formCheck{
    margin: 5px 0px 15px 0px;
  }
  .el-form-item__content{
    display: flex;
    align-items: center;
  }
</style>
