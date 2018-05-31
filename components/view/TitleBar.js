import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Platform
} from 'react-native';

export default class TitleBar extends Component {
    componentWillUnmount() {
		console.log("TitleBar will unmount");
	}
    render() {
        return (
            <View style={[styles.container, {height: Platform.OS == 'android'?49:69}]}>
            <TouchableOpacity style={{flex:1}} onPress={()=> this.props.navigation.pop()}>
                <Text style={{width:50,fontSize:16,color:'#ffffff',marginLeft:15}}>返回</Text>
            </TouchableOpacity>
                <Text style={{fontSize:20,color:'#ffffff'}}>{this.props.title}</Text>
                <Text style={{flex:1,width:50}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-between',
    backgroundColor:'#352f29'
  }
});