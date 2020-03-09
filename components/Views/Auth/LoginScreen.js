import React , {useState} from 'react';
import {View , StyleSheet , Text , Image , Dimensions, TextInput , KeyboardAvoidingView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

const LoginView = (props) => {

    const [email , setEmail] = useState('');
    const [password, setPassword] = useState('');

    validate = (text) => {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            console.log("Email is Not Correct");
            setEmail(text);
            return false;
        } else {
            setEmail(text);
            console.log("Email is Correct");
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={{flex : 1 , width : '100%' , height : '100%'}}>
                <FastImage style={{width : '100%' , height : '100%'}} source={require('./../../assets/login-screen.png')} />
            </View>

            <KeyboardAvoidingView style={{
                width : '100%',
                height : 'auto',
                backgroundColor : 'transparent',
                padding : 20,
                position : 'absolute'
            }}>

                {/* Fullname */}

                {/* email */}

                <View style={{
                    width : '100%',
                    height : 50,
                    backgroundColor : '#373737',
                    paddingHorizontal : 17,
                    paddingVertical : 5,
                    marginBottom : 15,
                    borderRadius : 20
                }}>
                    {/* <Text style={{
                        color : 'orange',
                        fontSize : 15,
                        // backgroundColor : 'pink'
                    }}>Email</Text> */}

                    <TextInput 
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        placeholder="Email"
                        style={{
                            color: 'rgba(255,255,255,0.8)',
                            // backgroundColor : 'yellow',
                            width : '100%',
                            height : '100%',
                            paddingTop : 0,
                            paddingLeft : 0,
                            paddingBottom : 0,
                            // borderBottomColor : 'orange',
                            // borderBottomWidth : 1
                        }}
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        value={email} onChangeText={(text) => validate(text)}
                    />

                </View>



            

                <View style={{
                    width : '100%',
                    height : 50,
                    backgroundColor : '#373737',
                    paddingHorizontal : 17,
                    paddingVertical : 10,
                    marginBottom : 20,
                    borderRadius: 20
                }}>


                    <TextInput 
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        placeholder="Password"
                        style={{
                            color : 'rgba(255,255,255,0.8)',
                            // backgroundColor : 'yellow',
                            width: '100%',
                            height: '100%',
                            paddingTop: 0,
                            paddingLeft: 0,
                            paddingBottom: 0,
                            // paddingBottom : 0,
                            // borderBottomColor : 'orange',
                            // borderBottomWidth : 1
                        }}
                        secureTextEntry={true}
                        value={password} onChangeText={(text) => setPassword(text)}
                    />

                </View>


                {/* button */}

                <TouchableOpacity activeOpacity={0.8} onPress={() => {props.method.validateLogin( email , password)}}>
                    <View style={{
                        width : '100%',
                        height : 50,
                        backgroundColor : '#ffb100',
                        borderRadius : 30,
                        justifyContent : 'center',
                        alignItems : 'center'
                    }}>

                    <Text style={{color : 'white'}}>
                        Login
                    </Text>

                    </View>
                </TouchableOpacity>

                <View style={{
                    width : '100%',
                    justifyContent : 'center',
                    alignItems : 'center',
                    marginTop : 20,
                    flexDirection : 'row'
                }}>
                    <Text style={{
                        color: 'rgba(255,255,255,0.6)',
                    }}>Don't have an account?</Text>
                    <TouchableOpacity onPress={( ) => {
                        props.navigation.navigate('Register');
                    }}>
                        <Text style={{color : 'rgba(255,255,255,0.9)' , fontWeight : 'bold'}}> Register</Text>
                    </TouchableOpacity>
                </View>                    
                
            </KeyboardAvoidingView>

            
        </KeyboardAvoidingView>
      )
}
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#3d3d3d',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bg : {
        width : '100%',
        height : '100%',
    },
    layer2 : {
        position : 'absolute',
        left : 0,
        right : 0,
        top : 0,
        bottom : 0,
        justifyContent : 'center'
    },
    regscreen : {
        alignSelf : 'center',
        width : '80%',
        height : 210,
        backgroundColor : 'rgba(255,255,255,0.98)',
        marginTop: 20,
        borderRadius: 15,
        elevation : 10,
        shadowOffset : {width : 5 , height : 5},
        padding : 20,
        paddingHorizontal: 30,
        alignItems: 'center',
        marginTop: 90,

    },
    listItem : {
        width : '100%',
        height : 45,
        marginVertical: 15,
        flexDirection: 'row',
        borderBottomColor : '#7A95F9',
        borderBottomWidth : 1,
    },
    leftitem : {
        width : 45,
        height : 45,
        justifyContent : 'center',
        alignItems : 'center'
        // backgroundColor : 'salmon'
    },
    rightitem: {
        width: ( (width * 80/100) - (40 + 45) ),
        height: 45,
        // backgroundColor: 'orange'
    },
    signUpBtn2 : {
        position : 'absolute',
        bottom : -25,
        width : 120,
        height : 50,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems: 'center',
        borderRadius : 25,
        elevation : 8,
        shadowColor : 'black',
        shadowOffset: {width : 0 , height : 5},
        shadowRadius: 5,
        shadowOpacity : 1
    },
    textS : {
        color : 'blue'
    },
    already : {
        alignSelf : 'center',
        marginTop: 50,
    },
    txtAlready : {
        color : 'white',
        fontSize : 16
    }

})

export default LoginView;