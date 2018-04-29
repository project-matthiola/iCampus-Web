<template>
  <div>
    <el-container>
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="220px">
          <NavMenu></NavMenu>
        </el-aside>
        <el-container>
          <el-main>

              <el-col :span="24">
                <span>个人信息设置</span>
              </el-col>

              <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="学号" prop="user_id">
                  <el-input v-model="editForm.user_id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="班级" prop="class_id">
                  <el-input v-model="editForm.class_id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="editForm.password" auto-complete="off" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain @click.native="editSubmit" :loading="editLoading">提交</el-button>
                </el-form-item>
              </el-form>

          </el-main>
        </el-container>
      </el-container>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>

</template>

<script>
  import NavMenu from '@/components/NavMenu'
  import Header from '@/components/Header'
  import Footer from '@/components/Footer'
  import crypto from 'crypto'
  import { editUser } from "../api/api";

  export default {
    name: "userSet",
    components: {
      Footer,
      Header,
      NavMenu
    },
    created() {
      document.title = '个人信息设置';
    },
    data() {
      return {
        editForm: {
          id: 0,
          user_id: '',
          name: '',
          class_id: '',
          phone: '',
          password: '',
          role: ''
        },
        editLoading: false,
        editFormRules: {
          user_id: [
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        }
      }
    },
    mounted: function() {
      let user = JSON.parse(sessionStorage.getItem('user'));
      console.log(user[0]);
      //this.editForm = Object.assign({}, user);
      this.editForm = user[0];
      this.editForm.password = '';
      console.log(this.editForm);
    },
    methods: {
      editSubmit: function() {
        this.$refs.editForm.validate((valid) => {
          if(valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let editParams = Object.assign({}, this.editForm);

              let md5 = crypto.createHash("md5");
              md5.update(this.editForm.password);
              let encode_pwd = md5.digest("hex");
              editParams.password = encode_pwd;

              editUser(editParams).then(() => {
                this.editLoading = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                sessionStorage.removeItem('userInfo');
                this.$router.push('/login');
              });
            })
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
