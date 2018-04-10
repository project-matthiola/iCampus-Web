<template>
  <div>
    <el-container>
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="400px">
          <NavMenu></NavMenu>
        </el-aside>
        <el-container>
          <el-main>

          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import NavMenu from '@/components/NavMenu'
  import Header from '@/components/Header'
    export default {
      name: "Home",
      components: {
        NavMenu,
        Header
      }
    }
</script>

<style scoped>

</style>
