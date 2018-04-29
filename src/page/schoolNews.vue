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
                    <el-input v-model="filters.name" placeholder="新闻标题"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" v-on:click="getActivity" plain>查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleAdd" plain :disabled="addPermission">新增</el-button>
                  </el-form-item>
                </el-form>
              </el-col>

              <el-table :data="news" highlight-current-row v-loading="listLoading"
                        :default-sort = "{prop: 'id', order: 'descending'}"
                        style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="新闻标题：">
                        <span>{{ props.row.title }}</span>
                      </el-form-item>
                      <el-form-item label="新闻作者：">
                        <span>{{ props.row.author }}</span>
                      </el-form-item>
                      <el-form-item label="新闻时间：">
                        <span>{{ props.row.news_time }}</span>
                      </el-form-item>
                      <el-form-item label="新闻内容：">
                        <span>{{ props.row.text }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="新闻ID"
                  prop="id" sortable width="150">
                </el-table-column>
                <el-table-column
                  label="新闻标题"
                  prop="title" width="220">
                </el-table-column>
                <el-table-column
                  label="新闻时间"
                  prop="news_time" sortable>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)" type="primary" size="small" plain :disabled="editPermission">编辑</el-button>
                    <el-button @click="handleDel(scope.$index, scope.row)" type="danger" size="small" plain :disabled="delPermission">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>

            <!-- Edit page -->
            <el-dialog title="编辑新闻" :visible.sync="editFormVisible" :close-on-click-modal="false">
              <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="新闻标题" prop="title">
                  <el-input v-model="editForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新闻作者" prop="author">
                  <el-input v-model="editForm.author" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新闻时间" prop="news_time">
                  <el-col :span="11">
                    <el-date-picker type="datetime" placeholder="选择日期时间" v-model="editForm.news_time" style="width: 100%;"></el-date-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="新闻内容" prop="text">
                  <el-input type="textarea" v-model="editForm.text" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" plain @click.native="editSubmit" :loading="editLoading">提交</el-button>
              </div>
            </el-dialog>


            <!-- Add page -->
            <el-dialog title="新增新闻" :visible.sync="addFormVisible" :close-on-click-modal="false">
              <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
                <el-form-item label="新闻标题" prop="title">
                  <el-input v-model="addForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新闻作者" prop="author">
                  <el-input v-model="addForm.author" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新闻时间" prop="news_time">
                  <el-col :span="11">
                    <el-date-picker type="datetime" placeholder="选择日期时间" v-model="addForm.news_time" style="width: 100%;"></el-date-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="新闻内容" prop="text">
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
  import { getNews,addNews,removeNews,editNews} from "../api/api"
  import { GmtToStr,StrToGmt,getRole } from "../api/common"

  export default {
    name: "schoolNews",
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
        news: [],
        editPermission: false,
        addPermission: false,
        delPermission: false,

        addFormVisible: false,
        addLoading: false,
        addFormRules: {
          title: [
            { required: true, message: '请输入新闻标题', trigger: 'blur' }
          ],
          news_time: [
            { required: true, message: '请输入新闻时间', trigger: 'blur' }
          ],
          author: [
            { required: true, message: '请输入新闻作者', trigger: 'blur' }
          ],
          text: [
            { required: true, message: '请输入新闻内容', trigger: 'blur' }
          ]
        },
        addForm: {
          title: '',
          news_time: '',
          author: '',
          text: ''
        },
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          title: [
            { required: true, message: '请输入新闻标题', trigger: 'blur' }
          ],
          news_time: [
            { required: true, message: '请输入新闻时间', trigger: 'blur' }
          ],
          author: [
            { required: true, message: '请输入新闻作者', trigger: 'blur' }
          ],
          text: [
            { required: true, message: '请输入新闻内容', trigger: 'blur' }
          ]
        },
        editForm: {
          id: 0,
          title: '',
          news_time: '',
          author: '',
          text: ''
        }
      }
    },
    create() {
      document.title = '校园新闻管理'
    },
    mounted: function() {
      let initParams = {};
      this.listLoading = true;
      getNews(initParams).then((res) => {
        this.news = res.data.News;
        this.listLoading = false;
      });
      this.editPermission = true;
      this.delPermission = true;
      this.addPermission = true;
      let role = getRole();
      if(role === 'ROLE_ADMIN') {
        this.editPermission = false;
        this.delPermission = false;
        this.addPermission = false;
      }
    },
    methods: {
      getNewsList() {
        let initParams = {};
        this.listLoading = true;
        getNews(initParams).then((res) => {
          this.news = res.data.News;
          this.listLoading = false;
        });
      },
      searchNews() {
        this.listLoading = true;
        if(this.filters.name) {
          let params = {
            'News.title': this.filters.name
          };
          getNews(params).then((res) => {
            this.news = res.data.news;
            this.listLoading = false;
          });
        } else {
          this.getNewsList();
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
              let Gmt = this.addForm.news_time;
              //console.log(Gmt);
              let Str = GmtToStr(Gmt);
              this.addForm.news_time = Str;
              let addParams = Object.assign({}, this.addForm);
              console.log(addParams);

              addNews(addParams).then(data => {
                console.log(data);
                let type = data.type;
                if(type !== 'news') {
                  this.$message.error('新增新闻错误！');
                  this.$refs['addForm'].resetFields();
                } else {
                  this.$message({
                    message: '提交成功！',
                    type: 'success'
                  });
                  this.$refs['addForm'].resetFields();
                  this.addFormVisible = false;
                  this.getNewsList();
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
              let Gmt = this.editForm.news_time;
              let Str = GmtToStr(Gmt);
              this.editForm.news_time = Str;
              let editParams = Object.assign({}, this.editForm);
              console.log(editParams);
              editNews(editParams).then((res) => {
                this.editLoading = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getNewsList();
              });
            })
          }
        });
      },
      handleDel: function(index, row) {
        this.$confirm('确认删除该新闻吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;

          let delParams = {id: row.id};

          removeNews(delParams).then((res) => {
            this.listLoading = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getNewsList();
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
