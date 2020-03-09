import React from 'react';
import {View , Text, ScrollView , Dimensions , BackHandler , StyleSheet , Picker , TouchableOpacity , Image, ActivityIndicator} from 'react-native';
import globalStyle from './../../assets/css/global';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicon from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';

import { FlatList } from 'react-native-gesture-handler';
import { StackActions ,  NavigationActions } from 'react-navigation';

export default class GenreListScreen extends React.Component {
    constructor(props){
        super(props);

        this.onBackClick = this.onBackClick.bind(this)
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBackClick)
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.onBackClick)
    }

    onBackClick(){
        try{
            if (this.props.injectAnother == undefined) {
                this.props.navigation.goBack(null);
            } else {
                this.props.navigation.navigate('ChooseGenre')
            }

            return true;
        }catch(err){
            // 
        }
        
    }

    render(){
        return (
            <ScrollView style={{flex : 1 , width : Dimensions.get('window').width } } showsVerticalScrollIndicator={false} onScroll={({nativeEvent}) => {
                if(this.props.method.isCloseToBottom(nativeEvent)){
                    this.props.method.loadMore();
                }
            }}>
                {/* jumbotron */}

                {
                    this.props.genre == 'All' ? 
                    <View style={styles.jumboTron}>
                        <FastImage source={{uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS9zeikTh8eiapHw_AKunZDGAT3owq4atijh6umwO8hcG1KmypK'}} style={styles.jumboTronImage} />
                    </View>  : <View></View>
                }

                {
                    this.props.inject 
                        ? (
                            <TouchableOpacity onPress={() => {
                                if(this.props.injectAnother == undefined){
                                    this.props.navigation.goBack(null);
                                }else{
                                    this.props.navigation.navigate('ChooseGenre')
                                }
                            }} style={{position : 'absolute' , zIndex : 3 , width : 75 , height : 40}}>
                                <View style={{ ...styles.backButtonContainer , backgroundColor : 'rgba(235,235,235,1)' , borderRadius : 20 , marginLeft : 15 , flexDirection : 'row' , width : 75 , height : 40 ,  }}>
                                    <Ionicons style={{...styles.iconBack  , fontSize : 15 , color : 'rgba(80,80,80,1)'}} name='ios-arrow-back' />
                                    <Text style={{marginLeft : 5 , color : 'rgba(80,80,80,1)'}}>Back</Text>
                                </View>
                            </TouchableOpacity>
                        )
                        : null

                }
                

                            <View>
                                    <View style={{ ...styles.headerComicList , paddingHorizontal : 15 , marginHorizontal : 0 , marginTop : this.props.genre == 'All' ? 10 : 0}}>
                                        {
                                            this.props.genre == 'All' ? 
                                            <View style={styles.doubleText}>
                                                <Text style={styles.subHeader}>List </Text>
                                                <Text style={styles.onWeek}>should be read</Text>
                                            </View> : null
                                        }
                                        
                                        <Picker

                                        selectedValue={this.props.sort}
                                        style={{
                                            height: 30,
                                            width: 140,
                                            position : 'absolute',
                                            top : 6,
                                            right : 5,
                                            fontSize : 13,
                                            color : '#494949',
                                            transform: [
                                                { scaleX: 0.85 }, 
                                                { scaleY: 0.85 },
                                            ],
                                            alignItems : 'flex-end',
                                            justifyContent : 'flex-end'
                                        }}
                                        mode="dropdown"
                                        itemStyle={{
                                            fontSize : 13,
                                            color : '#494949',
                                            alignItems : 'flex-end',
                                            justifyContent: 'flex-end'
                                        }}
                                        onValueChange={(itemValue, itemIndex) => {
                                            this.props.method.sortBy(itemValue);
                                        }}>
                                            <Picker.Item label="Sort by Rating" value="likes/desc" />
                                            <Picker.Item label="A-Z" value="name/asc" />
                                            <Picker.Item label="Z-A" value="name/desc" />
                                            <Picker.Item label="Popular" value="views/desc" />
                                            <Picker.Item label="Latest Update" value="latestupdate/desc" />
                                            
                                        </Picker>
                                        
                                    </View>                        
                            </View>
                        

                {/* flatlist */}

                <FlatList 
                    data={this.props.data}
                    keyExtractor={(item , index) => item.id_manga}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item , index}) => (
                            <View style={{
                                marginTop: index == 0 && this.props.genre != 'All' ? 15 : 0
                            }}>
                                <TouchableOpacity 
                                onPress={() => {
                                    this.props.method.bookmarkFunc(item);
                                }}
                                style={{
                                    width : 40,
                                    height : 40 ,
                                    position : 'absolute' ,
                                    right : 10 ,
                                    zIndex : 3,
                                    justifyContent : 'center',
                                    alignItems : 'center',
                                    top : index == 0 && this.props.genre != 'All' ? 10 : 0
                                }}>

                                    <View style={styles.backButtonContainer}>
                                    {
                                        !this.props.bookmark.includes(item.id_manga) ?
                                        <Icon style={styles.iconBack} name='bookmark-o' />
                                        :
                                        <Icon style={{ ...styles.iconBack , color : '#ffb300'}} name='bookmark' />
                                    }
                                        
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    
                                        this.props.navigator.navigate('DetailComic', {
                                            mangaId: item.id_manga,
                                            backprop : this.props.backprop,
                                            forInject: this.props.inject
                                        });
                                    
                                }}>
                                    <View style={{
                                            ...styles.rangkingContainer ,
                                            marginTop : index == 0 && this.props.genre != 'All' ? 10 : 0,
                                            marginLeft : 15,
                                            width: (Dimensions.get('window').width * 85 / 100),
                                        }}>
                                        <View style={styles.leftContainer}> 
                                            <FastImage source={{uri : item.image }} style={styles.rangkingImages} />
                                        </View>
                                        <View style={{
                                                ...styles.rightContainer ,
                                                width: Dimensions.get('window').width * 85 / 100 - 70,
                                            }}> 
                                            <Text style={{ 
                                                ...styles.containerTitle,
                                                width: Dimensions.get('window').width * 85 / 100 - 129,
                                                }} 
                                                numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            <View style={
                                                styles.description}>
                                                <View style={{
                                                        ...styles.descLeft , 
                                                        width: Dimensions.get('window').width - 40 - 120 ,
                                                    }}>

                                                    <Text style={styles.authorText}>
                                                        {item.author}
                                                    </Text>

                                                    <View style={styles.littleSinopsis}>
                                                        <Text numberOfLines={2} style={styles.littleSummary}>
                                                            {item.summary}
                                                        </Text>
                                                    </View>

                                                    <View style={styles.reactionComic}>
                                                        <View style={styles.oneReaction}>
                                                            <Octicon name="eye" style={styles.iconReaction} />
                                                            <Text style={styles.textReaction}>
                                                                {item.views}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.oneReaction}>
                                                            <Icon name="bookmark" style={styles.iconReaction} />
                                                            <Text style={styles.textReaction}>
                                                                {item.bookmarked}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.oneReaction}>
                                                            <Icon name="heart" style={styles.iconReaction} />
                                                            <Text style={styles.textReaction}>
                                                                {item.likes}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                </View>
                                            </View>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            </View>
                    )}
                />
                                    {/* <View style={{
                                            ...styles.rangkingContainer ,
                                            marginLeft : 15,
                                            width: (Dimensions.get('window').width * 85 / 100),
                                        }}>
                                        <View style={styles.leftContainer}> 
                                            <FastImage source={{uri : 'https://komikcast.com/wp-content/uploads/2017/06/2914792-01.jpg' }} style={styles.rangkingImages} />
                                        </View>
                                        <View style={{
                                                ...styles.rightContainer ,
                                                width: Dimensions.get('window').width * 85 / 100 - 70,
                                            }}> 
                                            <Text style={styles.containerTitle}>
                                                Haikyuu
                                            </Text>
                                            <View style={
                                                styles.description}>
                                                <View style={{
                                                        ...styles.descLeft , 
                                                        width: Dimensions.get('window').width - 40 - 120 ,
                                                    }}>

                                                    <Text style={styles.authorText}>
                                                        Furudate
                                                    </Text>

                                                    <View style={styles.littleSinopsis}>
                                                        <Text numberOfLines={2} style={styles.littleSummary}>
                                                            Bercerita tentang seorang pemuda bernama Hinata Shouyou.Dia bersumpah untuk membalas kekalahannya di turnamen Bola Voli tingkat SMP oleh Kageyama Tobio, seorang pemain yang dijuluki Raja Lapangan.Namun, ketika hendak bergabung dengan Klub Bola Voli SMA Karasuno, dia menemukan bahwa ternyata Tobio juga ada di situ…
                                                        </Text>
                                                    </View>

                                                    <View style={styles.reactionComic}>
                                                        <View style={styles.oneReaction}>
                                                            <Octicon name="eye" style={styles.iconReaction} />
                                                            <Text style={styles.textReaction}>
                                                                0
                                                            </Text>
                                                        </View>
                                                        <View style={styles.oneReaction}>
                                                            <Icon name="bookmark" style={styles.iconReaction} />
                                                            <Text style={styles.textReaction}>
                                                                0
                                                            </Text>
                                                        </View>
                                                        <View style={styles.oneReaction}>
                                                            <Icon name="heart" style={styles.iconReaction} />
                                                            <Text style={styles.textReaction}>
                                                                0
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    
                                                </View>
                                            </View>
                                        </View>

                                    </View> */}
                
                {
                    this.props.loading == true 
                    ? <ActivityIndicator style={{marginBottom : 10}} size="large" color="black" />
                    : null

                }
            
            </ScrollView>
        )
    }
}

const styles = globalStyle;