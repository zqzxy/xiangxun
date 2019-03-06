<template>
  <div class="big-con">
    <el-row>
      <el-col :span="24">
        <Headers></Headers>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="width: 30%; margin-left: 6%; margin-right: 4%">
        <Status></Status>
      </el-col>
      <el-col style="width: 54%;">
        <Set></Set>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Headers from '../views/header/headers'
  import Set from '../views/index/set'
  import Status from '../views/index/status'
  export default {
    name: 'Index',
    components: {
      Headers,
      Set,
      Status
    },
    data () {
      return {

      }

    },
    methods: {

    }
  }
</script>

<style scoped>
  .el-button+.el-button{
    margin-left: 0;
  }
  .big-con{
    height: 100%;
    /*background-image: url("../assets/bg.jpg");*/
  }

</style>
