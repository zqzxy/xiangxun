/**
 * Created by cysear on 2018/8/15.
 */
import Vue from 'vue'
import CryptoJS from 'crypto-js'
export default {//加密
  encrypt(word, keyStr){
    keyStr = keyStr ? keyStr : '123456789dnmxokw';
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.ZeroPadding});
    return encrypted.toString();
  },
  //解密
  decrypt(word, keyStr){
    keyStr = keyStr ? keyStr : '123456789dnmxokw';
    var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.ZeroPadding});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }

}
