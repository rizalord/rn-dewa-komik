import React from 'react';
import {View , Text , StatusBar ,  StyleSheet , Dimensions, Image , FlatList, AsyncStorage} from 'react-native';
import { ScrollView, TouchableWithoutFeedback, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import globalStyle from '../../assets/css/global'
import {mobileApi , genreStat} from '../../systems/config';
import FastImage from 'react-native-fast-image';
import {NavigationActions} from 'react-navigation';
import SearchTab from './../../Views/Others/SearchTab';
import { Database } from '../../systems/database';


export default class Explore extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          width: Dimensions.get('window').width,
          data_newchapter: [],
          data_popular: [],
          data_genre: [],
          data_recommend: [],
          scrollGenrePosition: 0,
          searchQuery: '',
          searchData: [],
          page: 1,
          loading: false,
          loadingAgain: true,
          totalDataSearch: 0,
          text: '',
        };

        this.method = {
            getNewChapter : this._getNewChapter.bind(this),
            getPopularData : this._getPopularData.bind(this),
            getGenrePopular : this._getGenrePopular.bind(this),
            getRecommendManga : this._getRecommendManga.bind(this),
            isCloseToBottom : this.isCloseToBottom.bind(this),
            loadMore : this._loadMore.bind(this)
        }

        this.scrollGenrePosition = 0;
        this.scrollMostPopularPosition = 0;
        this.scrollRecommendPosition = 0;
        
        this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this),
        this._genreRebuild = this._genreRebuild.bind(this);
        this._searchDatabase = this._searchDatabase.bind(this);
    }

    _searchDatabase(text) {
      this.setState(
        {
          page: 1,
          loadingAgain: true,
          text: text,
          totalDataSearch: 0,
        },
        async () => {
          if (text !== '') {
            Database.GET('search/' + text + '/' + this.state.page).then(res => {
              this.setState({
                totalDataSearch: Database.totalData,
                searchData: Database.data.data,
              });
            });
          } else {
            this.setState({
              searchData: [],
              totalDataSearch: 0,
              text: text,
            });
          }
        },
      );
    
  }

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  _loadMore() {
    this.setState({
      loading : this.state.loadingAgain ? true : false,
      page : this.state.page + 1
    } , async () => {
        Database.GET('search/' + this.state.text + '/' + this.state.page).then(res => {
          this.setState({
            searchData: [...this.state.searchData, ... Database.data.data ],
            loading : false,
            loadingAgain : Database.data.data.length < 8 ? false : true
          });
        });
    });
    
  } 


    componentDidMount(){
        this.method.getNewChapter();
        this.method.getPopularData();
        this.method.getGenrePopular();
        this.method.getRecommendManga();
    }

    _getRecommendManga(){
        AsyncStorage.getItem('history')
            .then(res => JSON.parse(res))
            .then(res => {
                if(res !== null){
                    if (res.length <= 4) {
                        // default
                        Database.GET('recommend')
                            .then(() => {
                                this.setState({
                                    data_recommend: Database.data
                                })
                            })
                    } else {
                        let tmp = [];
                        res.forEach(e => tmp.push(e.genre));

                        function mode(array) {
                            if (array.length == 0)
                                return null;
                            var modeMap = {};
                            var maxEl = array[0],
                                maxCount = 1;
                            for (var i = 0; i < array.length; i++) {
                                var el = array[i];
                                if (modeMap[el] == null)
                                    modeMap[el] = 1;
                                else
                                    modeMap[el]++;
                                if (modeMap[el] > maxCount) {
                                    maxEl = el;
                                    maxCount = modeMap[el];
                                }
                            }
                            return maxEl;
                        }

                        let mostGenre = mode(tmp);

                        Database.GET( 'recommend/' + mostGenre)
                            .then(() => {
                                this.setState({
                                    data_recommend: Database.data
                                })
                            })
                            .catch(err => {

                            })


                    }
                }else{
                    Database.GET( 'recommend')
                        .then(res => {
                            this.setState({
                                data_recommend: Database.data
                            })
                        })
                }
                
            })
    }

    _getGenrePopular(){
        Database.GET('popular/genre')
            .then(() => {
                this._genreRebuild(Database.data.original.data);
            }).catch(err => console.log(err))
    }

    _genreRebuild(res){
        let arr = [];
        res.forEach(element => {
            genreStat.forEach(e => {
                if(e.name == element){
                    arr.push(e);
                }
            })
        });

        this.setState({
            data_genre : arr
        });
        
    }

    _renderGenre(item , index){

        

        if(item.vendor == undefined){
            return (
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        this.props.navigation.navigate('Other', {}, NavigationActions.navigate({
                        routeName: 'Genres' , 
                        params : {
                            inject : true,
                            dataGenre : item.name
                        }
                    }))
                }}>
                    <View style={{...styles.listGenre , marginLeft : index == 0 ? 20 : 7.5 , backgroundColor : item.color , shadowColor : item.color}}>
                        <MaterialIcon style={styles.genreIcon} name={item.icon}/>
                        <Text style={styles.genreTitle}>{item.name}</Text>
                    </View>

                </TouchableOpacity>
            )
        }else{
            if(item.vendor === 'FontAwesome5'){
                return (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            this.props.navigation.navigate('Other', {}, NavigationActions.navigate({
                            routeName: 'Genres' , 
                            params : {
                                inject : true,
                                dataGenre : item.name
                            }
                        }))
                    }}>
                        <View style={{...styles.listGenre , marginLeft : index == 0 ? 20 : 7.5 , backgroundColor : item.color , shadowColor : item.color}}>
                            <FontAwesome5 style={styles.genreIcon} name={item.icon}/>
                            <Text style={styles.genreTitle}>{item.name}</Text>
                        </View>

                    </TouchableOpacity>
                )
            }else if(item.vendor === 'Entypo'){
                return (

                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        this.props.navigation.navigate('Other', {}, NavigationActions.navigate({
                        routeName: 'Genres' , 
                        params : {
                            inject : true,
                            dataGenre : item.name
                        }
                    }))
                }}>
                    <View style={{...styles.listGenre , marginLeft : index == 0 ? 20 : 7.5 , backgroundColor : item.color , shadowColor : item.color}}>
                        <Entypo style={styles.genreIcon} name={item.icon}/>
                        <Text style={styles.genreTitle}>{item.name}</Text>
                    </View>

                </TouchableOpacity>
                )
            }else{
                return (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        this.props.navigation.navigate('Other', {}, NavigationActions.navigate({
                        routeName: 'Genres' , 
                        params : {
                            inject : true,
                            dataGenre : item.name
                        }
                    }))
                }}>
                    <View style={{...styles.listGenre , marginLeft : index == 0 ? 20 : 7.5 , backgroundColor : item.color , shadowColor : item.color}}>
                        <Fontisto style={styles.genreIcon} name={item.icon}/>
                        <Text style={styles.genreTitle}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
                )
            }
        }
    }

    _renderRank(rank){
        let rankPop = [ 1 , 2 , 3];
        let rankImg = ['first.png' , 'second.png' , 'third.png'];
        if(rankPop.includes(rank)){
            // if ranked 1 or 2 or 3
            if(rankPop.indexOf(rank) == 0){
                return (<FastImage style={styles.imgBadge} source={require('../../assets/first.png')} />)
            } else if (rankPop.indexOf(rank) == 1) {
                return (<FastImage style={styles.imgBadge} source={require('../../assets/second.png')} />)
            }else{
                return (<FastImage style={styles.imgBadge} source={require('../../assets/third.png')} />)
            }
        }else{
            return (
                <Text style={styles.anotherRank}>#{rank}</Text>
            )
        }
    }

    _getPopularData(){
        Database.GET('popular')
            .then(() => {
                this.setState({
                    data_popular : Database.data
                });
            }).catch(err => console.log(err))
    }

    _getNewChapter(){
        Database.GET('newchapter')
            .then(() => {
                this.setState({
                    data_newchapter : Database.data
                })
            })
        
    }

    _onViewableItemsChanged({viewableItems}) {
        this.scrollMostPopularPosition = viewableItems === undefined ? 0 : viewableItems[0].index;
    };

    _viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    };


    render(){
        return (
          <ScrollView
            style={styles.container}
            onScroll={({nativeEvent}) => {
              if (
                this.method.isCloseToBottom(nativeEvent) &&
                this.state.searchQuery.trim() != ''
              ) {
                this._loadMore();
              }
            }}>
            {/* <StatusBar translucent={false} /> */}

            <View style={styles.srcContainer}>
              <Icon name="search" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Comic"
                value={this.state.searchQuery}
                onChangeText={text => {
                  this.setState({searchQuery: text});
                  this._searchDatabase(text);
                }}
              />

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    searchQuery: '',
                    searchData: [],
                    totalDataSearch : 0,
                    text : ''
                  });
                }}>
                <MaterialIcon
                  name="close"
                  style={{
                    fontSize: 18,
                    opacity: this.state.searchQuery != '' ? 1 : 0,
                  }}
                />
              </TouchableOpacity>
            </View>

            {this.state.searchQuery == '' ? (
              <View>
                <View
                  style={{...styles.comicList, maxHeight: 100, height: 'auto'}}>
                  <View style={{...styles.headerComicList, marginBottom: 5}}>
                    <View style={styles.doubleText}>
                      <Text style={styles.subHeader}>Popular Genres </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.scrollGenre.scrollTo({
                          x: this.scrollGenrePosition + 200,
                        });
                      }}>
                      <Icon name="chevron-right" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    onScroll={({nativeEvent}) => {
                      this.scrollGenrePosition = nativeEvent.contentOffset.x;
                    }}
                    ref={node => (this.scrollGenre = node)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.genresContainer}>
                    <FlatList
                      data={this.state.data_genre}
                      horizontal
                      keyExtractor={(item, index) => item.name.toString()}
                      renderItem={({item, index}) => {
                        return this._renderGenre(item, index);
                      }}
                    />

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.props.navigation.navigate(
                          'Other',
                          {},
                          NavigationActions.navigate({
                            routeName: 'Genres',
                          }),
                        );
                      }}>
                      <View
                        style={{
                          ...styles.listGenre,
                          width: 80,
                          backgroundColor: 'orange',
                          shadowColor: 'orange',
                        }}>
                        <Text style={styles.genreTitle}>Other...</Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>

                <View
                  style={{
                    ...styles.comicList,
                    maxHeight: 250,
                    height: 'auto',
                    marginTop: -10,
                  }}>
                  <View style={styles.headerComicList}>
                    <View style={styles.doubleText}>
                      <Text style={styles.subHeader}>Recommend </Text>
                      <Text style={styles.onWeek}>by your interest</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.scrollRecommend.scrollToOffset({
                          offset: this.scrollRecommendPosition + 200,
                        });
                      }}>
                      <Icon name="chevron-right" />
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    ref={node => (this.scrollRecommend = node)}
                    onScroll={({nativeEvent}) => {
                      this.scrollRecommendPosition =
                        nativeEvent.contentOffset.x;
                    }}
                    data={this.state.data_recommend}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            this.props.navigation.navigate('DetailComic', {
                              mangaId: item.id_manga,
                            });
                          }}>
                          <View
                            style={{
                              ...styles.insideCard,
                              marginLeft: index != 0 ? 0 : 20,
                            }}>
                            <View style={{...styles.imgShadow}}>
                              <FastImage
                                source={{uri: item.image}}
                                style={styles.cardImgs}
                              />
                            </View>
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}>
                              <Text style={styles.cardTitle}>{item.name}</Text>
                            </ScrollView>
                            <Text style={styles.cardGenre}>{item.genres}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>

                <View
                  style={{...styles.comicList, height: 'auto', maxHeight: 400}}>
                  <View style={styles.headerComicList}>
                    <View style={styles.doubleText}>
                      <Text style={styles.subHeader}>New Chapter </Text>
                    </View>
                  </View>

                  <FlatList
                    data={this.state.data_newchapter}
                    keyExtractor={(item, index) => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => {
                            this.props.navigation.navigate('DetailComic', {
                              mangaId: item.id_chapters,
                            });
                          }}>
                          <View
                            style={{
                              ...styles.newChapterList,
                              marginLeft: index == 0 ? 20 : 10,
                            }}>
                            <FastImage
                              style={styles.newChapterImg}
                              source={{uri: item.image}}
                            />
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}>
                              <Text
                                style={{
                                  ...styles.cardTitle,
                                  marginTop: 10,
                                  marginLeft: 10,
                                }}>
                                {item.nameOfManga}
                              </Text>
                            </ScrollView>
                            <Text style={{...styles.cardGenre, marginLeft: 10}}>
                              {item.genre}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>

                <View style={{...styles.comicList, height: 410}}>
                  <View style={{...styles.headerComicList}}>
                    <View style={styles.doubleText}>
                      <Text style={{...styles.subHeader, ...styles.rangking}}>
                        Most Popular{' '}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.mostPopularScroll.scrollToIndex({
                          animated: true,
                          index:
                            this.scrollMostPopularPosition <= 1
                              ? this.scrollMostPopularPosition + 1
                              : this.scrollMostPopularPosition,
                        });
                      }}>
                      <Icon name="chevron-right" />
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    {...this.props}
                    viewabilityConfig={this._viewabilityConfig}
                    ref={node => (this.mostPopularScroll = node)}
                    // onScroll={({nativeEvent}) => this.scrollMostPopularPosition = nativeEvent.contentOffset.x}
                    data={this.state.data_popular}
                    showsVerticalScrollIndicator={false}
                    horizontal
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) => {
                      let parentIndex = index * 2;
                      return (
                        <View style={styles.rankPerContainer}>
                          <FlatList
                            data={item}
                            keyExtractor={(item, index) =>
                              item.id_manga.toString()
                            }
                            renderItem={({item, index}) => {
                              let childIndex = index + 1;
                              let rank = childIndex + parentIndex;
                              return (
                                <TouchableOpacity
                                  activeOpacity={0.88}
                                  onPress={e => {
                                    this.props.navigation.navigate(
                                      'DetailComic',
                                      {mangaId: item.id_manga},
                                    );
                                  }}>
                                  <View style={styles.rangkingContainer}>
                                    <View style={styles.leftContainer}>
                                      <FastImage
                                        source={{uri: item.image}}
                                        style={styles.rangkingImages}
                                      />
                                    </View>
                                    <View style={styles.rightContainer}>
                                      <Text style={styles.containerTitle}>
                                        {item.name}
                                      </Text>
                                      <View style={styles.description}>
                                        <View style={styles.descLeft}>
                                          <View style={styles.genreContainer}>
                                            <ScrollView
                                              horizontal
                                              showsHorizontalScrollIndicator={
                                                false
                                              }>
                                              {item.genres.map(e => (
                                                <View style={styles.genreStyle}>
                                                  <Text
                                                    style={styles.genreText}>
                                                    {e}
                                                  </Text>
                                                </View>
                                              ))}
                                            </ScrollView>
                                          </View>
                                          <Text style={styles.totalChapter}>
                                            Update Ep ke {item.lastEp}
                                          </Text>
                                          <View style={styles.totalView}>
                                            <Octicon
                                              name="eye"
                                              style={styles.iconView}
                                            />
                                            <Text style={styles.textView}>
                                              {item.views}
                                            </Text>
                                          </View>
                                        </View>
                                        <View style={styles.descRight}>
                                          {this._renderRank(rank)}
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              );
                            }}
                          />
                        </View>
                      );
                    }}
                  />
                </View>
              </View>
            ) : (
              <SearchTab
                navigation={this.props.navigation}
                data={this.state.searchData}
                method={this.method}
                totalData={this.state.totalDataSearch}
                loading={this.state.loading}
              />
            )}
          </ScrollView>
        );
    }
}

const styles = globalStyle;