import React from 'react';
import { View , Text } from 'react-native';
import FastImage from 'react-native-fast-image';


export default class EmptyState extends React.Component {
    constructor(props){
        super(props);


    }

    render(){
        return (
            <View style={{
                flex : 1,
                backgroundColor : 'white',
                justifyContent : 'center',
                alignItems : 'center'
            }}>

                <FastImage 
                    style={{
                        width : '55%',
                        height : '50%'
                    }}
                    resizeMode={'contain'}
                    source={require('./../../assets/empty_state.png')}/>

                <Text style={{
                    marginTop : 0,
                    fontSize : 20,
                    color: 'orange',
                    fontWeight : 'bold'
                }}>Sorry , There is No Manga Yet</Text>

            </View>
        )
    }
}