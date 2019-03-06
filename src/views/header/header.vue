<template>
  <div class="con">
    <el-row>
      <el-col :span="6" :offset="2">
        <img :src="img" alt="">
      </el-col>
      <el-col :span="4" :offset="8"><img class="cur" :src="img1" alt=""><span>{{cur_time}}</span></el-col>
      <el-col :span="4"><img class="user" :src="img2" alt="">用户名<i class="fa fa-chevron-down" aria-hidden="true" style="margin-left: 10px;"></i></el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'header',
    data () {
      return {
        img: require('../../assets/title.png'),
        img1: require('../../assets/cur.png'),
        img2: require('../../assets/user.png'),
        cur_time: new Date(),
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
          console.log(Y+M+D+h+m+s);
          this.cur_time = Y+M+D+h+m+s
        }
    },
    mounted () {
      this.fomat_date();
      setInterval(this.fomat_date,1000)
    }
  }
</script>

<style scoped>
  .con {
    color: white;
    margin-top: 35px;
    font-size: 18px;
  }
  .cur, .user{float: left; margin: 0 15px}

</style>
