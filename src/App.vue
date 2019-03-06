<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import 'assets/common/common.css';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-image: url("assets/bg.jpg");

  }
  html , body ,#app{ height: 100%; overflow-x: hidden; padding: 0; margin: 0;background-color: #F1F1F5; outline: none}
  h1,h2,h3,h4,h5,h6,ul,li,ol{ padding: 0; margin: 0;}
  ul,li,ol{ list-style: none;}


</style>
