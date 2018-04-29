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
            <div id="echart1" style="width: 300px;height: 200px;float: left;">

            </div>
            <span></span>
            <div id="echart2" style="width: 300px;height: 200px;float: left;">

            </div>
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
  import echarts from 'echarts'
  import { getUserList,getActivities,getNews } from "../api/api";

  export default {
    name: "Home",
    components: {
      NavMenu,
      Header,
      Footer
    },
    created() {
      document.title = 'iCampus'
    },
    data() {
      return {
        chart1: '',
        userType: ['学生', '教师', '管理员'],
        userData: [],
        chart2: '',
        campusType: ['校园新闻', '校园活动'],
        campusData: []
      }
    },
    methods: {
      drawUserPie(id) {
        this.chart1 = echarts.init(document.getElementById(id));
        this.chart1.setOption({
          title: { text: '注册人数统计' },
          tooltip: {
            trigger: 'item',
            formatter: '{a}<br/>{b}:{c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            data: this.userType
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius:['50%','70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'blod'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.userData
          }]
        });
      },
      drawCampusBar(id) {
        this.chart2 = echarts.init(document.getElementById(id));
        this.chart2.setOption({
          title: { text: '新闻活动统计' },
          tooltip: {},
          xAxis: {
            data: this.campusType
          },
          yAxis: {},
          series: [{
            name: '数量',
            type: 'bar',
            data: this.campusData
          }]
        });
      }
    },
    mounted: function() {
      let params1 = { 'Member.role': 'ROLE_STUDENT' };
      let params2 = { 'Member.role': 'ROLE_TEACHER' };
      let params3 = { 'Member.role': 'ROLE_ADMIN' };
      let student = [];
      let teacher = [];
      let admin = [];
      let stuNum = 0;
      let tchNum = 0;
      let adminNum = 0;
      getUserList(params1).then((res) => {
        student = res.data.Member;
        stuNum = student.length;
        let stuObj = { value: stuNum, name: this.userType[0] };
        this.userData.push(stuObj);

        getUserList(params2).then((res) => {
          teacher = res.data.Member;
          tchNum = teacher.length;
          let tchObj = { value: tchNum, name: this.userType[1] };
          this.userData.push(tchObj);

          getUserList(params3).then((res) => {
            admin = res.data.Member;
            adminNum = admin.length;
            let adminObj = { value: adminNum, name: this.userType[2] };
            this.userData.push(adminObj);

            console.log(this.userData);
            this.drawUserPie('echart1');
          });
        });

      });

      let params4 = {};
      let params5 = {};
      let activity = [];
      let news = [];
      let actNum = 0;
      let newsNum = 0;
      getActivities(params4).then((res) => {
        activity = res.data.Information;
        actNum = activity.length;
        this.campusData.push(actNum);

        getNews(params5).then((res) => {
          news = res.data.News;
          newsNum = news.length;
          this.campusData.push(newsNum);

          this.drawCampusBar('echart2');
        })
      })

      /*
      this.userData.push(stuNum);
      this.userData.push(tchNum);
      this.userData.push(adminNum);
      */


    }
  }
</script>

<style scoped>

</style>
