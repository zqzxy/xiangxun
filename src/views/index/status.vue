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
        :disabled="flag"
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
  import Aes from '@/utils/aes.js'
  import {mixin} from '@/utils/mixin.js'
  export default {
    name: 'status',
    data () {
      return {
        img: require('../../assets/turn.png'),
        value: false,
        img1: require('../../assets/on.png'),
        img2: require('../../assets/off.png'),
        flag: false,

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
    mounted(){
        this.initWebSocket();

        let _this = this;
        setInterval(function () {
          _this.initWebSocket();
        },1000)
    },

    created(){
      this.time();
      this.token = Aes.decrypt(localStorage.getItem('token'));
      this.key = Aes.decrypt(localStorage.getItem('key'));
      console.log(this.token)
    },
    methods: {

      change () {
        console.log(this.value)
        let v = this.value == false? '0':'1';
        let arr = [{'channel':'0', 'value': v}];
        let date = this.getNowFormatDate();
        let enReqData = Aes.encrypt('{"userID":"' + localStorage.userID + '","devType":"2","comNumID":"66","devID":"' + localStorage.devID + '","array":' + JSON.stringify(arr)+ '}',this.key);
        console.log(JSON.parse('{"userID":"' + localStorage.userID + '","devType":"2","comNumID":"66","array":' + JSON.stringify(arr)+ '}',this.key));
        let agentData = '{"notify":{"type":"104","token":"' + this.token + '", "data":"' + enReqData + '","time":"' + date + '"}}';

        this.readyToSend(agentData);

      },

      //每隔一定时间发送数据
      time() {
        console.log(new Date().getSeconds());
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
        console.log(this.token)
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

          console.log(this.websock.readyState);
        } catch (err) {

          console.log(this.websock.readyState);
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
        console.log("返回数据",e.data);
        let redata = JSON.parse(e.data);
        console.log(redata)
        if (typeof (redata.notify.ErrorCode) === 'undefined') {

          let deResData = Aes.decrypt(redata.notify.data, this.key); //解密
          console.log(JSON.parse(deResData))
          let arr = JSON.parse(deResData);
          let resArr = arr.array;
          resArr.forEach((item,index)=>{
            if(item.tagName == '0d4738323134373000bc9b2c113d90cd_2_289_XXControlMode_0'){
              //自动模式 开关禁用
              console.log(this.flag)
              if(item.value == 1){
                this.flag = true;
              }else if(item.value == 0){
                this.flag = false;
              }
            }
            if(item.tagName == "0d4738323134373000bc9b2c113d90cd_2_290_XXSwitch_0"){
              if(item.value == 1){
                this.value = true;
              }else if(item.value == 0){
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
    width: 8%;
    position: absolute;
    top: 42%;
    left: 46%;
  }
</style>
