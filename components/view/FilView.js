import React, { Component } from 'react';
import { 
  View,
  Text, 
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

export default class FilView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hilightIndex: 0,
      sortType: 0
    };
  }
	componentWillUnmount() {
		console.log("FilView will unmount");
	}
  selectSortType(index ) {
     /*排序方式：0-综合排序；1-按佣金比率升序；2-按佣金比例降序；3-按价格升序；4-按价格降序；5-按销量升序；6-按销量降序*/
    let destType = this.state.sortType;
    if (index === 0) {
      if (destType !== 0) {
        destType = 0;
      } else {
        return;
      }
    } else if (index === 1) {
      if (destType !== 2) {
        destType = 2;
      } else {
        destType = 1;
      }
    } else if (index === 2) {
      if (destType !== 4) {
        destType = 4;
      } else {
        destType = 3;
      }
    } else if (index === 3) {
      if (destType !== 6) {
        destType = 6;
      } else {
        destType = 5;
      }
    }
    this.setState({
      hilightIndex: index,
      sortType: destType
    });
    this.props.sortChangeCallback(destType);
  }

  renderItem = (index, imageEnable)=>{
    let title = "综合排序";
    let destSortType = this.state.sortType;
    let upHighlight = false;
    let downHighlight = false;
    if (index === 1) {
      title = "佣金比例";
      if (destSortType === 1) {
        upHighlight = true;
      } else if (destSortType === 2) {
        downHighlight = true;
      }
    } else if (index === 2) {
      title = "价格";
      if (destSortType === 3) {
        upHighlight = true;
      } else if (destSortType === 4) {
        downHighlight = true;
      }
    } else if (index === 3) {
      title = "销售";
      if (destSortType === 5) {
        upHighlight = true;
      } else if (destSortType === 6) {
        downHighlight = true;
      }
    }
    return (
        <TouchableOpacity onPress={()=>{this.selectSortType(index, this.state.sortType);}}>
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:"center"}}>
            <Text style={this.state.hilightIndex===index?{color:"#D12129"}:{color:"#444444"}}>{title}</Text>
            { imageEnable ?
              <View style={{marginLeft:5}}>
                <Image style={{marginBottom:2}} source={upHighlight?require('../../img/price_up_f.png'):require('../../img/price_up.png')} />
                <Image source={downHighlight?require('../../img/price_down_f.png'):require('../../img/price_down.png')}  />
              </View>
              : null
            }
          </View>
        </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderItem(0, false)}
        {this.renderItem(1, true)}
        {this.renderItem(2, true)}
        {this.renderItem(3, true)}
      </View>
    );
  }
 }
  
const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top:0,
      height: 40,
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#FFFFFF',
      borderBottomColor: '#F6F6F6', 
      borderBottomWidth: 1,
      paddingTop: 13,
    }
});
