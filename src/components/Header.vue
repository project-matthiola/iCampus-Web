<template>
    <el-row>
      <el-col :span="24">
        <el-col :span="4">
          <span>iCampus</span>
        </el-col>
        <el-col :span="20" class="userinfo">
          <el-dropdown @command="handleCommand" menu-align="start" trigger="click">
          <span class="el-dropdown-link userinfo_inner">
            {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="home">首页</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="signout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-col>
    </el-row>
</template>

<script>
    export default {
      name: "Header",
      data() {
        return {
          userName: 'UnknownUser'
        }
      },
      methods: {
          async handleCommand(command) {
            //this.$message('click on item ' + command);
            //console.log(command);
            if(command === 'home') {
              let user = sessionStorage.getItem('user');
              if(user) {
                this.$router.push('/');
              } else {
                this.$router.push('login');
              }
            }
            if(command === 'signout') {
              sessionStorage.removeItem('user');
              this.$message({
                message: '成功登出',
                type: 'success'
              });
              this.$router.push('/login');
              /*
              let NewPage = '_empty' + '?time=' + new Date().getTime()/1000
              this.$router.push(NewPage)
              this.$router.go(-1)
              */
            }
          }
      },
      mounted() {
        let user = sessionStorage.getItem('user');
        if(user) {
          user = JSON.parse(user);
          this.userName = user[0].user_id || '';
        }
      }

    }
</script>

<style lang="less" scoped>
  .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
    .userinfo_inner {
      cursor: pointer;
      color:#fff;
    }
  }
  .el-dropdown-link {
    cursor: pointer;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
