import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions
} from 'react-native';
import Toast from '../../utils/Toast';
import { ScreenWidth } from '../../Constants';
const { height, width } = Dimensions.get('window');
// import EZSwiper from 'react-native-ezswiper';
import EZSwiper from './Swiper';



/**
 * 选择分享海报
 */
export default class ChooseShareHaiBao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      transparent: false,
      index:0
    };
  }

  componentWillUnmount() {
    console.log("ChooseShareHaiBao will unmount");
  }

  renderImageRow(obj, index) {
    return (
      <View style={[styles.cell, { backgroundColor: '#00000000', overflow: 'hidden' }]}>
        <Image
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: undefined, height: undefined }}
          resizeMode={'contain'}
          source={obj} />
        {/*<Text style={{backgroundColor:'transparent',color:'white'}}>{'Victoria\'s Secre ' + index}</Text>*/}
      </View>
    )
  }


  onPressRow(obj, index) {
    // console.log('onPressRow=>obj:' + obj + ' ,index:' + index);
    // alert('onPressRow=>obj:' + obj + ' ,index:' + index);
    // this.props.shareHaiBao(obj,index);
  }

  onWillChange =(obj, index) =>{
    console.log('onWillChange=>obj:'+ obj + ' ,index:' + index);
    // alert('onWillChange=>obj:'+ obj + ' ,index:' + index);
  }

  onDidChange = (obj, index) =>{
    if(index == 0){
    console.log('onDidChange=>obj:'+ obj + ' ,index:' + index);
    }
    // alert('onDidChange=>obj:'+ obj + ' ,index:' + index);
    this.setState({
        index:index
    });
  }

  _confirmChoose = ()=>{
       this._setModalVisible(false);
      this.props.shareHaiBao(this.state.index);
  } 

  _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

  render() {
    return (
      <Modal
        visible={this.state.modalVisible}
        animationType={'slide'}
        presentationStyle={'overFullScreen'}
        transparent
        // onShow={()=>{this.setState({transparent:true});}}
        onRequestClose={() => this._setModalVisible(false)}>
        <TouchableOpacity
          style={{ flex: 1 }}
          >
          <View style={styles.modalBackground}>
            <View style={{flex:1,justifyContent: 'center', alignItems: 'center' }}>
              <EZSwiper style={[styles.swiper, { width: width, height: width * 1334 / 667 }]}
                dataSource={[require('../../img/ad_01.png'), require('../../img/ad_02.png'), require('../../img/ad_03.png')]}
                width={width}
                height={width * 1334 / 667}
                renderRow={this.renderImageRow}
                onPress={this.onPressRow}
                index={0}   
                onDidChange={this.onDidChange}
                onWillChange={this.onWillChange}
                loop={false} 
                ratio={0.75}
              />
              {/*<TouchableOpacity style={{position: 'absolute',bottom:20,height:45,paddingLeft:30,
            paddingRight:30,alignItems:'center',justifyContent: 'center', backgroundColor:'#e45d33',borderRadius:4,width:width-60}} onPress={() => this._setModalVisible(false)}>
                          <Text style={{ color: '#ffffff', fontSize: 17 }}>确定</Text>
              </TouchableOpacity>*/}
              <View style={{position: 'absolute',bottom:20,flexDirection:'row',height:45,paddingLeft:30,
            paddingRight:30,alignItems:'center',justifyContent:'space-between',flex:1}}>
                    <TouchableOpacity style={styles.cancel} onPress={()=>this._setModalVisible(false)}>
                        <Text style={{color:'#ffffff',fontSize:16}}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirm} onPress={()=>this._confirmChoose()}>
                        <Text style={{color:'#ffffff',fontSize:16}}>确定</Text>
                    </TouchableOpacity>
                    </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  swiper: {
    backgroundColor: 'white',
  },
  cell: {
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    cancel:{
        width:(ScreenWidth-68)/2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#cda967',
        height:45,
        borderRadius:4
    },
    confirm:{
        width:(ScreenWidth-68)/2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#e45d33',
        height:45,
        borderRadius:4,
        marginLeft:15
    },
});