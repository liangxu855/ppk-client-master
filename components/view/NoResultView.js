import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    View
} from 'react-native';

export default class NoResultView extends Component {
    componentWillUnmount() {
		console.log("NoResultView will unmount");
	}
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.props.func(null)}>
                    <Image source={require('../../img/no_order.png')} style={styles.refreshBg}></Image>
                </TouchableOpacity>
                <Text style={styles.textNoOrder}>{this.props.title}</Text>
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        alignItems: 'center'
    },

    refreshBg: {
        marginTop: 15,
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center'
    },

    textNoOrder: {
        marginTop: 15,
        color: '#999',
        fontSize: 14,
        justifyContent: 'center'
    }
});