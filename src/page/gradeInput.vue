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
                      <el-input v-model="filters.name" placeholder="课程名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" v-on:click="getCourse" plain>查询</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>

                <el-table :data="courses" highlight-current-row v-loading="listLoading"
                          :default-sort="{prop: 'id', order: 'descending'}" style="width: 100%">
                  <el-table-column fixed prop="id" label="ID" sortable width="200">
                  </el-table-column>
                  <el-table-column prop="course_id" label="课号" sortable width="250">
                  </el-table-column>
                  <el-table-column prop="course_name" label="课程名" width="270">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button @click="handleEnter(scope.$index, scope.row)" type="primary" size="small" plain>录入成绩</el-button>
                    </template>
                  </el-table-column>
                </el-table>

              </template>
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
  import { getCourses,getSelections } from "../api/api";
  import axios from 'axios'

  export default {
    name: "gradeInput",
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
        courses: [],
        selections: [],
        listLoading: false
      }
    },
    methods: {
      getCourseList() {
        let initParams = {};
        this.listLoading = true;
        getCourses(initParams).then((res) => {
          this.courses = res.data.Course;
          console.log(this.courses);
          this.listLoading = false;
        });
      },
      getSpecificCourseList() {
        let user = sessionStorage.getItem('user');
        let user_id = '';
        if(user) {
          user = JSON.parse(user);
          user_id = user[0].user_id;
        }
        let selectParams = {
          'Selection.user_id': user_id
        };
        getSelections(selectParams).then((res) => {
          this.selections = res.data.Selection;
        });
      },
      getCourse() {
        this.listLoading = true;
        if(this.filters.name){
          let params = {'Course.course_name': this.filters.name};
          getCourses(params).then((res) => {
            this.courses = res.data.Course;
            console.log(this.courses);
            this.listLoading = false;
          });
        } else {
          this.getCourseList();
        }
      },
      handleEnter: function(index, row) {
        let course_id = row.course_id;
        let flag = 0;
        for(let i = 0;i < this.selections.length;i++) {
          let tmp_selection = this.selections[i];
          if(tmp_selection['course_id'] === course_id){
            flag++;
          }
        }
        if(flag === 0){
          this.$message.error('权限错误！');
        } else{
          let Cid = row.id;
          this.$router.push({name: 'addGrade', params:{Cid: Cid}});
        }
      }
    },
    mounted() {
      this.getCourseList();
      this.getSpecificCourseList();
    },
    created() {
      document.title = '成绩管理'
    }
  }
</script>

<style scoped>

</style>
