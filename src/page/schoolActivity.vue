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
              <template>
                <el-col :span="24" class="">
                  <el-form :inline="true" :model="filters" class="demo-form-inline">
                    <el-form-item>
                      <el-input v-model="filters.name" placeholder="活动名"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" v-on:click="getActivity" plain>查询</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="handleAdd" plain>新增</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-table :data="activities" highlight-current-row v-loading="listLoading"
                          :default-sort = "{prop: 'id', order: 'descending'}"
                          style="width: 100%">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="活动名称">
                          <span>{{ props.row.title }}</span>
                        </el-form-item>
                        <el-form-item label="活动地点">
                          <span>{{ props.row.place }}</span>
                        </el-form-item>
                        <el-form-item label="活动时间">
                          <span>{{ props.row.time }}</span>
                        </el-form-item>
                        <el-form-item label="活动组织者">
                          <span>{{ props.row.source }}</span>
                        </el-form-item>
                        <el-form-item label="活动描述">
                          <span>{{ props.row.text }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="活动ID"
                    prop="id" sortable width="150">
                  </el-table-column>
                  <el-table-column
                    label="活动名称"
                    prop="title" width="220">
                  </el-table-column>
                  <el-table-column
                    label="活动时间"
                    prop="time" sortable>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button @click="handleEdit(scope.$index, scope.row)" type="primary" size="small" plain>编辑</el-button>
                      <el-button @click="handleDel(scope.$index, scope.row)" type="danger" size="small" plain>删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>

              <!-- Edit page -->
              <el-dialog title="编辑活动" :visible.sync="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                  <el-form-item label="活动名称" prop="title">
                    <el-input v-model="editForm.title" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="活动地点" prop="place">
                    <el-input v-model="editForm.place" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="活动时间" prop="time">
                    <el-col :span="11">
                      <el-date-picker type="datetime" placeholder="选择日期时间" v-model="editForm.time" style="width: 100%;"></el-date-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="活动组织者" prop="source">
                    <el-input v-model="editForm.source" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="活动描述" prop="text">
                    <el-input type="textarea" v-model="editForm.text" auto-complete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click.native="editFormVisible = false">取消</el-button>
                  <el-button type="primary" plain @click.native="editSubmit" :loading="editLoading">提交</el-button>
                </div>
              </el-dialog>


              <!-- Add page -->
              <el-dialog title="新增活动" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                  <el-form-item label="活动名称" prop="title">
                    <el-input v-model="addForm.title" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="活动地点" prop="place">
                    <el-input v-model="addForm.place" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="活动时间" prop="time">
                    <el-col :span="11">
                      <el-date-picker type="datetime" placeholder="选择日期时间" v-model="addForm.time" style="width: 100%;"></el-date-picker>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="活动组织者" prop="source">
                    <el-input v-model="addForm.source" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="活动描述" prop="text">
                    <el-input type="textarea" v-model="addForm.text" auto-complete="off"></el-input>
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
    </div>
</template>

<script>
  import NavMenu from '@/components/NavMenu'
  import Header from '@/components/Header'
  import Footer from '@/components/Footer'
  import axios from 'axios'
  import { getActivities,addActivities } from "../api/api"

  export default {
    name: "schoolActivity",
    components:{
      NavMenu,
      Header,
      Footer
    },
    data() {
      return {
        filters: {
          name: ''
        },
        listLoading: false,
        activities: [],
        /*
        activities: [{
          id: '12987122',
          title: '留学讲座',
          place: '电院3306',
          time: 'Sat Apr 14 2018 10:40:52 GMT+0800 (CST)',
          source: '越扬教育',
          text: '慢慢干货，留学讲座'
        }, {
          id: '12987123',
          title: '留学讲座',
          place: '电院3306',
          time: 'Sat Apr 14 2018 10:40:52 GMT+0800 (CST)',
          source: '越扬教育',
          text: '慢慢干货，留学讲座'
        }, {
          id: '12987125',
          title: '留学讲座',
          place: '电院3306',
          time: 'Sat Apr 14 2018 10:40:52 GMT+0800 (CST)',
          source: '越扬教育',
          text: '慢慢干货，留学讲座'
        }, {
          id: '12987126',
          title: '留学讲座',
          place: '电院3306',
          time: 'Sat Apr 14 2018 10:40:52 GMT+0800 (CST)',
          source: '越扬教育',
          text: '慢慢干货，留学讲座'
        }],
        */
        addFormVisible: false,
        addLoading: false,
        addFormRules: {
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '请输入活动时间', trigger: 'blur' }
          ],
          place: [
            { required: true, message: '请输入活动时间', trigger: 'blur' }
          ],
          source: [
            { required: true, message: '请输入活动组织者', trigger: 'blur' }
          ]
        },
        addForm: {
          title: '',
          place: '',
          time: '',
          source: '',
          text: ''
        },
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '请输入活动时间', trigger: 'blur' }
          ],
          place: [
            { required: true, message: '请输入活动时间', trigger: 'blur' }
          ],
          source: [
            { required: true, message: '请输入活动组织者', trigger: 'blur' }
          ]
        },
        editForm: {
          id: 0,
          title: '',
          place: '',
          time: '',
          source: '',
          text: ''
        }
      }
    },
    created() {
      document.title = '校园活动管理'
    },
    mounted: function() {
      let initParams = {};
      this.listLoading = true;
      getActivities(initParams).then((res) => {
        this.activities = res.data.Information;
        console.log(this.activities);
        this.listLoading = false;
      });
    },
    methods: {
      getActivityList() {
        let initParams = {};
        this.listLoading = true;
        getActivities(initParams).then((res) => {
          this.activities = res.data.Information;
          console.log(this.activities);
          this.listLoading = false;
        });
      },
      getActivity() {
        this.listLoading = true;
        if(this.filters.name) {
          let params = {
            'Information.title': this.filters.name
          };
          getActivities(params).then((res) => {
            this.activities = res.data.Information;
            console.log(this.activities);
            this.listLoading = false;
          });
        } else {
          this.getActivityList();
        }
      },
      handleAdd: function() {
        this.addFormVisible = true;
      },
      addSubmit: function() {
        this.$refs.addForm.validate((valid) => {
          if(valid) {
            this.$confirm('确认提交吗？', '提交', {}).then(() => {
              this.addLoading = true;
              console.log(this.addForm);
              let addParams = Object.assign({}, this.addForm);
              addActivities(addParams).then(data => {
                console.log(data);
                let type = data.type;
                if(type !== 'information') {
                  this.$message.error('新增活动错误！');
                  this.$refs['addForm'].resetFields();
                } else {
                  this.$message({
                    message: '提交成功！',
                    type: 'success'
                  });
                  this.$refs['addForm'].resetFields();
                  this.addFormVisible = false;
                  this.getActivityList();
                }
              });
            });
          }
        });
      },
      handleEdit: function(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      editSubmit: function() {
        this.$refs.editForm.validate((valid) => {
          if(valid) {
            this.$confirm('确认提交吗？', '提交', {}).then(() => {
              this.editLoading = true;
              let editParams = Object.assign({}, this.editForm);
              console.log(editParams);
              axios.put('http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus/Information/'+editParams.id, editParams).then((res) => {
                this.editLoading = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getActivityList();
              })
            })
          }
        });
      },
      handleDel: function(index, row) {
        this.$confirm('确认删除该活动信息吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;

          let delParams = {'Information.id': row.id};
          axios.delete('http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus/Information/'+row.id).then((res) => {
            this.listLoading = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getActivityList();
          });
        }).catch(() => {});
      }
    }
  }
</script>

<style lang="less" scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
