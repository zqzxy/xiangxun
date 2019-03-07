<template>
  <div class="con">
    <div class="left">
      <div class="title">
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


        <el-button round type="info" style="float: right; margin-top: 10px" @click="clear()">清除警报</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  //import Aes from '@/utils/aes.js'
  export default {
    name: 'set',
    data () {
      return {
        times: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        week: '星期一',
        weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        mins: ['5', '10', '20', '30', '40', '50', '60', '120', '240', '360', '半天', '一天'],
        secs: ['60', '120', '180', '240', '300', '360', '420', '480', '500', '600', '半天', '一天'],
        sec: '',
        sec1: '',
        min: '',
        min1: '',
        s_time: '07:00',
        e_time: '',
        checked_time: [],
        radio: '',
        warn_flag: true,
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
        devID: ''


      }
    },

    mounted () {
      this.getDevice();


    },

    methods: {
      getDevice(){
        let _this = this;
        _this.$axios.get('/iotcp/xiangxun/list').then((res) => {
          console.log(res)
          _this.devID = res.data.result[0].devID;
          console.log(_this.devID)
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
        this.$axios({
          method: 'get',
          url: 'iotcp/xiangxun/set',
          params: {
            type: '0',
            value: '1',
            devID: this.devID,
            key: localStorage.getItem('key'),
            token: localStorage.getItem('token'),
            loginName: localStorage.getItem('loginName'),
          }
        }).then((res) => {
          if (res.data.statusCode == 1001) {
            this.warn_flag = false
            this.$message('清除警报成功')
          } else {
            this.$message('设置失败')
          }
        })
      },
      change () {
        this.$axios({
          method: 'get',
          url: 'iotcp/xiangxun/set',
          params: {
            type: '0',
            value: this.radio,
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

      setPeriod () {
        console.log(this.min)
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
        let sec
        if (this.sec == '半天') {
          sec = 43200
        } else if (this.sec == '一天') {
          sec = 86400
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

      //   websocket获取变量数据

//       //准备数据发送消息
//       threadPoxi() {
//         //debugger
//         let date = this.getNowFormatDate();
//         let enReqData = Aes.encrypt('{"userID":"' + this.userID + '","array":' + JSON.stringify(this.varIdArr.slice(50 * this.curTurn, 50 * (this.curTurn + 1))) + '}', this.key);
// //        console.log('sending'+this.varIdArr.slice(5*this.curTurn,5*(this.curTurn+1)).map(item=>{return item.tagName.split('_')[2]}));
//         let agentData = '{"notify":{"type":"122","token":"' + this.token + '", "data":"' + enReqData + '","time":"' + date + '"}}';
// //        console.log(this.websock.readyState);
// //        console.log('agentData',agentData);
//
//         this.readyToSend(agentData);
//       },
//       readyToSend(agentData) {
//         if (this.websock.readyState === 1) {//连接状态中
//           this.websocketsend(agentData);
//         } else {
//           this.readyToSend(agentData);
//         }
//       },
//       //初始化weosocket
//       initWebSocket() {
//         //debugger
// //        const wsuri = "ws://180.167.81.226:6005";
// //        const wsuri = "ws://192.168.100.15:6005";
//         //const wsuri =domain.wsUrl;
// //        const wsuri = "ws://192.168.100.128:6005";
//         console.log(localStorage.getItem('websocketTip'));
//         let wsuri = localStorage.getItem('websocketUrl');
//         try {
//           this.websock = new WebSocket(wsuri);
//
//           console.log(this.websock.readyState);
//         } catch (err) {
//
//           console.log(this.websock.readyState);
//           console.log(err)
//         }
//         this.websock.onopen = this.websocketopen;
//         this.websock.onmessage = this.websocketonmessage;
//         this.websock.onclose = this.websocketclose;
//         this.websock.onerror = this.websocketerror;
//       },
//       //开启连接
//       websocketopen(e) {
//         console.log("connection opened ");
//         this.threadPoxi();
//       },
//       //连接失败
//       websocketerror(e) {
//         let _this = this;
//         console.log("connection error ");
//         //this.$message.error('连接失败，正在重试');
//         setTimeout(() => {
//           _this.initWebSocket();
//         }, 10000);
//
//       },
//       //数据发送  agentData
//       websocketsend(agentData) {
//         console.log('啦啦啦', agentData.length);
//         console.log('——发送start——', this.getNowFormatDate())
//         if (this.websock.readyState === 1) {
//           try {
//             this.websock.send(agentData);
//           } catch (err) {
//             // this.$message.error(err.toString());
//           }
//         }
//
//       },
//       //关闭连接
//       websocketclose(e) {
//         console.log(this.websock.readyState);
//         console.log("connection closed ");
//       },
//
//       //数据接收
//       websocketonmessage(e) {
//         console.log('——返回end——', this.getNowFormatDate());
//
//         const patt1 = new RegExp(/\s+/g);
//         const patt2 = new RegExp(/[\r\n]/g);
// //          console.log("返回数据",e.data);
//         let redata = JSON.parse(e.data);
//         if (typeof (redata.notify.ErrorCode) === 'undefined') {
//
//           let deResData = Aes.decrypt(redata.notify.data, this.key); //解密
//           let tempResData = deResData.substr(0, deResData.lastIndexOf('}') + 1);//去空格
//           let varValArr = JSON.parse(tempResData);
// //          console.log('——返回end——',this.getNowFormatDate());
//           this.loadings = new Int8Array(this.varIdArr.length);
//           if (redata.notify.type === '122') {//获取变量值
//
//             this.unifyVariables(varValArr);
//           } else if (redata.notify.type === '105') {//发送指令
//             this.realtimeLoading = false;
//             if (varValArr.array[0].tagName === this.curData[0].tagName && varValArr.array[0].value === this.curData[0].value) {
//               /*this.$message.success('设置成功！');
//               this.valueVisible=false;*/
//               if (this.flag == 0) {
//                 this.variableList[this.curIndex].value = varValArr.array[0].value;
//               }
//               this.$message.success('设置成功！');
//               this.$forceUpdate();
//               this.loadings[this.curIndex] = 0;
//               this.information = this.flagName + '：' + (this.flag == 0 ? '发送控制指令成功' : (this.flag == 1 ? '修改变量数值成功' : '发送指令成功'));
//               this.saveAsLog();
//             } else {//设置返回失败，当前操作区loading
//               this.$forceUpdate();
//               this.loadings[this.curIndex] = 1;
//               //this.$message.error('设置失败！正在重新加载！');
//               this.information = this.flagName + '：' + (this.flag == 0 ? '发送控制指令失败' : (this.flag == 1 ? '修改变量数值失败' : '发送指令失败'));
//               this.saveAsLog();
//             }
//           }
//         } else {
//
//           //token失效，跳转登陆页
//           if (redata.notify.ErrorCode === '9003') {
//             this.loopFlag = false;//停止轮询
//             this.realtimeLoading = false;
//             // this.$message.error('token失效！');
//             this.$router.replace({name: 'login'});
//           } else {
//             //其他错误还是照旧轮询发消息取实时数据
//             this.realtimeLoading = false;//不为true，否则轮询不发消息
//             this.$forceUpdate();
//             this.loadings[this.curIndex] = 1;
//             this.curIndex = -1;
//             if (redata.notify.ErrorCode === '9010') {
//               console.log('——返回数据超时——', redata.notify.ErrorCode);
//               //this.$message.error('返回数据超时！正在重新加载！');
//             } else if (redata.notify.ErrorCode === '9008') {
//               console.log('报文格式错误！正在重新加载！');
//             }
//
//
//           }
//         }
//
//       },

    }
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

</style>
