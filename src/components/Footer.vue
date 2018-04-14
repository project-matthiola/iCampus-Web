<template>
  <div id="footer">
    <el-row>
      <el-col :span="24">
        <p class="text_center">Copyright © 2018 iCampus Group</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style lang="less" scoped>
.text_center {
  text-align: center;
  color: lightgray;
  font-size: small;
}
</style>
