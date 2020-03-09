import React from 'react';
import {View , Text , StyleSheet , Dimensions, Image, AsyncStorage} from 'react-native';
import { ScrollView, TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyle from '../../assets/css/global';
import ReadComicLayout from '../../Views/Others/ReadComicLayout';
import {mobileApi} from '../../systems/config';
import LoadingIndicator from '../../Views/components/LoadingIndicator';
import { Database } from '../../systems/database';

export default class ReadComic extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width : Dimensions.get('window').width,
            data : null,
            activeIndex : null,
            prevIndex : null,
            nextIndex : null,
            eps : props.navigation.state.params.eps,
            title: props.navigation.state.params.title
        }

        this._saveHistory = this._saveHistory.bind(this);
        this._saveRealHistory = this._saveRealHistory.bind(this);
        this._saveReaded = this._saveReaded.bind(this);

        this.method = {
            changePage : this._changePage.bind(this)
        }


    }

    async _changePage(to){
        const chapter = this.props.navigation.state.params.chapters.slice().reverse()

        this.setState({
            data : null
        })

        let activeIndex , prevIndex , nextIndex ;

        if(to == 'next'){
            activeIndex = this.state.activeIndex + 1;
            prevIndex = chapter[activeIndex - 1] != undefined ? activeIndex - 1 : null;
            nextIndex = chapter[activeIndex + 1] != undefined ? nextIndex + 1 : null;

        }else{
            activeIndex = this.state.activeIndex - 1;
            prevIndex = chapter[activeIndex - 1] != undefined ? activeIndex - 1 : null;
            nextIndex = chapter[activeIndex + 1] != undefined ? nextIndex + 1 : null;
        }


        await this.setState({
            activeIndex : activeIndex,
            prevIndex : prevIndex,
            nextIndex : nextIndex,
            eps : chapter[activeIndex].chapter_number,
            title: chapter[activeIndex].title,
        });

        this._getListImage();


    }

    async componentDidMount(){
        await this._chapterHandler();
        this._getListImage();
        this._saveHistory();
        
    }

    async _saveReaded (){
        await AsyncStorage.getItem('readedId')
            .then(res => JSON.parse(res))
            .then(async res => {
                res = res !== null ? res : [];

                if(!res.includes(this.props.navigation.state.params.id)){
                    res.push(this.props.navigation.state.params.id);
                }

                await AsyncStorage.setItem('readedId', JSON.stringify(res));
                // console.log(await AsyncStorage.getItem('readedId'));
            })
    }

    async _saveRealHistory(){
        await AsyncStorage.getItem('realHistory')
            .then(res => JSON.parse(res))
            .then(async res => {
                res = res !== null ? res : [];
                let found = false;
                let index = null;

                

                res.forEach((e,i) => {
                    if(e.id == this.props.navigation.state.params.mangaId){
                        found = true;
                        index = i;
                    }
                })

                if(found){
                    res.splice(index , 1);
                    res.push({
                        id: this.props.navigation.state.params.mangaId,
                        genre: this.props.navigation.state.params.genre,
                        created_at: new Date().getTime(),
                        lastRead: this.props.navigation.state.params.eps,
                        name: this.props.navigation.state.params.name,
                        views: this.props.navigation.state.params.views,
                        image: this.props.navigation.state.params.image,
                        lastUp: this.props.navigation.state.params.lastUp,
                    });
                }else{
                    res.push({
                        id: this.props.navigation.state.params.mangaId,
                        genre: this.props.navigation.state.params.genre,
                        created_at: new Date().getTime(),
                        lastRead: this.props.navigation.state.params.eps,
                        name: this.props.navigation.state.params.name,
                        views: this.props.navigation.state.params.views,
                        image: this.props.navigation.state.params.image,
                        lastUp: this.props.navigation.state.params.lastUp,
                    });
                }
                await AsyncStorage.setItem('realHistory', JSON.stringify(res));

                
                
            })
    }

    _saveHistory = async () => {

            this._saveRealHistory();
            this._saveReaded();
        
            await AsyncStorage.getItem('history')
                .then(res => JSON.parse(res))
                .then(async res => {
                    res = res !== null ? res : [];
                    

                    if(res.length <= 4){
                        res.push({
                            id: this.props.navigation.state.params.mangaId,
                            genre: this.props.navigation.state.params.genre,
                            created_at : new Date().getTime(),
                            
                        });
                    }else{
                        res.shift().
                        res = res.push({
                            id: this.props.navigation.state.params.mangaId,
                            genre: this.props.navigation.state.params.genre,
                            created_at: new Date().getTime(),
                        })
                    }


                    await AsyncStorage.setItem('history', JSON.stringify(res));
                    
                });
            
            
    };

    async _getListImage(){

        
        await Database.GET(`read/${this.props.navigation.state.params.chapters.slice().reverse()[this.state.activeIndex].id}`)
            .then(res => {
                this.setState({
                    data : Database.data
                })
            })
            .catch(err => console.log(err))
    }

    async _chapterHandler(){
        let chapter = this.props.navigation.state.params.chapters.map(e => {
            return e.id
        }).slice().reverse();

        let activeIndex = chapter.indexOf(this.props.navigation.state.params.id);
        let prevIndex = chapter[activeIndex - 1] != undefined ? activeIndex - 1  : null ;
        let nextIndex = chapter[activeIndex + 1] != undefined ? activeIndex + 1 : null;


        await this.setState({
            activeIndex : activeIndex ,
            prevIndex : prevIndex,
            nextIndex : nextIndex
        })



    }

    render(){
        return (
            <View style={{flex : 1}}>
                {
                    this.state.data == null
                        ? <LoadingIndicator />
                        : <ReadComicLayout 
                            data={this.state.data} 
                            episode={this.state.eps} 
                            title={this.state.title} 
                            navigation={this.props.navigation.state.params.navigation} 
                            keyBack={this.props.navigation.state.params.key} 
                            next={this.state.nextIndex}
                            prev={this.state.prevIndex}
                            method={this.method}

                            />
                }
                
            </View>
            
        )
    }
}

const styles = globalStyle;