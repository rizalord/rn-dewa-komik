import React from 'react';
import {View , Text , StyleSheet , Dimensions, Image , FlatList} from 'react-native';
import { ScrollView, TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import globalStyle from '../../assets/css/global';
import FastImage from 'react-native-fast-image';



export default class HistoryScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width : Dimensions.get('window').width,
            data : `I'am the Sorcerer King`,
            length : [
                                {key : 1},
                                {key : 2},
                                {key : 3},
                                {key : 4},
                                {key : 5},
                                {key : 6},
                                {key : 7},
                                {key : 8},
                                {key : 9},
                                {key : 10},
                                {key : 11},
                                {key : 12},
                            ]
        }
        
    }

    


    render(){
        return (
            <View style={{ flex : 1 }}>
                {/* <View style={styles.headerBookmark}>
                    <Text style={styles.headerTitle}>Bookmark</Text>    
                </View> */}


                <View style={{...styles.comicList , flex : 1  , paddingHorizontal : 0 , alignSelf : 'center' , marginTop : 0}}>
                    <View style={{ ...styles.scheduleContainer , flexWrap : 'nowrap' , flex : 1}}>

                        <FlatList 
                            style={{
                                flexDirection : 'column',
                                flexGrow : 1,
                            }}
                            showsVerticalScrollIndicator={false}
                            data={this.props.data}
                            keyExtractor={ (item , index)  => item.id}
                            renderItem={({item , index}) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                        this.props.navigation.navigate('DetailComic', {
                                            mangaId: item.id
                                        });
                                    }}>
                                        <View style={{
                                                ...styles.rangkingContainer ,
                                                marginTop : index == 0 ? 15 : 0,
                                                marginLeft : 15
                                            }}>
                                            <View style={styles.leftContainer}> 
                                                <FastImage source={{uri : item.image}} style={styles.rangkingImages} />
                                            </View>
                                            <View style={{
                                                    ...styles.rightContainer ,
                                                    width: Dimensions.get('window').width * 85 / 100 - 70,
                                                }}> 
                                                <Text style={styles.containerTitle}>{item.name}</Text>
                                                <View style={
                                                    styles.description}>
                                                    <View style={{
                                                            ...styles.descLeft , 
                                                            width: Dimensions.get('window').width - 40 - 120 ,
                                                        }}>
                                                        <Text style={styles.totalChapter}>Terakhir dibaca ep {item.lastRead}</Text>
                                                        <Text style={styles.totalChapter}>Update Ep ke {item.lastUp}</Text>
                                                        <View style={styles.totalView}>
                                                            <Octicon name="eye" style={styles.iconView} />
                                                            <Text style={styles.textView}>{item.views}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                         /> 

                        

                        
                        

                    </View>
                </View>
            </View>   
            
        )
    }
}

const styles = globalStyle;