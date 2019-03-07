<template>
  <div class="con">
    <el-row>
      <el-col :span="6" :offset="2">
        <img :src="img" alt="">
      </el-col>
      <el-col :span="4" :offset="8"><img class="cur" :src="img1" alt=""><span>{{cur_time}}</span></el-col>
      <el-col :span="4">
        <img class="user" :src="img2" alt="">
        <el-dropdown trigger="click">
  <span class="el-dropdown-link" style="color: white; font-weight: bold; font-size: 18px">
    {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><span  @click="logOut()">退出</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'headers',
    data () {
      return {
        img: require('../../assets/title.png'),
        img1: require('../../assets/cur.png'),
        img2: require('../../assets/user.png'),
        cur_time: new Date(),
        name: ''
      }
    },
    methods: {
        fomat_date(){
          let date = new Date();
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
          let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
          let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
          let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
          //console.log(Y+M+D+h+m+s);
          this.cur_time = Y+M+D+h+m+s
        },
      logOut(){
          console.log(1)
        this.$router.push({name:'Login', path:'/'});
      }
    },
    mounted () {
      this.name = localStorage.getItem('loginName')
      this.fomat_date();
      setInterval(this.fomat_date,1000)
    },

  }
</script>

<style scoped>
  .con {
    color: white;
    margin-top: 35px;
    font-size: 18px;
  }
  .cur, .user{float: left; margin: 0 15px}


  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: rgb(59,59,59);
    color: white;
  }
</style>
