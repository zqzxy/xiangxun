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
            @change="sTime()"
            placeholder="起始时间">
          </el-time-picker>
        </div>
        <span class="to">至</span>
        <div class="end">
          <el-time-picker
            v-model="e_time"
            format="HH:mm"
            @change="sTime()"
            placeholder="结束时间">
          </el-time-picker>
        </div>
        <!--复选框-->
        <div class="sel">
          <el-checkbox-group
            v-model="checked_time"
            :min="0"
            :max="2"
          >
            <el-checkbox-button v-for="time in times" :label="time" :key="time" @change="test()">{{time}}</el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
      <!--持续时间，间隔时间-->
      <div class="period">
        <div class="min">
          <el-input v-if="min !== ''" v-model="min" style="width: 97%" @focus="min = ''"></el-input>
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
          <el-input v-if="sec !== ''" v-model="sec" style="width: 97%" @focus="sec = ''"></el-input>

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
        times: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00','07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        week: '星期一',
        weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        mins: ['5', '10', '20', '30', '40', '50', '60', '120', '240', '360', '半天', '一天'],
        secs: ['60', '120', '180', '240', '300', '360', '420', '1小时', '3小时', '6小时', '半天', '一天'],
        sec: '',
        sec1: '',
        min: '',
        min1: '',
        s_time: '07:00',
        e_time: '',
        checked_time: [],
        radio: '1',


      }
    },
    methods: {
        test(){
          console.log(this.checked_time)
          let str1 = this.checked_time[0];
          let arr1 = str1.split(':');
          console.log(arr1)
          this.s_time = new Date(2016, 9, 10, arr1[0], arr1[1]);

          let str2 = this.checked_time[1];
          let arr2 = str2.split(':');
          console.log(arr2)
          this.e_time = new Date(2016, 9, 10, arr2[0], arr2[1]);


          if(this.s_time > this.e_time){
            this.$message('结束时间不能小于开始时间');
          }
        },
      sTime(){
          console.log(this.checked_time)
          //this.checked_time[0] = '';
          this.checked_time.shift()
      }
    }
  }
</script>

<style scoped>
  .con {
    border: solid 1px #3b3b3b;
    height: auto;
    overflow: hidden;
    margin-top: 70px;
    color: #714f2a;
    background-color: rgba(59, 59, 59, 0.5);
    padding: 0 100px 65px;

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
    height: 44px;
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
