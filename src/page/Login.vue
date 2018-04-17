<template>
  <div class="login_page fillcontain">
    <!-- <myCanvas :dotsNum="dotsNum" :isColor="true"></myCanvas> -->
    <transition class="form-fade" mode="in-out">
      <section class="form_container" v-show="showLogin">
        <div class="manage_tip">
          <p>iCampus 登录</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>

  </div>
</template>

<script>
  import myCanvas from 'vue-atom-canvas'
  import crypto from 'crypto'
  import { requestLogin } from "../api/api";

  export default {
      name: "Login",
      components: {
          myCanvas
      },
      data() {
          return {
            loginForm: {
              username:'',
              password:''
            },
            rules: {
              username: [
                {required: true, message: '请输入用户名', trigger: 'blur'}
              ],
              password: [
                {required: true, message: '请输入密码', trigger: 'blur'}
              ]
            },
            showLogin: false,
            dotsNum: 50,
            users: []
          }
      },
      mounted() {
          this.showLogin= true;
      },
      created() {
        document.title = 'iCampus登录'
      },
      methods: {
          async submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
              if(valid) {
                let loginParams = {'Member.user_id' : this.loginForm.username};
                requestLogin(loginParams).then((res) => {
                  this.users = res.data.Member;
                  console.log(this.users);
                  if(!this.users){
                    this.$message.error('当前用户未注册！');
                    this.$refs[formName].resetFields();
                    return false;
                  }
                  let md5 = crypto.createHash("md5");
                  md5.update(this.loginForm.password);
                  let encode_pwd = md5.digest('hex');

                  let password = this.users[0].password;
                  let role = this.users[0].role;
                  if(role === 'ROLE_STUDENT') {
                    this.$message.error('权限错误！');
                    this.$refs[formName].resetFields();
                  } else if(password === encode_pwd) {
                    this.$message({
                      message: '登录成功！',
                      type: 'success'
                    });
                    sessionStorage.setItem('user', JSON.stringify(this.users));
                    this.$router.push({path: '/'});
                  } else {
                    this.$message.error('密码错误！');
                    this.$refs[formName].resetFields();
                  }
                });
              }else {
                this.$message({
                  message: '请输入用户和密码！',
                  type: 'warning'
                });
                return false;
              }
            });
          },
          async resetForm(formName) {
            this.$refs[formName].resetFields();
          }
      }
    }
</script>

<style lang="less" scoped>
  @import '../style/mixin';

  .login_page {
    //background: #dadada;
  }
  .manage_tip{
    position: absolute;
    width: 100%;
    top: -100px;
    left: 0;
    p{
      font-size: 34px;
      color: #555555;
    }
  }
  .form_container {
    .wh(320px, 250px);
    .ctp(320px, 250px);
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #f9f9f9;
    border-style: solid;
    border-width: 0.3px;
    border-color: black;
    box-shadow: 10px 10px 5px #888888;
    .submit_btn{
      width: 100%;
      font-size: 16px;
    }
  }
  .tip{
    font-size: 12px;
    color: red;
  }
  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }
  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
</style>
