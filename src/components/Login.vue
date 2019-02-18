<template>
  <div class="login">

    <el-form :model="form" :rules="rules2" ref="loginForm" class="log-form" label-width="80px">

      <el-form-item label="账户">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="form.pass"></el-input>
      </el-form-item>

      <el-form-item label=" ">
        <el-button type="primary" @click="sub()" class="log-btn">登陆</el-button>
      </el-form-item>
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
    background: lightblue;
    overflow: hidden;
  }
  .log-form{
    width: 25%;
    margin: 300px auto;
  }
  .log-btn{
    width: 100%;
  }
</style>
