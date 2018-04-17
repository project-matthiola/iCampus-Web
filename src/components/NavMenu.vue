<template>
  <el-row class="tac">
    <el-col :span="12">
      <el-menu
        class="el-menu-vertical-demo"
        @open="handleClose"
        @close="handleClose"
        unique-opened
        v-bind:router="true">
        <el-submenu v-for="item in menu" :index="item.id" :key="item.id">
          <template slot="title">
            <i :class="item.iconCls"></i>
            <span v-text="item.name"></span>
          </template>
          <el-menu-item-group class="over-hide" v-for="sub in item.sub" :key="sub.componentName">
            <el-menu-item :index="sub.componentName" v-text="sub.name"></el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
  import menu from '../config/menu-config'

    export default {
      name: "NavMenu",
      data() {
        return {
          menu: menu,
          isCollapse: false
        }
      },
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        }
      }
    }
</script>

<style scoped>
  .over-hide{
    overflow: hidden;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
