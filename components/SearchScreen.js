import React, { Component } from 'react';
import { 
    View, 
    Text
} from 'react-native';
import TitleBar from './view/searchTitleBar';
import { KeyboardDismessView } from './baseComp';
import ProductList from './view/ProductList';

class SearchScreen extends Component {
    static navigationOptions = () => {
        return {
            header: null,
            tabBarVisible: false,
            // title: "搜索商品",
        };
    }
    
    componentWillUnmount() {
        console.log("SearchScreen component will unmount"); 
    }

    searchData = (text) => {
        this._listRef.onSearch(text);
    }

    render() {
        return (
        <View style={{flex:1}}>
            <TitleBar textChange={this.searchData} inputEnable cancelEnable cancelDispose={()=>{this.props.navigation.goBack();}}/>
            <KeyboardDismessView style={{flex:1}}>
                <ProductList ref={(ref)=>this._listRef=ref} navigate={this.props.navigation.navigate} filterEnable forSearch/>
            </KeyboardDismessView>
        </View>
        );
    }
}

export default SearchScreen;
