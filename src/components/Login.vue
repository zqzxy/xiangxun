<template>
  <div class="login">
    <el-form :model="form" ref="form" class="log-form" label-width="80px" :rules="rules">

      <el-form-item label="账户" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pass">
        <el-input v-model="form.pass"></el-input>
      </el-form-item>

      <el-form-item label=" ">
        <el-button type="primary" @click="submitForm('form')" class="log-btn">登陆</el-button>
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
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          pass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //alert('submit!');
            this.$axios({
              method: 'get',
              url: 'iotcp/xiangxun/login',
              params: {loginName: this.form.name,password: this.form.pass}
            }).then((res) => {
              //console.log(res)
              if(res.data.statusCode == 1001){
                this.$message('登陆成功')
                this.$router.push({name:'Index', path:'/index'});
                localStorage.setItem('key',res.data.result.key);
                localStorage.setItem('token',res.data.result.token);
                localStorage.setItem('loginName',res.data.result.loginName);
                localStorage.setItem('userID','admin');
                let str=document.location.protocol;
                console.log(str);
                let ws='';
                if(str.indexOf('https')!=-1){ ws='wss://';}
                else {ws='ws://';}
                localStorage.setItem('websocketUrl', ws + res.data.result.websocketIp + ':' + res.data.result.websocketPort)
              }else{
                this.$message('登陆失败')
              }

            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      sub(){

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login {
    height: 100%;
    position: relative;
    overflow: hidden;
    background-image: url("../assets/bg.jpg");
  }
  .log-form{
    width: 25%;
    margin: 300px auto;
  }
  .log-btn{
    width: 100%;
  }
  .el-button--primary{
    background-color: #727272;
    border-color: #727272;
  }
</style>
