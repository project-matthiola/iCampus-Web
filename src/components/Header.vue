<template>
    <el-row style="height: 60px">
      <el-col :span="24" style="height: 60px">
        <el-col :span="1" style="height: 60px">
          <img src="@/assets/iCampus.png" style="width: 90%;height: 80%" />
        </el-col>
        <el-col :span="4">
          <span>iCampus</span>
        </el-col>
        <el-col :span="19" class="userinfo">
          <el-dropdown @command="handleCommand" menu-align="start" trigger="click">
          <span class="el-dropdown-link userinfo_inner">
            {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="home"><i class="el-icon-search"/>首页</el-dropdown-item>
              <div v-if="isLogin">
                <el-dropdown-item command="setting"><i class="el-icon-setting"/>设置</el-dropdown-item>
                <el-dropdown-item command="signout"><i class="el-icon-circle-close-outline"/>退出</el-dropdown-item>
              </div>
              <div v-else>
                <el-dropdown-item command="signin"><i class="el-icon-upload2"/>登录</el-dropdown-item>
              </div>
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
          userName: 'GUEST',
          isLogin: false
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
            if(command === 'signin') {
              this.$router.push('/login');
            }
            if(command === 'setting') {
              this.$router.push('/userSet');
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
          this.isLogin = true;
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
