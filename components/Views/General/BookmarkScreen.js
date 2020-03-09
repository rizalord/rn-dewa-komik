import React from 'react';
import {View , Text , StyleSheet , Dimensions, Image , FlatList} from 'react-native';
import { ScrollView, TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import globalStyle from '../../assets/css/global';
import FastImage from 'react-native-fast-image';



export default class BookmarkScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width : Dimensions.get('window').width,
            
        }
        
    }

    


    render(){
        return (
            <View style={{ flex : 1 }}>
                {/* <View style={styles.headerBookmark}>
                    <Text style={styles.headerTitle}>Bookmark</Text>    
                </View> */}


                <View style={{...styles.comicList , flex : 1  , paddingHorizontal : 10 , alignSelf : 'center' , marginTop : 0}}>
                    <View style={{ ...styles.scheduleContainer , flexWrap : 'nowrap' , flex : 1 ,}}>

                        <FlatList 
                            style={{
                                flexDirection : 'column',
                                flexGrow : 1,
                            }}
                            showsVerticalScrollIndicator={false}
                            numColumns={3}
                            data={this.props.data}
                            keyExtractor={ (item , index)  => item.id_manga}
                            renderItem={({item , index}) => {
                                    
                                return (
                                    
                                    <TouchableOpacity activeOpacity={.8} onPress={() => {
                                        this.props.navigation.navigate('DetailComic', {
                                            mangaId: item.id_manga
                                        });
                                    } }>
                                        <View style={{ 
                                            ...styles.scheduleList , 
                                            marginTop : index == 0 || index == 1 || index == 2 ? 10 : 0 ,
                                        }}>
                                            <View style={styles.scheduleShadow}>
                                                <FastImage source={{uri : item.image}} style={styles.scheduleImgs}/>
                                            </View>
                                            
                                            <Text style={styles.scheduleTitle} numberOfLines={2}>{ 
                                                item.name
                                            }</Text>
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