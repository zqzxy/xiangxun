<template>
  <div class="con">
    <el-row>
      <el-col :span="6" :offset="2">
        <img :src="img" alt="">
      </el-col>
      <el-col :span="8" :offset="4">123</el-col>
      <el-col :span="4">用户名</el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'header',
    data () {
      return {
        img: require('../../assets/title.png'),
      }
    }
  }
</script>

<style scoped>
  .con {
    color: white;
    margin-top: 35px;
  }

</style>
