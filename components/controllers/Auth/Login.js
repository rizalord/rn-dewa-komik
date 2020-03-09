import React from 'react';
import {View, ToastAndroid , AsyncStorage} from 'react-native';
import LoginView from '../../Views/Auth/LoginScreen';
import firebaseConfig , {mobileApi} from '../../systems/config';
import { StackActions ,  NavigationActions } from 'react-navigation';
import { Database } from '../../systems/database';


export default class Login extends React.Component{

    
    firebase = null;

    constructor(props){
        super(props);

        this.state = {
            email : null,
            password : null
        }

        this.method = {
            validateLogin : this._validateLogin.bind(this)
        }

        this.firebase = require("firebase/app");
        require("firebase/auth");
        require("firebase/database");

        if (!this.firebase.apps.length) {
            this.firebase.initializeApp(firebaseConfig);
        }
    }

    async isBanned(email){
            return await Database.GET(`user/isbanned/${email}`)
            .catch(err => false);
        }

    async _validateLogin(email , password){
        this.setState({
            email: email,
            password: password
        })

        
        


        if (!String(email).includes('.com')) {
            return ToastAndroid.show('Email is not valid!', ToastAndroid.SHORT);
        }

        if (String(password).length < 8) {
            return ToastAndroid.show('Password is too short!', ToastAndroid.SHORT);
        }

        // check banned or not
        if(await this.isBanned(email)){
            return ToastAndroid.show('Account already banned!', ToastAndroid.SHORT);
        }

        setTimeout(() => {
            this._signIn(email , password);
        }, 0);
    }

    _signIn = async (email , password) => {

        let errorLogin = false;
        let userCredential = null;
        await this.firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            
            errorLogin = true;
            return ToastAndroid.show(errorMessage, ToastAndroid.LONG);
            
        }).then((user) => {
            userCredential = user.user;
        });


        if(!errorLogin){
            await this._getUserData(userCredential);
            ToastAndroid.show(`Welcome ${await AsyncStorage.getItem('fullName')}`, ToastAndroid.LONG);
            this._navigateToGeneralScreen();
        }

         

    }

    async _getUserData(userCredential){
        await fetch(mobileApi + 'user/data/email/' + this.state.email)
            .then(res => res.json())
            .then(async res => {
                await this._setUserData(res , userCredential);
            })
            .catch(err => {
                console.log(err);
            })
    }

    _setUserData = async (res ,userCredential) => {
        await AsyncStorage.setItem('userId', res.fbId);
        await AsyncStorage.setItem('email', res.email);
        await AsyncStorage.setItem('profilePicture', String(res.image));
        await AsyncStorage.setItem('bookmark', JSON.stringify(res.bookmark));
        await AsyncStorage.setItem('fullName',res.name);
        await AsyncStorage.setItem('history', JSON.stringify([]));
        await AsyncStorage.setItem('liked', JSON.stringify(res.likes));
        await AsyncStorage.setItem('realHistory', JSON.stringify([]));
        await AsyncStorage.setItem('readedId', JSON.stringify([]));
        await AsyncStorage.setItem('darkMode', JSON.stringify(false));
        await AsyncStorage.setItem('userCredential', JSON.stringify(userCredential));
        await AsyncStorage.setItem('token' , String(res.api_token));
    }

    _navigateToGeneralScreen(){
        const navigateAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({
                routeName: 'General'
            })],

        });
        this.props.navigation.dispatch(navigateAction);
    }


    render(){
        return (
            <LoginView navigation={this.props.navigation} method={this.method}/>
        )
    }
}