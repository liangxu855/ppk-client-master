import React, {Component} from 'react';
import { DeviceEventEmitter } from 'react-native';
import StackApp from './components/login/NavLoginScreen';
import TabNavigator from './components/HomeTabNavigator';
import CodePush from 'react-native-code-push';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainPage: false
        };
    }
    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener("switchMain", (type)=>{
            if (type === 1 && !this.state.mainPage) {
                this.setState({
                    mainPage: true
                });
            } else if (type === 0 && this.state.mainPage) {
                this.setState({
                    mainPage: false
                });
            }
        });
    }
    
    componentWillUnmount() {
        this.listener.remove();
    }

    render() {
        let outView = null;
        if (this.state.mainPage) {
            outView = <TabNavigator />;
        } else {
            outView = <StackApp />;
        }
        return outView;
    }
}

export default CodePush({checkFrequency: CodePush.CheckFrequency.ON_APP_START})(App);
