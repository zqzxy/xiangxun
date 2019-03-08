<template>
  <div>
    <div class="con">
      <div class="left">
        <div class="title1">
          <span class="spans"></span>智能设置
        </div>
        <div class="time">
          <div class="right">
            <el-radio-group v-model="week" @change="changeWeek()">
              <el-radio-button :label="week" v-for="week in weeks">{{week}}</el-radio-button>
            </el-radio-group>
            <el-button class="btn" @click="set_data()">设置</el-button>
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
              <el-checkbox-button v-for="time in times" :label="time" :key="time" @change="test()">{{time}}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <!--间隔时间-->
        <div class="period">
          <div class="min">
            <el-input v-if="min !== ''" v-model="min" style="width: 97%" @focus="min = ''"></el-input>
            <el-time-picker
              v-else
              v-model="min1"
              format="HH:mm"
              @change="setPeriod"
              placeholder="间隔时间">
            </el-time-picker>
            <span>分钟</span>
            <el-radio-group v-model="min" class="min-sel" @change="setMin">
              <el-radio-button :label="min" v-for="min in mins">{{min}}</el-radio-button>
            </el-radio-group>
          </div>
          <!--持续时间-->
          <div class="sec">
            <el-input v-if="sec !== ''" v-model="sec" style="width: 97%" @focus="sec = ''"></el-input>
            <el-time-picker
              v-else
              v-model="sec1"
              format="mm:ss"
              @change="setLong"
              placeholder="持续时间">
            </el-time-picker>
            <span>秒</span>
            <el-radio-group v-model="sec" class="sec-sel" @change="set_sec">
              <el-radio-button :label="sec" v-for="sec in secs">{{sec}}</el-radio-button>
            </el-radio-group>
          </div>

          <p style="overflow: hidden; clear: both; float: left">
            <span class="spans"></span><span style="margin-right: 20px">控制模式</span>
            <template>
              <el-radio-group v-model="radio" @change="change()">
                <el-radio label="0">手动模式</el-radio>
                <el-radio label="1">自动模式</el-radio>
              </el-radio-group>
            </template>
          </p>
          <div class="warn" v-if="warn_flag == true">
            <div class="breatheDiv">

            </div>
            <span>液位过低</span>
          </div>


          <el-button :disabled="clearFlag" round type="info" style="float: right; margin-top: 10px" @click="clear()">清除警报</el-button>
        </div>
      </div>
    </div>
    <div class="con1">
      <div class="title"><span></span>开关状态</div>
      <div class="img">
        <img :src="img" alt="" class="big-on">
        <img v-if="value == true" :src="img1" alt="" class="on">
        <img v-else :src="img2" alt="" class="on">
      </div>
      <div class="turn">
        <el-switch
          :disabled="flag"
          v-model="value"
          active-color="#c49c6e"
          inactive-color="#151515"
          active-text="关"
          inactive-text="开"
          @change="change2()">
        </el-switch>
      </div>
    </div>
  </div>

</template>

