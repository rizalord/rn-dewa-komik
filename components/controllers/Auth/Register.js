import React from 'react';
import {View , ToastAndroid ,AsyncStorage} from 'react-native';
import RegisterView from '../../Views/Auth/RegisterScreen';
import firebaseConfig, { mobileApi } from '../../systems/config';
import {StackActions , NavigationActions} from 'react-navigation';
import { Database } from '../../systems/database';
// Add the Firebase products that you want to use


export default class Register extends React.Component{

    firebase =  null; 
    constructor(props) {
        super(props);

        this.method = {
            validate_register: this._validate_register
        }

        this.state = {
            name : null,
            email : null,
            password : null,
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

    _validate_register = async  (name , email , password) => {
        this.setState({
            name : name , 
            email : email.toString().trim(),
            password : password
        })

        

        // validate start here
        if(String(name).length < 7){
            return ToastAndroid.show('Name field is too short!', ToastAndroid.SHORT);
        }  

        if (!String(email).includes('.com')) {
            return ToastAndroid.show('Please input valid email!', ToastAndroid.SHORT);
        }

        if (String(password).length < 8) {
            return ToastAndroid.show('Password length is too short!', ToastAndroid.SHORT);
        }

        // check banned or not
        if(await this.isBanned(email)){
            return ToastAndroid.show('Account already banned!', ToastAndroid.SHORT);
        }

        
        
        // submit to firebase
        await this.submitRegister({
            name : name,
            email : email,
            password : password
        });

        
    }

    submitRegister = async (data) => {

        
        let errorReg = false;
        let userCredential = null;
        await this.firebase.auth().createUserWithEmailAndPassword( data.email ,data.password ).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            
            if(errorMessage) {
                ToastAndroid.show(errorMessage, ToastAndroid.LONG);
                errorReg = true;
            }
        }).then(({user}) => {
            userCredential = user;
        }) ;
        
        // Next to store function
        if(!errorReg){
            this.storeUserData(data , userCredential);
        }
        
    }

    storeUserData = async (data , userCredential) => {

        // store to firebase realtime database
        const userId = this.firebase.database().ref('users/').push().key;
        this.firebase.database().ref('users/' + userId).set({
            uid : userId,
            fullname: this.state.name,
            email: this.state.email,
            profile_picture: null,
            bookmark : []
        });

        if(await this._storeToApi(userId , data)){

            try {
                // navigate to general screen
                const navigateAction = StackActions.reset({
                    index: 0,
                    key: null,
                    actions: [NavigationActions.navigate({
                        routeName: 'General'
                    })]
                });
                await this._setUserData(userId, userCredential);
                this.props.navigation.dispatch(navigateAction);
                ToastAndroid.show(`Welcome ${this.state.name}`, ToastAndroid.LONG);
                // store to local storage
                

                
            }catch(err) {
                console.log(err);
            }

        }else{
            // store to api failed
            ToastAndroid.show('Registration Failed!' , ToastAndroid.SHORT);
        }
        
        
    }

    _storeToApi = async (userId , data ) => {
        return await fetch(mobileApi + 'user/register' , {
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                data : {
                    userId : userId ,
                    email : data.email,
                    name : data.name,
                    password : data.password
                }
            })
        })
            .then(res => res.json())
            .then(async res => {
                if(res.status == true){
                    await AsyncStorage.setItem('token' , res.token);
                    return true;
                }else{
                    return false;
                }
            })
            .catch(err => {
                console.log(err);
                return false;
            } );

    }

    _setUserData = async (uId , userCredential) => {
        
        await AsyncStorage.setItem('userId', uId);
        await AsyncStorage.setItem('email', this.state.email);
        await AsyncStorage.setItem('profilePicture', String( null ));
        await AsyncStorage.setItem('bookmark', JSON.stringify([]));
        await AsyncStorage.setItem('fullName', this.state.name);
        await AsyncStorage.setItem('history', JSON.stringify([]));
        await AsyncStorage.setItem('liked', JSON.stringify([]));
        await AsyncStorage.setItem('realHistory', JSON.stringify([]));
        await AsyncStorage.setItem('readedId', JSON.stringify([]));
        await AsyncStorage.setItem('darkMode', JSON.stringify(false));
        await AsyncStorage.setItem('userCredential', JSON.stringify(userCredential));
        
    }

    render(){
        return (
            <RegisterView navigation={this.props.navigation} method={this.method}/>
        )
    }
}