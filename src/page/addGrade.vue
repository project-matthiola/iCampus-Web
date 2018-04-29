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

              <el-table :data="scores" highlight-current-row v-loading="listLoading"
                        :default-sort="{prop: 'id', order: 'descending'}" style="width: 100%">
                <el-table-column fixed prop="id" label="ID" sortable width="200">
                </el-table-column>
                <el-table-column prop="user_id" label="学号" sortable width="250">
                </el-table-column>
                <el-table-column prop="course_id" label="课号" sortable width="250">
                </el-table-column>
                <el-table-column prop="score" label="成绩" sortable width="150">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)" type="primary" size="small" plain>编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>

            <!-- Edit page -->
            <el-dialog title="上传成绩" :visible.sync="editFormVisible" :close-on-click-modal="false">
              <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="成绩" prop="score">
                  <el-input type="number" v-model.number="editForm.score" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" plain @click.native="editSubmit" :loading="editLoading">提交</el-button>
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
  import { getCourses,getSelections,getScores,initScores,editScore } from "../api/api"
  import {  } from "../api/common"

  export default {
    name: "addGrade",
    components: {
      Footer,
      Header,
      NavMenu
    },
    data() {
      return {
        filters: {
          name: ''
        },
        course_id: '',
        selections: [],
        scores: [],
        flag: true,
        loop: '',
        listLoading: false,
        editFormVisible: false,
        editLoading: false,
        editFormRules: {
          score: [
            { required: true, message: '请输入成绩', trigger: 'blur' }
          ]
        },
        editForm: {
          id: 0,
          user_id: '',
          course_id: '',
          score: ''
        }
      }
    },
    methods: {
      /*
      getCourseID: function() {
        let Cid = this.$route.params.Cid;
        axios.get('http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus/Course/'+Cid).then((res) => {
          let course = res.data;
          console.log(course);
          this.course_id = course.course_id;
          console.log(this.course_id);
        });
      },
      getSelectionList: function() {
        let course_id = this.course_id;
        let queryParams = {
          'Selection.course_id': course_id
        };
        console.log(queryParams);
        getSelections(queryParams).then((res) => {
          this.selections = res.data.Selection;
          console.log(this.selections);
        });
      },
      getScoreList: function() {
        let queryParams = {
          'Grade.course_id': this.course_id
        };
        getScores(queryParams).then((res) => {
          this.scores = res.data.Grade;
          if(this.scores == null) {
            for(let i = 0;i < this.selections.length;i++) {
              console.log(this.selections[i]);
            }
          }
        });
      },
      */
      getCourseID: function(Cid) {
        return new Promise((resolve, reject) => {
          //let Cid = this.$route.params.Cid;
          let params = {id: Cid};
          axios.get('http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus/Course/'+Cid).then((res) => {
            let course = res.data;
            console.log(course);
            this.course_id = course.course_id;
            console.log(this.course_id);
            resolve(this.course_id);
          });
        });
      },
      getSelectionList: function(course_id) {
        return new Promise((resolve, reject) => {
          //let course_id = this.course_id;
          let queryParams = {
            'Selection.course_id': course_id
          };
          console.log(queryParams);
          axios.get('http://202.120.40.87:22471/Entity/Ubfbd4152866263/iCampus/Selection/',{params:queryParams}).then((res) => {
            this.selections = res.data.Selection;
            this.loop = this.selections.length;

            let user = sessionStorage.getItem('user');
            let user_id = '';
            if(user) {
              user = JSON.parse(user);
              user_id = user[0].user_id;
            }

            for(let i = 0;i < this.loop;i++){
              let tmp_info = this.selections[i];
              if(tmp_info['user_id'] === user_id) {
                this.selections.remove(i);
              }
            }

            let arr = [this.course_id,this.selections,this.loop,this.flag];
            resolve(arr);
          });
        })
      },
      getScoreList: function(arr) {
        return new Promise((resolve, reject) => {
          let course_id = arr[0];
          let selections = arr[1];
          let loop = arr[2];
          let flag = arr[3];

          let gradeParams = {
            'Grade.course_id': course_id
          };
          //console.log(loop,flag);
          getScores(gradeParams).then((res) => {
            this.scores = res.data.Grade;
            if(this.scores == null) {
              let initScoreList = [];
              for(let i = 0;i < loop;i++) {
                let tmp_selection = selections[i];
                delete tmp_selection.id;
                tmp_selection.score = 0;
                initScoreList.push(tmp_selection);
              }
              //console.log(initScoreList);
              this.initScoreLoop(initScoreList,loop,flag);

              getScores(gradeParams).then((res4) => {
                this.scores = res4.data.Grade;
              });
            }
            resolve(this.scores);
          });
        })
      },
      initScoreLoop: function(params,loop,flag) {
        if(flag && loop > 0) {
          initScores(params[loop - 1]).then(data => {
            console.log(data);
            loop --;
            this.initScoreLoop(params,loop,flag);
          }).catch(() => {
            flag = false;
          });
        }
      },
      /*
      initScoreLoop: function(params) {
        if(this.flag && this.loop > 0) {
          initScores(params[this.loop - 1]).then(data => {
            console.log(data);
            this.loop --;
            this.initScoreLoop(params);
          }).catch(() => {
            this.flag = false;
          });
        }
      }
      */
      handleEdit: function(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      editSubmit: function() {
        this.$refs.editForm.validate((valid) => {
          if(valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              /*
              let score_str = this.editForm.score;
              let score = parseInt(score_str);
              this.editForm.score = score;
              */
              let editParams = Object.assign({}, this.editForm);
              editScore(editParams).then(() => {
                this.editLoading = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                let queryParams = {
                  'Grade.course_id': this.course_id
                };
                getScores(queryParams).then((res) => {
                  this.scores = res.data.Grade;
                });
              });
            })
          }
        });
      }
    },
    mounted: function() {
      let Cid = this.$route.params.Cid;
       this.listLoading = true;
      this.getCourseID(Cid).then((course_id) => {
        this.getSelectionList(course_id).then((arr) => {
          this.getScoreList(arr);
        })
      });
      this.listLoading = false;
      /*
      getCourses(courseParams).then((res) => {
        let course = res.data;
        _this_.course_id = course.course_id;
        console.log(_this_.course_id);

        let selectParams = {
          'Selection.course_id': _this_.course_id
        };
        getSelections(selectParams).then((res2) => {
          _this_.selections = res2.data.Selection;
          console.log(_this_.selections);
          _this_.loop = _this_.selections.length;

          let gradeParams = {
            'Grade.course_id': _this_.course_id
          };
          getScores(gradeParams).then((res3) => {
            _this_.scores = res3.data.Grade;

            if(_this_.scores == null) {
              let initScoreList = [];
              for(let i = 0;i < _this_.loop;i++) {
                let tmp_selection = _this_.selections[i];
                delete tmp_selection.id;
                tmp_selection.score = 0;
                initScoreList.push(tmp_selection);
              }
              console.log(initScoreList);
              _this_.initScoreLoop(initScoreList);

              getScores(gradeParams).then((res4) => {
                _this_.scores = res4.data.Grade;
              });
            }
          });
        });
      });
      */
    },
    created() {
      document.title = '成绩录入';
    }
  }
</script>

<style scoped>

</style>