<script>
  import Aes from '@/utils/aes.js'
  import {mixin} from '@/utils/mixin.js'
  export default {
    name: 'set',
    data () {
      return {
        img: require('../../assets/turn.png'),
        value: false,
        img1: require('../../assets/on.png'),
        img2: require('../../assets/off.png'),
        flag: false,

        clearFlag: '',
        times: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        week: '星期一',
        weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        mins: ['5', '10', '20', '30', '40', '50', '60', '120', '240', '360', '半天', '一天'],
        secs: ['60', '120', '180', '240', '300', '360', '420', '480', '500', '600', '半小时', '1小时'],
        sec: '',
        sec1: '',
        min: '',
        min1: '',
        s_time: '07:00',
        e_time: '',
        checked_time: [],
        radio: '',
        warn_flag: false,
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
        devID: '',

        realtimeLoading: true,
        loadings: [],//可控按钮或数值loading
        loopFlag: true,//轮询，true，继续轮询，false，停止轮询
        websock: null,
        userID: "",//用户id
        token: "",//token
        key: "",
        arr1: [],//变量列表
        varIdArr: [],//变量Id  列表
        variableList: [],//最终数据表
        curData: [],//指令操作数据
        curIndex: -1,//指令下标
        totalTurns: 0,//总轮次
        curTurn: 0,//当前轮次,
        information: '',

        flagName: '',
        //zq
        outerVisible: false,
        innerVisible: false,
        labelPosition: 'left',
        iconSelected: 'el-icon-info',
        form: {
          name: '',
          icon: 'el-icon-info',
          id: ''
        },
        icons: ['el-icon-info', 'el-icon-setting', 'el-icon-bell', 'el-icon-service', 'el-icon-view', 'el-icon-location-outline', 'el-icon-refresh', 'el-icon-phone-outline', 'el-icon-service', 'fa fa-thermometer-empty', 'fa fa-calendar-o', 'fa fa-bug', 'fa fa-file-o', 'fa fa-th-large', 'fa fa-tags', 'fa fa-life-ring', 'fa fa-bookmark-o', 'fa fa-cogs', 'fa fa-cube', 'fa fa-clone', 'fa fa-random', 'fa fa-map-o'],
        valueVisible: false,
        changeForm: {},
        changeIndex: 0,
        changeValue: '',
        formIndex: 0,
        displayMode: 0,
        addFav: [],
      }
    },
    created(){
      this.time();
      this.token = Aes.decrypt(localStorage.getItem('token'));
      this.key = Aes.decrypt(localStorage.getItem('key'));
      //console.log(this.token)
    },
    mounted () {
      this.getDevice();


    },

    methods: {
      change2 () {
        console.log('开关状态',this.value)
        let v = this.value == false? '0':'1';
        let arr = [{'channel':'0', 'value': v}];
        let date = this.getNowFormatDate();
        let enReqData = Aes.encrypt('{"userID":"' + localStorage.userID + '","devType":"2","comNumID":"66","devID":"' + localStorage.devID + '","array":' + JSON.stringify(arr)+ '}',this.key);
        //console.log(JSON.parse('{"userID":"' + localStorage.userID + '","devType":"2","comNumID":"66","array":' + JSON.stringify(arr)+ '}',this.key));
        let agentData = '{"notify":{"type":"104","token":"' + this.token + '", "data":"' + enReqData + '","time":"' + date + '"}}';
        this.readyToSend(agentData);
      },

      getDevice(){
        let _this = this;
        _this.$axios.get('/iotcp/xiangxun/list').then((res) => {
          //console.log(res)
          _this.devID = res.data.result[0].devID;
          localStorage.setItem('devID',res.data.result[0].devID)
          //console.log(_this.devID)
          _this.initWebSocket();
          _this.initTime()
        })
      },
      initTime(){
        this.$axios({
          method: 'get',
          url: 'iotcp/xiangxun/overview',
          params: {
            devID: this.devID,
          }
        }).then((res) => {

          let data = res.data.result
          this.radio = data.controlModel;//模式
          this.min = data.intervalTime;//间隔时间 分钟
          this.sec = data.periodTime;//持续时间 秒

          //week
          let week_day = data.list;
          week_day.forEach((v,i) => {
            switch (v.weekDay) {
              case '1':
                this.mon.push(v.array[0]);
                break;
              case '2':
                this.tue.push(v.array[0]);
                break;
              case '3':
                this.wed.push(v.array[0]);
                break;
              case '4':
                this.thu.push(v.array[0]);
                break;
              case '5':
                this.fri.push(v.array[0]);
                break;
              case '6':
                this.sat.push(v.array[0]);
                break;
              case '7':
                this.sun.push(v.array[0]);
                break;

            }
          })

          this.get_week()//當前星期
        })
      },
      resetWeek(){

        this.$axios({
          method: 'get',
          url: 'iotcp/xiangxun/overview',
          params: {
            devID: this.devID,
          }
        }).then((res) => {
          let data = res.data.result
          //week
          let week_day = data.list;
          week_day.forEach((v,i) => {
            switch (v.weekDay) {
              case '1':
                this.mon = [];
                this.mon.push(v.array[0]);
                console.log(this.mon)
                break;
              case '2':
                this.tue = [];
                this.tue.push(v.array[0]);
                break;
              case '3':
                this.wed = [];
                this.wed.push(v.array[0]);
                break;
              case '4':
                this.thu = [];
                this.thu.push(v.array[0]);
                break;
              case '5':
                this.fri = [];
                this.fri.push(v.array[0]);
                break;
              case '6':
                this.sat = [];
                this.sat.push(v.array[0]);
                break;
              case '7':
                this.sun = [];
                this.sun.push(v.array[0]);
                break;

            }
          })
        })
      },
      myTime(str1,str2){
        let arr1 = str1.split(':');
        this.s_time = new Date(2016, 9, 10, arr1[0], arr1[1]);
        let arr2 = str2.split(':');
        this.e_time = new Date(2016, 9, 10, arr2[0], arr2[1]);
      },
      changeWeek(){
        this.resetWeek();

        this.checked_time = [];
        console.log(this.week)
        switch (this.week) {
          case '星期一':

            this.myTime(this.mon[0].startTime,this.mon[0].endTime)
            break;
          case '星期二':
            this.myTime(this.tue[0].startTime,this.tue[0].endTime)
            break;
          case '星期三':
            this.myTime(this.wed[0].startTime,this.wed[0].endTime)
            break;
          case '星期四':
            this.myTime(this.thu[0].startTime,this.thu[0].endTime)
            break;
          case '星期五':
            this.myTime(this.fri[0].startTime,this.fri[0].endTime)
            break;
          case '星期六':
            this.myTime(this.sat[0].startTime,this.sat[0].endTime)
            break;
          case '星期日':
            this.myTime(this.sun[0].startTime,this.sun[0].endTime)
            break;


        }
        console.log(this.s_time,this.e_time)
      },

      get_week () {
        let str = ''
        let week = new Date().getDay()
        if (week == 0) {
          str = '星期日'
          this.myTime(this.sun[0].startTime,this.sun[0].endTime)
        } else if (week == 1) {
          str = '星期一'
          this.myTime(this.mon[0].startTime,this.mon[0].endTime)
        } else if (week == 2) {
          str = '星期二'
          this.myTime(this.tue[0].startTime,this.tue[0].endTime)
        } else if (week == 3) {
          str = '星期三'
          this.myTime(this.wed[0].startTime,this.wed[0].endTime)
        } else if (week == 4) {
          str = '星期四'
          this.myTime(this.thu[0].startTime,this.thu[0].endTime)
        } else if (week == 5) {
          str = '星期五'
          this.myTime(this.fri[0].startTime,this.fri[0].endTime)
        } else if (week == 6) {
          str = '星期六'
          this.myTime(this.sat[0].startTime,this.sat[0].endTime)
        }
        this.week = str
        return (str)
      },

      test () {
        console.log(this.checked_time)
        let str1 = this.checked_time[0]
        let arr1 = str1.split(':')
        console.log(arr1)
        this.s_time = new Date(2016, 9, 10, arr1[0], arr1[1])

        let str2 = this.checked_time[1]
        let arr2 = str2.split(':')
        console.log(arr2)
        this.e_time = new Date(2016, 9, 10, arr2[0], arr2[1])

        if (this.s_time > this.e_time) {
          this.$message('结束时间不能小于开始时间')
        }
      },
      sTime () {
        console.log(this.s_time,this.e_time)
        //this.checked_time[0] = '';
        if(this.s_time > this.e_time){
          this.$message('开始时间不能大于结束时间')

        }
        this.checked_time.shift();
      },
      set_data () {
        //console.log(this.s_time,this.e_time,this.checked_time)
        let s_t = this.fomat_date(this.s_time)
        let e_t = this.fomat_date(this.e_time)
        console.log(s_t, e_t)
        let cur_w = this.week == '星期一' ? '1' : (this.week == '星期二' ? '2' : (this.week == '星期三' ? '3' : (this.week == '星期四' ? '4' : (this.week == '星期五' ? '5' : (this.week == '星期六' ? '6' : '7')))))
        this.$axios({
          method: 'get',
          url: 'iotcp/xiangxun/period',
          params: {
            startTime: s_t,
            endTime: e_t,
            week: cur_w,
            devID: this.devID,
            key: localStorage.getItem('key'),
            token: localStorage.getItem('token'),
            loginName: localStorage.getItem('loginName'),
          }
        }).then((res) => {
          if (res.data.statusCode == 1001) {
            this.$message('设置成功');
            //this.initTime();
          } else {
            this.$message('设置失败')
          }
        })
      },
      fomat_date (date) {
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        return (h + m)
      },
      fomat_date1 (date) {
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return (m + s)
      },
      clear () {
        // this.$axios({
        //   method: 'get',
        //   url: 'iotcp/xiangxun/set',
        //   params: {
        //     type: '0',
        //     value: '1',
        //     devID: this.devID,
        //     key: localStorage.getItem('key'),
        //     token: localStorage.getItem('token'),
        //     loginName: localStorage.getItem('loginName'),
        //   }
        // }).then((res) => {
        //   if (res.data.statusCode == 1001) {
        //     this.warn_flag = false
        //     this.$message('清除警报成功')
        //   } else {
        //     this.$message('设置失败')
        //   }
        // })

        //websock
        let arr = [{'channel':'0', 'value': '1'}];
        let date = this.getNowFormatDate();
        let enReqData = Aes.encrypt('{"userID":"' + localStorage.userID + '","devType":"2","comNumID":"71","devID":"' + this.devID + '","array":' + JSON.stringify(arr)+ '}',this.key);
        console.log(JSON.parse('{"userID":"' + localStorage.userID + '","devType":"2","comNumID":"71","array":' + JSON.stringify(arr)+ '}',this.key));
        let agentData = '{"notify":{"type":"104","token":"' + this.token + '", "data":"' + enReqData + '","time":"' + date + '"}}';

        this.readyToSend(agentData);
      },
      //控制模式
      change () {
        console.log(this.radio)
        //localStorage.setItem('mode',this.radio)
        if(this.radio == 1){
          this.flag = true;
        }else if(this.radio == 0){
          this.flag = false;
        }
        //websock
        let arr = [{'channel':'0', 'value': this.radio}];
        let date = this.getNowFormatDate();
        let enReqData = Aes.encrypt('{"userID":"' + localStorage.userID + '","devType":"2","comNumID":"65","devID":"' + this.devID + '","array":' + JSON.stringify(arr)+ '}',this.key);
        console.log(JSON.parse('{"userID":"' + localStorage.userID + '","devType":"2","comNumID":"65","array":' + JSON.stringify(arr)+ '}',this.key));
        let agentData = '{"notify":{"type":"104","token":"' + this.token + '", "data":"' + enReqData + '","time":"' + date + '"}}';

        this.readyToSend(agentData);
        // this.$axios({
        //   method: 'get',
        //   url: 'iotcp/xiangxun/set',
        //   params: {
        //     type: '0',
        //     value: this.radio,
        //     devID: this.devID,
        //     key: localStorage.getItem('key'),
        //     token: localStorage.getItem('token'),
        //     loginName: localStorage.getItem('loginName'),
        //   }
        // }).then((res) => {
        //   if (res.data.statusCode == 1001) {
        //     this.$message('设置成功')
        //   } else {
        //     this.$message('设置失败')
        //   }
        // })
      },

      setPeriod () {
        console.log(this.min)
        // if(this.min > 1440 || this.min < 0){
        //   this.$message('间隔时间范围为0至1440分钟')
        // }
        let min = this.fomat_date(this.min1)
        console.log(min)
        let arr = min.split(':')
        console.log(arr)
        let min1 = parseInt(arr[0] * 60) + parseInt(arr[1])
        console.log(min1)
        this.min = min1;
        this.$axios({
          method: 'get',
          url: 'iotcp/xiangxun/set',
          params: {
            type: '2',
            value: min1,
            devID: this.devID,
            key: localStorage.getItem('key'),
            token: localStorage.getItem('token'),
            loginName: localStorage.getItem('loginName'),
          }
        }).then((res) => {
          if (res.data.statusCode == 1001) {
            this.$message('设置成功')
          } else {
            this.$message('设置失败')
          }
        })
      },
      setLong () {
        let sec = this.fomat_date1(this.sec1)
        console.log(sec)
        let arr = sec.split(':')
        console.log(arr)
        let sec1 = parseInt(arr[0] * 60) + parseInt(arr[1])
        console.log(sec1)
        this.sec = sec1;
        this.$axios({
          method: 'get',
          url: 'iotcp/xiangxun/set',
          params: {
            type: '1',
            value: sec1,
            devID: this.devID,
            key: localStorage.getItem('key'),
            token: localStorage.getItem('token'),
            loginName: localStorage.getItem('loginName'),
          }
        }).then((res) => {
          if (res.data.statusCode == 1001) {
            this.$message('设置成功')
          } else {
            this.$message('设置失败')
          }
        })

      },
      setMin () {
        console.log(this.min)
        let min
        if (this.min == '半天') {
          min = 720
        } else if (this.min == '一天') {
          min = 1440
        } else {
          min = this.min
        }
        this.$axios({
          method: 'get',
          url: 'iotcp/xiangxun/set',
          params: {
            type: '2',
            value: min,
            devID: this.devID,
            key: localStorage.getItem('key'),
            token: localStorage.getItem('token'),
            loginName: localStorage.getItem('loginName'),
          }
        }).then((res) => {
          if (res.data.statusCode == 1001) {
            this.$message('设置成功')
          } else {
            this.$message('设置失败')
          }
        })
      },
      set_sec () {
        let sec;
        if (this.sec == '半小时') {
          sec = 1800
        } else if (this.sec == '1小时') {
          sec = 3600
        } else {
          sec = this.sec
        }

        this.$axios({
          method: 'get',
          url: 'iotcp/xiangxun/set',
          params: {
            type: '1',
            value: sec,
            devID: this.devID,
            key: localStorage.getItem('key'),
            token: localStorage.getItem('token'),
            loginName: localStorage.getItem('loginName'),
          }
        }).then((res) => {
          if (res.data.statusCode == 1001) {
            this.$message('设置成功')
          } else {
            this.$message('设置失败')
          }
        })
      },


      //每隔一定时间发送数据
      time() {
            //console.log(new Date().getSeconds());
        if (!this.loopFlag) return;//false_停止轮询
        else {//正在loading，延迟  递归
          if (this.realtimeLoading && this && !this._isDestroyed) {
            setTimeout(this.time, 20000);

          } else {//
            if (this.websock && this.curTurn === 0)
              this.threadPoxi();//发送消息
            if (this && !this._isDestroyed)
              setTimeout(this.time, 10000);
          }
        }

      },
      getNowFormatDate(val) {
        let date = val?val:new Date();

        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        return date.getFullYear() + '-' + this.formatDate(month) + '-' + this.formatDate(day)
          + " " + this.formatDate(hour) + ":" + this.formatDate(minutes) + ":" + this.formatDate(seconds);
      },
      formatDate(val){
        return (val >= 0 && val <= 9)?("0"+val):val;
      },
      //   websocket获取变量数据

      //准备数据发送消息
      threadPoxi() {
        //console.log(this.token)
        let arr = [{'tagName':'0d4738323134373000bc9b2c113d90cd_2_289_XXControlMode_0'},{'tagName':'0d4738323134373000bc9b2c113d90cd_2_290_XXSwitch_0'},{'tagName':'0d4738323134373000bc9b2c113d90cd_2_293_XXAlarm_0'}];
        let date = this.getNowFormatDate();
        let enReqData = Aes.encrypt('{"userID":"' + localStorage.userID + '","array":' + JSON.stringify(arr)+ '}',this.key);
        //console.log(arr);
        let agentData = '{"notify":{"type":"102","token":"' + this.token + '", "data":"' + enReqData + '","time":"' + date + '"}}';
        //console.log(this.websock.readyState);
        //console.log('agentData',agentData);
        this.readyToSend(agentData);
      },
      readyToSend(agentData) {
        if (this.websock.readyState === 1) {//连接状态中
          console.log('可以发送')
          this.websocketsend(agentData);
        } else {
          this.readyToSend(agentData);
        }
      },
      //初始化weosocket
      initWebSocket() {
        //console.log(localStorage.getItem('websocketTip'));
        let wsuri = localStorage.getItem('websocketUrl');
        try {
          this.websock = new WebSocket(wsuri);

          //console.log(this.websock.readyState);
        } catch (err) {

         // console.log(this.websock.readyState);
          console.log(err)
        }
        this.websock.onopen = this.websocketopen;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
        this.websock.onerror = this.websocketerror;
      },
      //开启连接
      websocketopen(e) {
        console.log("connection opened ");
        this.threadPoxi();
      },
      //连接失败
      websocketerror(e) {
        let _this = this;
        console.log("connection error ");
        //this.$message.error('连接失败，正在重试');
        setTimeout(() => {
          _this.initWebSocket();
        }, 10000);

      },
      //数据发送  agentData
      websocketsend(agentData) {
        console.log('啦啦啦', agentData.length);
        console.log('——发送start——', this.getNowFormatDate())
        if (this.websock.readyState === 1) {
          console.log('正在发送')
          try {
            this.websock.send(agentData);
          } catch (err) {
            // this.$message.error(err.toString());
          }
        }

      },
      //关闭连接
      websocketclose(e) {
        console.log(this.websock.readyState);
        console.log("connection closed ");
      },

      //数据接收
      websocketonmessage(e) {
        console.log('——返回end——', this.getNowFormatDate());
        //console.log(e.data)
//         const patt1 = new RegExp(/\s+/g);
//         const patt2 = new RegExp(/[\r\n]/g);
         console.log("返回数据",e.data);
         let redata = JSON.parse(e.data);
         //console.log(redata)
        if (typeof (redata.notify.ErrorCode) === 'undefined') {

          let deResData = Aes.decrypt(redata.notify.data, this.key); //解密
          console.log(JSON.parse(deResData))
          let arr = JSON.parse(deResData);
          let resArr = arr.array;
          resArr.forEach((item)=>{
            if(item.tagName == "0d4738323134373000bc9b2c113d90cd_2_289_XXControlMode_0"){
              this.radio = item.value;
              //自动模式 开关禁用
              //console.log(this.flag)
              if(item.value == 1){//自动
                this.flag = true;
              }else if(item.value == 0){//手动
                this.flag = false;
              }
            }
            if(item.tagName == "0d4738323134373000bc9b2c113d90cd_2_293_XXAlarm_0"){
              if(item.value == 1){//警报响起
                this.warn_flag = true;
              }else if(item.value == 0){//没有警报
                //清除按钮不能点击
                  this.clearFlag = true;
              }
            }


            if(item.tagName == "0d4738323134373000bc9b2c113d90cd_2_290_XXSwitch_0"){
              //开关
              if(item.value == 1){//开启
                this.value = true;
              }else if(item.value == 0){//关闭
                this.value = false;
              }

            }
          })

        } else {

          //token失效，跳转登陆页
          if (redata.notify.ErrorCode === '9003') {
            this.loopFlag = false;//停止轮询
            this.realtimeLoading = false;
            // this.$message.error('token失效！');
            this.$router.replace({name: 'login'});
          } else {
            //其他错误还是照旧轮询发消息取实时数据
            this.realtimeLoading = false;//不为true，否则轮询不发消息
            this.$forceUpdate();
            this.loadings[this.curIndex] = 1;
            this.curIndex = -1;
            if (redata.notify.ErrorCode === '9010') {
              console.log('——返回数据超时——', redata.notify.ErrorCode);
              //this.$message.error('返回数据超时！正在重新加载！');
            } else if (redata.notify.ErrorCode === '9008') {
              console.log('报文格式错误！正在重新加载！');
            }


          }
        }

      },

    },
    destroyed: function () {
      //页面销毁时关闭长连接
      console.log('destroy');
      this.loopFlag = false;//停止轮询
      if (this.websock)
        this.websock.close();//关闭连接

    },
  }
</script>

<style scoped>
  @import '../../assets/common/warn.css';

  .con {
    border: solid 1px #3b3b3b;
    height: auto;
    overflow: hidden;
    margin-top: 70px;
    color: #714f2a;
    background-color: rgba(59, 59, 59, 0.5);
    padding: 0 70px 65px;
    width: 43%;
    float: right;
    margin-right: 5%;

  }

  .title1 {
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
    width: 16%;
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

  .period {
    margin-top: 60px;
    position: relative;
  }

  .min {
    margin-right: 10%;
    margin-bottom: 10px;
  }

  .min-sel, .sec-sel {
    margin-top: 30px;
  }

  .min span, .sec span {
    position: absolute;
    right: 40px;
    font-size: 14px;
    color: #c49c6e;
    top: 10px;
  }

  .con1 {
    border: solid 1px #3b3b3b;
    height: 700px;
    margin-top: 70px;
    color: #714f2a;
    background-color: rgba(59, 59, 59, 0.5);
    margin-left: 5%;
    width: 35%;
    float: left;
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
    width: 8%;
    position: absolute;
    top: 42%;
    left: 46%;
  }

</style>
