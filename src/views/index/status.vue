<template>
  <div class="con">
    <div class="title"><span></span>开关状态</div>
    <div class="img">
      <img :src="img" alt="" class="big-on">
      <img v-if="value == true" :src="img1" alt="" class="on">
      <img v-else :src="img2" alt="" class="on">
    </div>
    <div class="turn">
      <el-switch
        v-model="value"
        active-color="#c49c6e"
        inactive-color="#151515"
        active-text="关"
        inactive-text="开"
        @change="change()">
      </el-switch>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'status',
    data () {
      return {
        img: require('../../assets/turn.png'),
        value: true,
        img1: require('../../assets/on.png'),
        img2: require('../../assets/off.png')
      }
    },
    methods: {
      change () {
        console.log(this.value)
      }
    }
  }
</script>

<style scoped>
  .con {
    border: solid 1px #3b3b3b;
    height: 700px;
    margin-top: 70px;
    color: #714f2a;
    background-color: rgba(59, 59, 59, 0.5);
  }

  .title {
    text-align: center;
    margin-top: 50px;
    font-size: 18px;

  }

  .title span {
    width: 10px;
    height: 15px;
    display: inline-block;
    background-color: #c49c6e;
    margin-right: 15px;

  }

  .big-on {
    width: 45%;
    margin: 100px auto 0;
    display: block;
  }

  .turn div {
    width: 90px;
    margin: 20px auto;
    display: block;
  }

  .img {
    position: relative;
  }

  .on {
    width: 40px;
    position: absolute;
    top: 42%;
    left: 46%;
  }
</style>
