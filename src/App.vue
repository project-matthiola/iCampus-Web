<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  //import NavMenu from './components/NavMenu'
  //import Header from './components/Header'

export default {
  name: 'App',
  //components: {Header, NavMenu}
}
</script>

<style lang="less">
  @import './style/common';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  color: #2c3e50;
}
  .header {
    background-color: #D0021B;
    color: #fff;
    line-height: 60px;
  }
</style>
