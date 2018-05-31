import {
    ToastAndroid,
    Platform,
    NativeModules
} from 'react-native';

const { ToastiOS } = NativeModules;
const Toast = Platform.OS === 'android' ? ToastAndroid : ToastiOS;

export function show(msg, time=Toast.SHORT) {
  Toast.show(msg, time);
}

export default {
  SHORT: Toast.SHORT,
  LONG: Toast.LONG,
  show,
};
