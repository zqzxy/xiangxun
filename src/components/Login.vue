<template>
  <div class="login">

    <el-form :model="form" :rules="rules2" ref="loginForm" class="log-form" label-width="80px">

      <el-form-item label="用户名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="form.pass"></el-input>
      </el-form-item>

      <el-button type="primary" @click="sub()">登陆</el-button>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
          form:{
            name:'',
            pass:'',
          },
      }
    },
    methods: {
      sub(){
        this.$router.push({name:'Index', path:'/index'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login {
    height: 100%;
    position: relative;
    /*background-image: url("../../assets/login-bg.jpg");*/
  }
  .log-form{
    width: 40%;
    margin: 200px auto;
  }
</style>
