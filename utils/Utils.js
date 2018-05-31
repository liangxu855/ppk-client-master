/**
 * Created by xiazifei on 21/06/2017.
 */
import storage, { KEY_TIME_INTERVAL_LTOS } from './Storage';
import {
  Platform,
  Linking
} from 'react-native';

const showLog = true;

function isIOS() {
  return Platform.OS === 'ios';
}

function log(msg) {
  if (showLog) {
      let header = 'react-native:';
      console.log(header + msg);
    }
}

let timeOffsetNativeMinusServer = 0;
function updateServerTime(offset) {
  let offsetTemp = parseInt(offset || storage.getItem(KEY_TIME_INTERVAL_LTOS));
  if (isNaN(offsetTemp)) {
    timeOffsetNativeMinusServer = 0;
  } else {
    timeOffsetNativeMinusServer = offsetTemp;
    storage.setItem(KEY_TIME_INTERVAL_LTOS, offset);
  }
}

function serverTimeSeconds() {
  return new Date().getTime() / 1000 - timeOffsetNativeMinusServer;
}

function checkMobile(mobile) {
    let re = /^1\d{10}$/;
    return re.test(mobile);
}

function makePhoneCall(number) {
  if( !number) {
    return;
  }
  let url = number + '';
  if (url.length <= 3) {
    log("Call phone, invalid number"+url);
    return;
  }
  if (url.search('tel') == -1) {
    url = 'tel:' + url;
  }
  Linking.canOpenURL(url).then( (supported) => {
    if (supported) {
      Linking.openURL(url).then(() => {}).catch((error) => console.log(error));
    } else {
      log("Call phone not supported");
    }
  }).catch( (error) => {
    log("call phone"+number+"error:"+error);
  });
}

export default {
  isIOS,
  log,
  updateServerTime,
  serverTimeSeconds,
  checkMobile,
  makePhoneCall,
};
