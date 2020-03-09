import React from 'react';
import {View , StyleSheet , Text , Image , Dimensions, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';

const RegisterView = (props) => {
    return (
        <View style={styles.container}>
            <Image style={styles.bg} source={require('../../assets/register-bg.png')} />
            <View style={styles.layer2}>
                <View style={styles.regscreen}>

                    <View style={styles.listItem}>
                        <View style={styles.leftitem}>
                            <Icon color={'#7698cc'} name='user'  />
                        </View>
                        <View style={styles.rightitem}>
                            <TextInput placeholder={'Full Name'}/>
                        </View>
                    </View>
                    <View style={styles.listItem}>
                        <View style={styles.leftitem} >
                            <Icon name='envelope' color={'#7698cc'}/>
                        </View>
                        <View style={styles.rightitem}>
                            <TextInput placeholder={'Email'}/>
                        </View>
                    </View>
                    <View style={styles.listItem}>
                        <View style={styles.leftitem}>
                            <Icon name='key'  color={'#7698cc'} />
                        </View>
                        <View style={styles.rightitem}>
                            <TextInput placeholder={'Password'} secureTextEntry={true} />
                        </View>
                    </View>

                    
                        <View style={styles.signUpBtn2}>
                            <TouchableOpacity>
                                <Text style={styles.textS}>SIGN UP</Text>
                            </TouchableOpacity>
                        </View>
                    



                </View>
                <View style={styles.already}>
                    <TouchableOpacity>
                        <Text style={styles.txtAlready}>Already Have an Account ?</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    )
}
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container : {
        flex: 1,
        width : '100%',
        height : '100%'
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
        height : 300,
        backgroundColor : 'rgba(255,255,255,0.98)',
        marginTop: 20,
        borderRadius: 15,
        elevation : 10,
        shadowOffset : {width : 5 , height : 5},
        padding : 20,
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

export default RegisterView;