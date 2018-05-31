
import React, { Component } from 'react';
import {  
    View,
    Image,
    StyleSheet,
    ScrollView
} from 'react-native';
import { ScreenWidth } from '../../Constants';

export default class NewScreen extends Component {
  static navigationOptions = () => {
    return {
      tabBarVisible: false,
      title: "新手攻略",
    };
  }
  componentWillUnmount() {
    console.log("NewScreen will unmount");
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image source={require('../../img/new_guide.png')} style={{marginBottom:10, width: ScreenWidth, height: ScreenWidth*3439/750}} resizeMode='cover'/>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },
});