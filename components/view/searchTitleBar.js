import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    TextInput,
    Platform
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class SearchTitleBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            inputEnable: this.props.inputEnable,
        };
    }
    componentWillUnmount() {
		console.log("SearchTitleBar will unmount");
	}
    _onClearText = () => {
        this.textInput.clear();
        this.props.textChange && this.props.textChange('');
        //this.setState({text: newText});
    }

    _onSearchList = () => {
        this.props.textChange && this.props.textChange(this.state.text);
    }

    onChangeText = (text) => {
        if (text && text.length > 0) {
            this.setState({text: text});
        } else {
            this.setState({text: text});
            this.props.textChange && this.props.textChange(text);
        }
    }

    render() {
        let inputPadding = Platform.OS === "android" ? 4: 0;
        return (
            <SafeAreaView style={[styles.container, {height: Platform.OS === 'android'?49:69}]}>
                <TouchableOpacity style={styles.inputContainer} activeOpacity={0.6} disabled={this.props.cancelEnable?true:false} onPress={()=>{this.props.searchDispose && this.props.searchDispose();}} >
                    <View style={styles.inputBackground}>
                        <Ionicons name={"ios-search"} size={22} color={'#999999'} style={{paddingTop:4}}/>
                        {
                            this.props.inputEnable?
                            <TextInput
                                ref={(ref) => this.textInput = ref}
                                style={{flex: 1,fontSize: 14,paddingLeft:7, paddingTop:inputPadding, color: '#000000'}}
                                multiline={false}
                                autoFocus={false}
                                placeholder={'搜索关键词或标题'}
                                placeholderTextColor={'#999999'}
                                underlineColorAndroid={'transparent'}
                                returnKeyType={'search'}
                                onSubmitEditing={this._onSearchList}
                                onChangeText={this.onChangeText}/> :
                            <Text style={{flex:1, fontSize:14, paddingLeft:7, color: '#999999'}}>搜索关键词或标题</Text>
                        }
                    </View>
                    {
                        this.props.cancelEnable?
                    <TouchableOpacity style={styles.cancelButton} onPress={()=>{this.props.cancelDispose && this.props.cancelDispose();}}>
                        <Text style={styles.cancelText}>取消</Text>
                    </TouchableOpacity> : null
                    }
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1B1B1D',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: 'center',
        height: 30,
        width: '90%',
        marginTop: 15,
    },
    cancelButton: {
        width: 50, 
        marginLeft: 10,
    },
    cancelText: {
        fontSize: 18,
        color: 'white',
    },
    inputBackground: {
        flex: 1,
        height: 30,
        paddingLeft: 25,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        overflow: 'hidden'
    },
});
