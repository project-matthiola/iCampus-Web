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
    export default {
      name: "Home",
      components: {
        NavMenu,
        Header,
        Footer
      },
      created() {
        document.title = 'iCampus'
      }
    }
</script>

<style scoped>

</style>
