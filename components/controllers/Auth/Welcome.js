import React from 'react';
import {View, AsyncStorage} from 'react-native';
import {StackActions , NavigationActions} from 'react-navigation';
import WelcomeView from '../../Views/Auth/WelcomeScreen';

export default class Welcome extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            isLogin : true
        }

        this._checkLoginStatus();
    }

    _checkLoginStatus = async () => {
        try {
            const val = await AsyncStorage.getItem('userId');
            if(val !== null){
                const navigateAction = StackActions.reset({
                    index: 0,
                    key: null,
                    actions: [NavigationActions.navigate({
                        routeName: 'General'
                    })]
                });
                this.props.navigation.dispatch(navigateAction);
            }else{
                this.setState({
                    isLogin : false
                })
            }
        }catch(err) {
            console.log('error');
        }
    }

    render(){
        if(!this.state.isLogin){
            return (
                <WelcomeView navigation={this.props.navigation} />
            )
        }else{
            return (<View></View>)
        }
    }
}