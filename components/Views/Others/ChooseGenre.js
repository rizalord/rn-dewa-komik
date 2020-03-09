import React from 'react';
import { View, ScrollView , Text , TouchableOpacity} from 'react-native';
import globalStyle from './../../assets/css/global';
import { FlatList } from 'react-native-gesture-handler';
import {anotherGenre} from './../../systems/config';

export default class ChooseGenre extends React.Component { 
    constructor(props){
        super(props)
    }

    render(){
        return (
            
            
            <View style={styles.genreChooseContainer} >
                <View style={styles.genreBase}>
                    <FlatList 
                        style={{
                            flexDirection : 'column',
                            flexWrap : 'wrap',
                        }}
                        contentContainerStyle={{
                            justifyContent : 'space-around',
                            alignItems : 'center',
                        }}
                        columnWrapperStyle={{
                            justifyContent : 'space-around',
                            alignItems : 'center',
                        }}
                        numColumns={2}
                        data={anotherGenre}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item , index) => item}
                        renderItem={({item , index}) => {
                            return (
                                <TouchableOpacity activeOpacity={0.7} onPress={
                                    () => {
                                        this.props.navigation.navigate('SelectedGenre' , {
                                            genre : item,
                                            inject : true
                                        })
                                    }
                                }>
                                    <View style={{
                                            ...styles.listItemChoose,
                                            marginTop : index == 0 || index == 1 ? 20 : 5
                                        }}>
                                        <Text style={styles.itemStyle}>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </View>
            
            
            
        )
    }
}

const styles = globalStyle;


