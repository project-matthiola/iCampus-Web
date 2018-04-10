<template>
    <el-row>
      <el-col :span="24">
        <el-col :span="4">
          <span>iCampus</span>
        </el-col>
        <el-col :span="20" class="userinfo">
          <el-dropdown @command="handleCommand" menu-align="start" trigger="click">
          <span class="el-dropdown-link">
            个人信息<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="home">首页</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="singout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-col>
    </el-row>
</template>

<script>
    export default {
      name: "Header",
      methods: {
          async handleCommand(command) {
            this.$message('click on item ' + command);
            console.log(command);
          }
      }
    }
</script>

<style scoped>
  .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
  }
  .el-dropdown-link {
    cursor: pointer;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
