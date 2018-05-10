<template>
    <div class="register_page fillcontain">
      <myCanvas :dotsNum="dotsNum" :isColor="true"></myCanvas>
      <transition class="form-fade" mode="in-out">
        <section class="form_container" v-show="showRegister">
          <div class="manage_tip">
            <p>iCampus 注册</p>
          </div>
          <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm">
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="registerForm.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="registerForm.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input type="password" v-model="registerForm.checkPassword" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm2('registerForm')">注册</el-button>
              <el-button @click="resetForm2('registerForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </section>
      </transition>
    </div>
</template>

<script>
  import myCanvas from 'vue-atom-canvas'
  import axios from 'axios'
  import crypto from 'crypto'
  import { register,requestLogin } from "../api/api";

  export default {
      name: "Register",
      components: {
          myCanvas
      },
      data() {
        var checkUsername = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('用户名不能为空'));
          } else {
            callback();
          }
        };
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.registerForm.checkPassword !== '') {
              this.$refs.registerForm.validateField('checkPassword');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.registerForm.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          registerForm: {
            username: '',
            password: '',
            checkPassword: ''
          },
          rules: {
            username: [
              {validator: checkUsername, trigger: 'blur'}
            ],
            password: [
              {validator: validatePass, trigger: 'blur'}
            ],
            checkPassword: [
              {validator: validatePass2, trigger: 'blur'}
            ]
          },
          showRegister: false,
          dotsNum: 20,
        }
      },
      mounted() {
        this.showRegister= true;
      },
      created() {
        document.title = 'iCampus注册'
      },
      methods: {
          submitForm2(formName) {
            this.$refs[formName].validate((valid) => {
              if(valid) {
                let md5 = crypto.createHash("md5");
                md5.update(this.registerForm.password);
                let encode_pwd = md5.digest('hex');

                let registerParams = {user_id: this.registerForm.username, password: encode_pwd,
                role: "ROLE_TEACHER"};
                let requestParams = {'Member.user_id': this.registerForm.username};
                requestLogin(requestParams).then((res) => {
                  if(res.data.Member) {
                    this.$message.error('该用户已注册！');
                    this.$refs[formName].resetFields();
                  } else {
                    register(registerParams).then(data => {
                      console.log(data);
                      let type = data.type;
                      if(type !== "member") {
                        this.$message.error('注册错误！');
                        this.$refs[formName].resetFields();
                      } else {
                        this.$message({
                          message: '注册成功，请登录！',
                          type: 'success'
                        });
                        this.$router.push({path: '/login'});
                      }
                    });
                  }
                });
              }else {
                console.log('error submit');
                return false;
              }
            });
          },
          resetForm2(formName) {
            this.$refs[formName].resetFields();
          }
      }
    }
</script>

<style lang="less" scoped>
  @import '../style/mixin';

  .register_page {

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
    .wh(320px, 350px);
    .ctp(320px, 350px);
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
