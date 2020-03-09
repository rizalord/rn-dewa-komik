import React from 'react';
import {View , StatusBar, StyleSheet , Image , Text , Dimensions , TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

export default class WelcomeView extends React.Component{
    

    render(){
        return (
            <View style={styles.container}>
            {/* <StatusBar hidden={true} /> */}
                <View style={styles.imgContainer2}>
                    <FastImage resizeMode="contain" style={styles.img} source={require('../../assets/welcome-bg.jpg')}>
                    </FastImage>
                </View>
                <View style={styles.bottomContainer}>
                    {/* <View style={styles.imgContainer}>
                        <Image style={styles.icon} source={require('../../assets/apk-icon.png')}/>
                    </View> */}
                    <View style={styles.opentext}>
                        <Text style={styles.text}>Getting Started</Text>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity onPress={() => {this.props.navigation.navigate('Register')}} activeOpacity={0.7} style={styles.signInBtn}>
                                <Text style={styles.signInTxt}>Get Started</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.props.navigation.navigate('Login')}} activeOpacity={0.7} style={styles.signUpBtn}>
                                <Text style={styles.signUpTxt}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor : 'white'
    },
    img : {
        backgroundColor : 'white',
        width : '90%',
        height : '100%',
        opacity : 1
    },
    icon : {
        width : 100,
        height : 100,
        borderRadius : 15,
    },
    imgContainer2 : {
        width: '100%',
        height: '65%',
        justifyContent : 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imgContainer : {
        borderRadius: 15,
        width : 100,
        height : 100,
        backgroundColor: 'rgba(255,255,255,0)',
        elevation: 7,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 15 },
        shadowOpacity: 1,
        shadowRadius: 2,
        marginTop: -50,
    },
    bottomContainer : {
        position : 'relative',
        alignItems : 'center',
        height : '35%'
    },
    opentext : {
        paddingHorizontal: 25,
        alignItems: 'center',
        paddingTop: 25,
        width : '100%',
        position : 'absolute',
        top : 0,
        height : '100%',
    },
    text : {
        fontSize : 24,
        fontWeight: 'bold',
        marginTop: 15,
        textAlign : 'center',
        fontFamily: 'Arial , sans-serif',
        color: '#270170',
    },
    btnContainer : {
        width : '100%',
        marginTop: 5,
        height : '50%',
        padding : 10,
        flexDirection: 'column',
        justifyContent : 'center',
        alignItems: 'center',
        position : 'absolute',
        bottom : 20
    },
    signInBtn : {
        height : 40,
        backgroundColor: 'orange',
        width : '100%',
        justifyContent : 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 50,
        borderColor: 'orange',
        borderWidth: 1
    },
    signUpBtn : {
        height : 40,
        backgroundColor: 'white',
        width : '100%',
        justifyContent : 'center',
        alignItems: 'center',
        marginBottom:  30,
        borderRadius: 50,
        borderColor: 'orange',
        borderWidth : 1
    },
    signUpTxt : {
        color: 'orange',
        fontSize : 16
    },
    signInTxt : {
        fontSize: 16,
        color : 'white'
    }



});