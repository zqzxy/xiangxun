/**
 * Created by admin on 2018/8/23.
 */
export const mixin = {
  data(){
    return{}
  },
  methods:{
    //无参，返回当前时间 字符串,
    // 含参，返回时间字符串
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
    //补0
    formatDate(val){
      return (val >= 0 && val <= 9)?("0"+val):val;
    },
    //将日期字符串格式转换为日期格式
    filterStringToDate(val){
      let timeDate = new Date();let times = val.split(/\s|\-|\:/);
      timeDate.setFullYear(times[0],times[1]-1,times[2]);
      timeDate.setHours(times[3],times[4],times[5]);
      return timeDate;
    },
    getPreData(n){
      let now=new Date();
      now.setDate(now.getDate()+n);
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let hour = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      return now.getFullYear() + '-' + this.formatDate(month) + '-' + this.formatDate(day)
        + " " + this.formatDate(hour) + ":" + this.formatDate(minutes) + ":" + this.formatDate(seconds);
    },
  }
};
