<template>
  <div class="con">
    <div class="left">
      <div class="title">
        <span class="spans"></span>智能设置
      </div>
      <div class="time">
        <div class="right">
          <el-radio-group v-model="week">
            <el-radio-button :label="week" v-for="week in weeks">{{week}}</el-radio-button>
          </el-radio-group>
          <el-button class="btn">设置</el-button>
        </div>
        <div class="start">
          <el-time-picker
            v-model="s_time"
            format="HH:mm"
            placeholder="起始时间">
          </el-time-picker>
        </div>
        <span class="to">至</span>
        <div class="end">
          <el-time-picker
            v-model="e_time"
            format="HH:mm"
            placeholder="结束时间">
          </el-time-picker>
        </div>
        <div class="sel">
          <el-checkbox-group
            v-model="check_time"
            :min="0"
            :max="2">
            <el-checkbox-button v-for="s_time in times" :label="s_time" :key="s_time">{{s_time}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
      <div class="period">
        <div class="min">
          <el-input v-if="min !== ''" v-model="min" style="width: 90%" @focus="min = ''"></el-input>
          <el-time-picker
            v-else
            v-model="min1"
            format="HH:mm"
            placeholder="间隔时间">
          </el-time-picker>

          <span>分钟</span>
          <el-radio-group v-model="min" class="min-sel">
            <el-radio-button :label="min" v-for="min in mins">{{min}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="sec">
          <el-input v-if="sec !== ''" v-model="sec" style="width: 90%" @focus="sec = ''"></el-input>

          <el-time-picker
            v-else
            v-model="sec1"
            format="mm:ss"
            placeholder="持续时间">
          </el-time-picker>
          <span>秒</span>
          <el-radio-group v-model="sec" class="sec-sel">
            <el-radio-button :label="sec" v-for="sec in secs">{{sec}}</el-radio-button>
          </el-radio-group>
        </div>

        <p style="overflow: hidden; clear: both; float: left">
          <span class="spans"></span><span style="margin-right: 20px">控制模式</span>
          <template>
            <el-radio v-model="radio" label="1">手动模式</el-radio>
            <el-radio v-model="radio" label="2">自动模式</el-radio>
          </template>
        </p>
        <el-button round type="info" style="float: right">清除警报</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'set',
    data () {
      return {
        times: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
        week: '星期一',
        weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        mins: ['5', '10', '20', '30', '40', '50', '60', '120', '240', '360', '半天', '一天'],
        secs: ['60', '120', '180', '240', '300', '360', '420', '1小时', '3小时', '6小时', '半天', '一天'],
        sec: '',
        sec1: '',
        min: '',
        min1: '',
        s_time: '',
        e_time: '',
        check_time: [],
        radio: '1',

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
    padding: 0 100px;

  }

  .title {
    margin-top: 55px;
    margin-bottom: 45px;
    font-size: 18px;
  }

  .spans {
    width: 10px;
    height: 15px;
    display: inline-block;
    background-color: #c49c6e;
    margin-right: 15px;

  }

  .start, .end {
    display: inline-block;
    margin-top: 20px;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 360px;
  }

  .sel {
    margin-top: 30px;
    /*width: 98%;*/
  }

  .to {
    display: inline-block;
    margin: 0 30px;
  }

  .left {
    float: left;
    /*width: 95%;*/
  }

  .right {
    /*width: 10%;*/
    /*float: right;*/
    margin-right: -3px;
  }

  .btn {
    width: 96px;
    height: 52px;
    border-radius: 0;
    background-color: #151515;
    color: #c49c6e;
    border-color: #151515;
    font-size: 16px;
    float: left;
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
    margin-right: 10%;
    margin-bottom: 10px;
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
  .el-radio-group{
    float: left;
  }
</style>
