import React, { Component, PureComponent } from 'react';
import {  
  View, 
  Text,
  Image,
  ImageBackground,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import FilView from './FilView';
import NoResultView from './NoResultView';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-spinkit';
import { goodsList,getGoodShareLink, PAGE_SIZE} from '../../network/Service';
import Toast from '../../utils/Toast';
import Utils from '../../utils/Utils';
import WeChatShare from './WeChatShare';

// Spinner types:
// 'CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 
// 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress',
// 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'

class RowComponent extends PureComponent {
  _pressRow = (event)=>{
    this.props.navigate('ProductDetail',{goodId:this.props.item.goodId});
  }

  _shareZhuan = (goodId) => {
    getGoodShareLink(goodId).then((result) => {
        if (result.status) {
            let data = {};
            data.type = 'imageUrl';
            data.imageUrl = result.entry.shareImageUrl;
            this.props.shareScreenRef.setShareData(data);
            this.props.shareScreenRef._setModalVisible(true);
        }
    }).catch((error) => {
        Toast.show(error.message, Toast.LONG);
    });
  }
  render() {
    let item = this.props.item;
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this._pressRow}>
        <View style={styles.rowContainer}>
          <FastImage source={{
                  uri: item.imageUrl || "",
                  priority: FastImage.priority.normal}}
              style={{width:110, height: 110 }}
              resizeMode={FastImage.resizeMode.contain}
          />
          <View style={{flex:1, marginLeft: 5,}}>
            <Text style={{color: 'black', fontWeight: 'bold'}} numberOfLines={2}>{item.goodName|| ""}</Text>
            <View style={{flexDirection: 'row', marginTop: 10,}}>
              <Text style={{color: '#999999', fontSize: 11}}>已拼{item.soldQuantity}件</Text>
              <Text style={{color: '#999999', fontSize: 11, paddingLeft: 10}}>现价￥{(item.nowPrice/100).toFixed(2)}</Text>
            </View>
            <ImageBackground source={require('../../img/coupon.png')} 
              style={{position:'absolute', bottom: 10, width:60, height: 20, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: '#FFFFFF', fontSize: 11}}>券 ￥{(item.couponDiscount/100).toFixed(0)}</Text>
            </ImageBackground>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={()=>this._shareZhuan(item.goodId)}>
          <View style={{width: 60, height: 110, justifyContent: 'center', alignItems: 'center',}}>
            <Image source={require('../../img/share_icon.png')}/>
            {/* <Text style={{color:'#F26D17', fontSize: 12, marginTop: 5,}} numberOfLines={1} >赚￥{12.99}</Text> */}
            <Text style={{color:'#F26D17', fontSize: 12, marginTop: 5,}} numberOfLines={1} >赚￥{(item.shareProfit/100).toFixed(2)}</Text>
          </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>);
  }
}

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class ProductList extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: "",
      header: null
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageToFetch: 1,
      loading: true,
      refreshing: false,
      nomore: true,
      navigate:this.props.navigate || null,
      // spining: !this.props.forSearch,
      sortType: 0,
      categoryId: this.props.category || 0,
      keyword: ""
    };
  }
  componentWillUnmount() {
		console.log("ProductList will unmount");
  }

  onSearch = (keyword) => {
    this._listRef.scrollToOffset(0, false);
    if (keyword.length <= 0) {
      this.setState({
        data:[],
        pageToFetch: 1,
        loading: false,
        refreshing: false,
        nomore: true,
        keyword: "",
      }); 
    } else {
      this.setState({
        data:[],
        pageToFetch: 1,
        keyword: keyword,
        loading: true,
        refreshing: true,
        nomore: true
      });
      setTimeout(()=>{
        this.getGoods();
      }, 100);
    }
  }

  getGoods() {
    console.log("~~~~~~geting goods");
    this.setState({ refreshing: true });
    setTimeout(()=>{
      goodsList(this.state.sortType, false, this.state.pageToFetch, PAGE_SIZE, this.state.categoryId, this.state.keyword)
        .then((response) => {
          this.setState({
            data: [...this.state.data, ...response.entry],
            pageToFetch: response.hasNext? this.state.pageToFetch+1:this.state.pageToFetch,
            nomore: !response.hasNext,
            // spining: false,
            refreshing: false,
            loading: false
          });
          console.log("~~~~~~geting goods finished OK");
        })
        .catch((err) => {
          Toast.show(err.message, Toast.LONG);
          this.setState({
            // spining: false,
            refreshing: false,
            loading: false
          });
          console.log("~~~~~~geting goods finished failed");
        });}, 
    50);
  }

  componentDidMount() {
    if (this.props.forSearch) {
      return;
    }
    this.getGoods();
  }

  _onEndReached = () => {
    if (this.state.nomore) {
        return;
    }

    console.log("~~~on EndReached product list");
    this.setState({loading: true, nomore: true});
    this.getGoods();
  }

  handleScroll = (event) => {
    // this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
    this.props.onScroll && this.props.onScroll(event);
  }

  onRefresh = () => {
    console.log("~~~on refreshing product list");
    //下拉刷新
    this.setState({
      data:[],
      pageToFetch:1,
      loading: true,
      refreshing: false,
      nomore: true,
    });
    // this.getData();
    this.getGoods();
  }

  sortChanged = (type) => {
    this._listRef.scrollToOffset(0, false);
    this.setState({
      sortType:type
    });
    this.onRefresh();
  }

  _renderRow = ({item}) => {
    return (
      <RowComponent item={item} navigate={this.state.navigate} shareScreenRef={this.WeChatShareScreen}/>
    );
  }


  render() {
    let footerView = this.state.nomore ? 
                          (<Text style={styles.footerBg}>已经到底了</Text>)
                          : (<Spinner style={{position:'absolute', top: 120}} type='Bounce' size={50} color='#000000' />);
    return (
      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center', backgroundColor: 'white'}}>
        {this.props.filterEnable ? <FilView sortChangeCallback={this.sortChanged} /> : null}
        <FlatList
          style={this.props.filterEnable ? {flex:1, marginTop: 50,}:{flex:1}}
          ListHeaderComponent={<View/>}
          ListFooterComponent={footerView}
          ListEmptyComponent={(<NoResultView func={()=>{}} title='抱歉，没有找到商品'/>)}
          data={this.state.data}
          keyExtractor={(item, index) => `${item.goodId}${index}`}
          renderItem={this._renderRow}
          refreshing={this.state.refreshing}
          ref={(ref)=>this._listRef = ref} 
          onEndReached={this._onEndReached }
          // onEndReachedThreshold={50}
          onScroll={this.handleScroll}
          // scrollEventThrottle={16}
          onRefresh={this.onRefresh}
          initialNumToRender={7}
          getItemLayout={(data, index) => ({length: 110, offset: 110 * index, index} )}
          // disableVirtualization
          removeClippedSubviews={!Utils.isIOS()}
        />
        {/* { this.state.spining ? <Spinner style={{position:'absolute', top: 120, alignSelf: 'center',}} isVisible={this.state.loading} type='Bounce' size={50} color='#000000' />: null} */}
      <WeChatShare shareData={this.state.shareData} ref={(ref) => { this.WeChatShareScreen = ref;}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    height: 110,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
  },
  footerBg: {
    flex:1,
    color: '#333',
    fontSize: 12,
    marginTop: 7,
    // backgroundColor: '#f5f5f5',
    padding: 10,
    textAlign: 'center'
  }
});
