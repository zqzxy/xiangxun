<template>
  <div class="con">
    <div class="left">
      <div class="title">
        <span></span>智能设置
      </div>
      <div class="time">
        <div class="start">
          <el-time-picker
            v-model="value2"
            placeholder="起始时间">
          </el-time-picker>
        </div>
        <span class="to">至</span>
        <div class="end">
          <el-time-picker
            v-model="value3"
            placeholder="结束时间">
          </el-time-picker>
        </div>
        <div class="sel">
          <el-radio-group v-model="radio3">
            <el-radio-button :label="city" v-for="city in cities">{{city}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="period">
        <div class="min">
          <el-time-select
            v-model="value1"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"
            placeholder="间隔时间">
          </el-time-select>
          <span>分钟</span>
          <el-radio-group v-model="min" class="min-sel">
            <el-radio-button :label="min" v-for="min in mins">{{min}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="sec">
          <el-time-select
            v-model="value4"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"
            placeholder="持续时间">
          </el-time-select>
          <span>秒</span>
          <el-radio-group v-model="sec" class="sec-sel">
            <el-radio-button :label="sec" v-for="sec in secs">{{sec}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="right">
      <el-radio-group v-model="week">
        <el-radio-button :label="week" v-for="week in weeks">{{week}}</el-radio-button>
      </el-radio-group>
      <el-button class="btn">设置</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'set',
    data () {
      return {
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        radio3: '7:00',
        cities: ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00'],
        week: '星期一',
        weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        mins: ['5', '10', '20', '30', '40', '50', '60', '120', '240', '360', '半天', '一天'],
        secs: ['60', '120', '180', '240', '300', '360', '420', '1小时', '3小时', '6小时', '半天', '一天'],
        sec: '',
        min: ''
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
    padding-left: 50px;

  }

  .title {
    margin-top: 50px;
    margin-bottom: 50px;
    font-size: 18px;
  }

  .title span {
    width: 10px;
    height: 15px;
    display: inline-block;
    background-color: #c49c6e;
    margin-right: 15px;

  }

  .start, .end {
    display: inline-block;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 360px;
  }

  .sel {
    margin-top: 30px;
    width: 96%;
  }

  .to {
    display: inline-block;
    margin: 0 30px;
  }

  .left {
    float: left;
    width: 90%;
  }

  .right {
    width: 10%;
    float: right;
    margin-right: -3px;
  }

  .btn {
    width: 96px;
    height: 58px;
    border-radius: 0;
    background-color: #151515;
    color: #c49c6e;
    border-color: #151515;
    font-size: 16px;
  }

  .min, .sec {
    width: 45%;
    float: left;
    position: relative;

  }
  .period{
    margin-top: 60px;
  }
  .min{
    margin-right: 50px;
  }
  .min-sel, .sec-sel{
    margin-top: 30px;
  }

  .min span, .sec span{
    position: absolute;
    right: 40px;
    font-size: 14px;
    color: #c49c6e;
    top: 10px;
  }
</style>
