<template>
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
            <template>
              <el-col :span="24" class="">
                <el-form :inline="true" :model="filters" class="demo-form-inline">
                  <el-form-item>
                    <el-input v-model="filters.name" placeholder=""></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="getUser" plain>查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleAdd" plain>新增</el-button>
                  </el-form-item>
                </el-form>
              </el-col>

              <el-table :data="users" highlight-current-row v-loading="listLoading"
                        :default-sort = "{prop: 'id', order: 'descending'}"
                        style="width: 100%">
                <el-table-column fixed prop="id" label="ID" sortable width="150">
                </el-table-column>
                <el-table-column prop="user_id" label="工号" sortable width="120">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="class_id" label="班级" sortable width="100">
                </el-table-column>
                <el-table-column prop="phone" label="手机号" width="120">
                </el-table-column>
                <el-table-column prop="password" label="密码" width="300">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)" type="primary" size="small" plain>编辑</el-button>
                    <el-button @click="handleDel(scope.$index, scope.row)" type="danger" size="small" plain>删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>

            <el-col :span="24" class="">
              <el-pagination small layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right"></el-pagination>
            </el-col>

            <!-- Edit page -->
            <el-dialog title="编辑用户" :visible.sync="editFormVisible" :close-on-click-modal="false">
              <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="工号" prop="user_id">
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
                <el-form-item label="密码" prop="password" hidden>
                  <el-input v-model="editForm.password" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role" hidden>
                  <el-input v-model="editForm.role" auto-complete="off" hidden></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" plain @click.native="editSubmit" :loading="editLoading">提交</el-button>
              </div>
            </el-dialog>

            <!-- Add page -->
            <el-dialog title="新增用户" :visible.sync="addFormVisible" :close-on-click-modal="false">
              <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="工号" prop="user_id">
                  <el-input v-model="addForm.user_id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="班级" prop="class_id">
                  <el-input v-model="addForm.class_id" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="addForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="addForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role" hidden>
                  <el-input v-model="addForm.role" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" plain @click.native="addSubmit" :loading="addLoading">提交</el-button>
              </div>
            </el-dialog>

          </el-main>
        </el-container>
      </el-container>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
</template>

<script>
    import Header from "@/components/Header"
    import NavMenu from "@/components/NavMenu"
    import Footer from '@/components/Footer'
    import crypto from 'crypto'
    import axios from 'axios'
    import{ getUserList, register,requestLogin,removeUser } from "../api/api";

    export default {
      name: "teacherInfo",
      components: {NavMenu, Header, Footer},
      data() {
        return {
          filters: {
            name: ''
          },
          users: [],
          total: 50,
          page: 1,
          listLoading: false,

          editFormVisible: false,
          editLoading: false,
          editFormRules: {
            user_id: [
              { required: true, message: '请输入工号', trigger: 'blur' }
            ]
          },
          editForm: {
            id: 0,
            user_id: '',
            name: '',
            class_id: '',
            phone: '',
            password: '',
            role: ''
          },
          addFormVisible: false,
          addLoading: false,
          addFormRules: {
            user_id: [
              { required: true, message: '请输入工号', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ]
          },
          addForm: {
            user_id: '',
            name: '',
            class_id: '',
            phone: '',
            password: '',
            role: ''
          }
        }
      },
      methods: {
        getUsersList() {
          let initParams = {'Member.role': 'ROLE_TEACHER'};
          this.listLoading = true;
          getUserList(initParams).then((res) => {
            this.users = res.data.Member;
            console.log(this.users);
            this.listLoading = false;
          });
        },
        getUser() {
          this.listLoading = true;
          if(this.filters.name){
            let params = {
              'Member.user_id': this.filters.name
            };
            getUserList(params).then((res) => {
              this.users = res.data.Member;
              console.log(this.users);
              this.listLoading = false;
            });
          } else {
            this.getUsersList();
          }
        },
        handleEdit: function(index, row) {
          this.editFormVisible = true;
          console.log(this.editFormVisible);
          this.editForm = Object.assign({}, row);
        },
        handleDel: function(index, row) {
          this.$confirm('确认删除该用户吗？', '提示', {
            type: 'warning'
          }).then(() => {
            this.listLoading = true;

            let delParams = {'Member.id': row.id };
            axios.delete('http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus/Member/'+row.id).then((res) => {
              this.listLoading = false;
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getUsersList();
            });
          }).catch(() => {});
        },
        handleAdd: function() {
          this.addFormVisible = true;
          this.addForm = {
            user_id: '',
            name: '',
            class_id: '',
            phone: '',
            password: '',
            role: 'ROLE_TEACHER'
          };
          console.log(this.addForm);
        },
        editSubmit: function() {
          this.$refs.editForm.validate((valid) => {
            if(valid) {
              this.$confirm('确认提交吗？', '提示', {}).then(() => {
                this.editLoading = true;
                let editParams = Object.assign({}, this.editForm);
                console.log(editParams);
                axios.put('http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus/Member/'+editParams.id, editParams).then((res) => {
                  this.editLoading = false;
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getUsersList();
                })
              })
            }
          });
        },
        addSubmit: function() {
          this.$refs.addForm.validate((valid) => {
            if(valid) {
              this.$confirm('确认提交吗？', '提交', {}).then(() => {
                this.addLoading = true;
                let addParams = Object.assign({}, this.addForm);
                let requestParams = {'Member.user_id': this.addForm.user_id};

                let md5 = crypto.createHash("md5");
                md5.update(this.addForm.password);
                let encode_pwd = md5.digest('hex');
                addParams.password = encode_pwd;
                console.log(addParams);

                requestLogin(requestParams).then((res) => {
                  this.addLoading = false;
                  if(res.data.Member) {
                    this.$message.error('该工号已注册！');
                    this.$refs['addForm'].resetFields();
                  } else {
                    register(addParams).then(data => {
                      console.log(data);
                      let type = data.type;
                      if(type !== "member") {
                        this.$message.error('注册错误！');
                        this.$refs['addForm'].resetFields();
                      } else {
                        this.$message({
                          message: '提交成功！',
                          type: 'success'
                        });
                        this.$refs['addForm'].resetFields();
                        this.addFormVisible = false;
                        this.getUsersList();
                      }
                    });
                  }
                });
              })
            }
          });
        },
      },
      mounted: function() {
        let initParams = {'Member.role': 'ROLE_TEACHER'};
        this.listLoading = true;
        getUserList(initParams).then((res) => {
          this.users = res.data.Member;
          console.log(this.users);
          this.listLoading = false;
        });
      },
      created() {
        document.title = '教师信息管理'
      }
    }
</script>

<style lang="less" scoped>

</style>
