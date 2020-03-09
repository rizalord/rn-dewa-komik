import React from 'react';
import {View , Text , StyleSheet , Dimensions, Image, Modal , AsyncStorage, Slider , TouchableOpacity, ActivityIndicator , StatusBar , KeyboardAvoidingView} from 'react-native';
import { ScrollView, TouchableWithoutFeedback, TextInput, FlatList } from 'react-native-gesture-handler';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import globalStyle from '../../assets/css/global';
import FastImage from 'react-native-fast-image';
import CardComment from './../components/CardComment';


export default class DetailComicLayout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width : Dimensions.get('window').width,
            data : this.props.data,
            chapter : this.props.data.chapters.slice(),
            firstData : null,
        }

        
    }

    componentDidMount(){
        this.setState({
            firstData : this.props.data.chapters[this.props.data.totalChapter - 1]
        });

    }

    _reverseSort(){
        let data = this.state.chapter;
        data = data.reverse();
        this.setState({
            chapter : data
        })
    }

    

    

    render(){
        return (
            <View style={styles.detailComicContainer} > 
                <StatusBar hidden={false} />
                {/* Modal Comment */}
                <View style={{ ...styles.backening , height : this.props.comment.backening ? '100%' : '0%'}}></View>
                <Modal transparent visible={this.props.comment.commentView} animationType="slide" onRequestClose={() => {
                    this.props.method.setCommentState();
                }} >
                    <View style={styles.commentContainer}>
                        <View style={styles.innerComment}>
                            {/* close button */}
                            <View>
                                <View style={styles.closeComment}>
                                    <TouchableOpacity style={{  flex : 1 , justifyContent : 'center' }}  onPress={() => {
                                        this.props.method.setCommentState();
                                    }}>
                                        <MaterialIcon style={{ ...styles.closeBtn  }} name="arrow-left" />
                                    </TouchableOpacity>
                                    <Text style={{flex : 1 , textAlign: 'center' , alignSelf : 'center'}}>{this.props.comment.data.length} COMMENTS</Text>
                                    <View style={{flex : 1}} />
                                    <View/>
                                </View>
                            </View>
                            
                            {/* Comment Flatlist */}

                            {
                                this.props.commentLoading ?
                                (
                                    <View style={{
                                        flexDirection : 'row' , 
                                        justifyContent : 'center' , 
                                        alignItems : 'center',
                                        marginTop : 20
                                        }}>
                                        {/* <ActivityIndicator size="small" style={{marginRight : 15}} /> */}
                                        <Text >loading...</Text>
                                    </View>
                                )
                                :
                                    this.props.comment.data.length != 0 ?

                                    (
                                        <View style={{flex : 1}}>
                                            <FlatList 
                                                data={this.props.comment.data}
                                                renderItem={({item}) => {
                                                    return (
                                                        <CardComment item={item} />
                                                    )
                                                }}
                                            /> 

                                            <KeyboardAvoidingView style={styles.inputComment}>
                                                <TextInput 
                                                style={styles.textInputComment}
                                                multiline={true}
                                                placeholder="Add Comment..."
                                                value={this.props.comment.text}
                                                onChangeText={(text) => {this.props.method.setCommentText(text)}}
                                                />
                                                <TouchableOpacity style={styles.sendComment} onPress={() => {
                                                    this.props.method.sendComment();
                                                }}>
                                                    <MaterialIcon style={styles.iconSend} name="send" />
                                                </TouchableOpacity>
                                            </KeyboardAvoidingView>
                                        </View>
                                    ) 
                                    :
                                    ( 
                                        <View style={{flex : 1}}>
                                            <Text style={{
                                            alignSelf : 'center',
                                            marginTop : 20
                                            }}>
                                                No comment yet
                                            </Text>
                                            
                                            <View style={{ ...styles.inputComment , bottom : 0 , position : 'absolute'}}>
                                                <TextInput 
                                                style={styles.textInputComment}
                                                multiline={true}
                                                placeholder="Add Comment..."
                                                value={this.props.comment.text}
                                                onChangeText={(text) => {this.props.method.setCommentText(text)}}
                                                />
                                                <TouchableOpacity style={styles.sendComment} onPress={() => {
                                                    this.props.method.sendComment();
                                                }}>
                                                    <MaterialIcon style={styles.iconSend} name="send" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                            
                            }
                            

                            
                            
                            
                        </View>
                    </View>
                </Modal>
                {/* End modal comment */}


                {/* header */}
                <View style={styles.headerDetailComic}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack(null);
                    }}>
                        <View style={styles.backButtonContainer}>
                            <AntDesign style={styles.iconBack} name='arrowleft' />
                        </View>
                    </TouchableOpacity>

                    <View style={{ flexDirection : 'row' }}>
                        <TouchableOpacity onPress={() => {
                            this.props.method.likeFunc();
                        }}>
                            <View style={styles.backButtonContainer}>
                                {
                                    !this.props.liked ? 
                                    <AntDesign style={{...styles.iconBack }} name='hearto' />
                                    :
                                    <AntDesign style={{...styles.iconBack , color : 'red' }} name='heart' />
                                }
                                
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.method.bookmarkFunc()}>
                            <View style={styles.backButtonContainer}>
                            {
                                !this.props.bookmarked ?
                                <Icon style={styles.iconBack} name='bookmark-o' />
                                :
                                <Icon style={{ ...styles.iconBack , color : '#00203F'}} name='bookmark' />
                            }
                                
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.contentDetailComicContainer}>
                    <ScrollView>
                        <View style={{
                                            ...styles.rangkingContainer ,
                                            marginTop :  55,
                                            marginLeft : 15
                                        }}>
                                        <View style={styles.leftContainer}> 
                                            <FastImage source={{uri : this.state.data.image }} style={styles.rangkingImages} />
                                        </View>
                                        <View style={{
                                                ...styles.rightContainer ,
                                                width: Dimensions.get('window').width * 85 / 100 - 70,
                                            }}> 
                                            <Text style={styles.containerTitle}>
                                                { this.state.data.name }
                                            </Text>
                                            <View style={
                                                styles.description}>
                                                <View style={{
                                                        ...styles.descLeft , 
                                                        width: Dimensions.get('window').width - 40 - 120 ,
                                                    }}>

                                                    <Text style={styles.authorText}>
                                                        { this.state.data.author }
                                                    </Text>

                                                    <View style={styles.reactionComic}>
                                                        <View style={styles.oneReaction}>
                                                            <Octicon name="eye" style={styles.iconReaction} />
                                                            <Text style={styles.textReaction}>
                                                                { this.state.data.views }
                                                            </Text>
                                                        </View>
                                                        <View style={styles.oneReaction}>
                                                            <Icon name="bookmark" style={styles.iconReaction} />
                                                            <Text style={styles.textReaction}>
                                                                { this.state.data.bookmarked }
                                                            </Text>
                                                        </View>
                                                        <View style={styles.oneReaction}>
                                                            <Icon name="heart" style={styles.iconReaction} />
                                                            <Text style={styles.textReaction}>
                                                                { this.state.data.likes }
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <View style={{
                                                            ...styles.oneReaction ,
                                                            width : 100,
                                                         }}>
                                                            <Icon name="user" style={{ ...styles.iconReaction , color : 'rgba(20,20,20,0.4)'}} />
                                                            <Text style={{ ...styles.textReaction , color : 'rgba(20,20,20,0.4)' }}>{this.state.data.commentTotal} reviews</Text>
                                                        </View>
                                                    
                                                </View>
                                            </View>
                                        </View>

                                    </View>

                                    {/* Summary */}

                                    <View style={styles.summaryContainer}>
                                        <Text style={{ ...styles.subHeader , marginLeft : 20 , fontSize: 18 }}>Summary</Text>
                                                        
                                        <View style={styles.sinopsis}>
                                            <ScrollView showsVerticalScrollIndicator={false}>
                                                <Text style={styles.textSinopsis}>
                                                    { this.state.data.summary }
                                                </Text>
                                            </ScrollView>

                                            
                                        </View>

                                        {/* Genre */}

                                        <FlatList 
                                            data={this.state.data.genres}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item , index) => item}
                                            renderItem={({item , index}) => {
                                                return (
                                                    <TouchableOpacity activeOpacity={0.8} style={{marginLeft : index == 0 ? 15 : 0}} onPress={() => {
                                                        this.props.navigation.navigate('Other', {}, NavigationActions.navigate({
                                                            routeName: 'Genres',
                                                            params: {
                                                                inject: true,
                                                                dataGenre: item
                                                            }
                                                        }))
                                                    }}>
                                                        <View style={styles.genreSummary}>
                                                            <Text style={styles.genreTextSummary}>{item}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                    </View>
                                    
                                    {/* Episodes */}
                                    <View style={styles.episodeContainer}>
                                        <Text style={styles.episodeText}>Episodes - { this.state.data.totalChapter }</Text>
                                        
                                        <TouchableOpacity onPress={() => {this._reverseSort()}}>
                                            <View style={styles.sortCommand}>
                                                <Text style={styles.sortText}>Sort</Text>
                                                <MaterialIcon style={styles.sortIcon} name='swap-vertical' />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <FlatList 
                                        data={this.state.chapter}
                                        keyExtractor={(item , index) => item.id.toString()}
                                        renderItem={({item , index}) => {
                                            return (
                                                <TouchableOpacity activeOpacity={0.7} onPress={() => {

                                                    this.props.navigation.navigate('ReadComic' , {
                                                        id : item.id,
                                                        eps : item.chapter_number,
                                                        title : item.title,
                                                        navigation : this.props.navigation,
                                                        key : this.props.navigation.state.key,
                                                        mangaTitle: this.state.data.name,
                                                        mangaId : this.state.data.id_manga,
                                                        genre : this.state.data.genres[0],
                                                        name: this.state.data.name,
                                                        views: this.state.data.views,
                                                        image: this.state.data.image,
                                                        lastUp: this.state.data.chapters[0].chapter_number,
                                                        chapters: this.state.data.chapters

                                                    });

                                                    this.props.method.setReaded(item.id);
                                                }}>
                                                    
                                                    <View style={{ ...styles.listEpisodeContainer , marginBottom : index == this.state.data.totalChapter - 1 ? 55 : 0 ,  }}>
                                                        {
                                                            this.props.readedId.includes(item.id) ?
                                                            <View style={{top : 0 , bottom : 0 , left : 0 , right : 0 , position : 'absolute' , backgroundColor : 'rgba(150,150,150,0.1)' , zIndex : 3}}></View>
                                                            : null
                                                        } 
                                                        
                                                        <View style={styles.leftList}>
                                                            <View style={styles.leftListImg} >
                                                                <FastImage style={styles.imgLeftList} source={{uri : item.image}} />
                                                            </View>
                                                            <View style={styles.leftListRightContent} >
                                                                <Text style={styles.episodes}>Episode {item.chapter_number}</Text>
                                                                <Text style={{ ...styles.episodeTitle , color : this.props.readedId.includes(item.id) ? 'rgba(10,10,10,0.5)' : 'black'}}>{ item.title }</Text>
                                                            </View>
                                                        </View>

                                                        <View style={styles.rightList}>
                                                            <MaterialIcon style={styles.iconRightEpisode} name="chevron-right" />
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                    
                    </ScrollView>
                </View>

                {/* Read 1s Eps */}

                {
                    this.state.firstData != null ?
                        (
                <View style={{
                        backgroundColor : 'white' , 
                        borderTopWidth : 0.5,
                        borderTopColor : 'rgba(0,0,0,0.1)',
                        width : '100%' , 
                        height : 55 , 
                        position : 'absolute' , 
                        bottom : 0,
                        justifyContent : 'center',
                        alignItems : 'center',
                        flexDirection : 'row-reverse'
                    }}>
                    <View style={{ 
                            ...styles.readContainer , 
                            justifyContent : 'center' , 
                            alignItems: 'center',
                            width : Dimensions.get('window').width * 75 / 100
                        }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            
                            this.props.navigation.navigate('ReadComic', {
                                id: this.state.firstData.id,
                                mangaId: this.state.data.id_manga,
                                name : this.state.data.name,
                                views : this.state.data.views,
                                eps: this.state.firstData.chapter_number,
                                title: this.state.firstData.title,
                                navigation: this.props.navigation,
                                key: this.props.navigation.state.key,
                                image: this.state.data.image,
                                lastUp: this.state.data.chapters[0].chapter_number
                            });

                            this.props.method.setReaded(this.state.firstData.id);
                        }}>
                            <View style={styles.readFirst}>
                                <Text style={styles.textFirst}>Read 1st Ep.</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* Comment Button */}
                    <TouchableOpacity onPress={
                        () => {
                            this.props.method.setCommentState()
                        }   
                    }>
                        <View style={{
                            width : 40,
                            height : 40,
                            marginRight : 10,
                            justifyContent : 'center',
                            alignItems : 'center'
                        }}>
                            <MaterialIcon style={{
                                fontSize : 25,
                                color : 'rgba(25,25,25,0.5)'
                            }} name="comment-outline" />
                            {/* <Text style={{
                                fontSize : 8
                            }}>Comment</Text> */}
                        </View>
                    </TouchableOpacity>
                </View> ) : (<View></View>)
                }

                    

                
            </View>
        )
    }
}

const styles = globalStyle;