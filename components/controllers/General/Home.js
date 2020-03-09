import React from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StatusBar,
  StyleSheet,
  BackHandler,
  Dimensions,
  Image,
  Animated,
  FlatList,
  TextInput,
  Easing,
  AsyncStorage,
  Button,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyle from '../../assets/css/global';
import {mobileApi} from '../../systems/config';
// import firebase from 'react-native-firebase';
import Helper from './../../systems/userHelper';
// import { RemoteMessage } from 'react-native-firebase';
import FastImage from 'react-native-fast-image';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchTab from './../../Views/Others/SearchTab';
import {Database} from './../../systems/database';
import {database} from 'firebase';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      loading: true,
      data: [],
      collection: [],
      carousel: [],
      trendData: [],
      tokenNotif: null,
      searchQuery: '',
      searchData: [],
      quitDialog: false,
      quitStatus: false,
      page : 1,
      loading : false,
      loadingAgain : true,
      totalDataSearch : 0,
      text : ''
    };

    this.method = {
      isCloseToBottom : this.isCloseToBottom.bind(this),
      loadMore : this._loadMore.bind(this)
    }

    this.slideValue = new Animated.Value(0);

    this._searchDatabase = this._searchDatabase.bind(this);

    this.scrollRecendPosition = 0;
    this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);
    this.scrollTopCollectionPosition = 0;

    this.onBackClick = this.onBackClick.bind(this);
  }

  async componentDidMount() {
    this._getDataSchedule();
    this._getCollections();
    this._getCarousels();
    this._getTrends();
    this._getUserData();

    this.slideValue.addListener(({value}) => (this._value = value));

    this.didFocusListener = this.props.navigation.addListener(
      'willFocus',
      () => {
        BackHandler.addEventListener('hardwareBackPressed', this.onBackClick);
      },
    );
    this.didBlurListener = this.props.navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener('hardwareBackPressed', this.onBackClick);
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPressed', this.onBackClick);
    this.didFocusListener.remove();
    this.didBlurListener.remove();
  }

  async onBackClick() {
    if (this.props.navigation.state.params.routeName == 'Home') {
      if (this.slideValue._value == 1) {
        this.setState(
          {
            searchQuery: '',
            searchData: [],
          },
          () => {
            this._slideUp();
          },
        );
      } else {
        if (this.state.quitStatus == false) {
          await this.setState(
            {
              quitStatus: true,
            },
            () => {
              ToastAndroid.show(
                "Tekan tombol 'Kembali' untuk keluar.",
                ToastAndroid.SHORT,
              );
              setTimeout(() => {
                this.setState({
                  quitStatus: false,
                });
              }, 2000);
            },
          );
        } else {
          BackHandler.exitApp();
        }

        // this.setState({
        //     quitDialog: true
        // })
      }
    }

    return true;
  }

  _onViewableItemsChanged({viewableItems}) {
    this.scrollTopCollectionPosition =
      viewableItems === undefined ? 0 : viewableItems[0].index;
  }

  _getUserData = async () => {
    await AsyncStorage.getItem('userId').then(userId => {
      if (userId != null) {
        // get userdata to Api
        Database.GET('user/data/' + userId).then(async res => {
          try {
            this._setUserData(Database.data);
          } catch (err) {
            console.log('error setitem', err);
          }
        });
      }
    });
  };

  async _setUserData(res) {
    await AsyncStorage.setItem('fullName', res.name);
    await AsyncStorage.setItem('email', res.email);
    await AsyncStorage.setItem('profilePicture', res.image);
    await AsyncStorage.setItem('bookmark', JSON.stringify(res.bookmark));
    await AsyncStorage.setItem('liked', JSON.stringify(res.likes));
  }

  _getTrends() {
    Database.GET('trend').then(res => {
      this.setState({
        trendData: Database.data,
      });
    });
  }

  _getCarousels() {
    Database.GET('carousel').then(res => {
      this.setState({
        carousel: Database.data,
      });
    });
  }

  _getCollections() {
    Database.GET('collection').then(res => {
      this.setState({
        collection: Database.data,
      });
    });
  }

  _getDataSchedule() {
    Database.GET('schedule').then(() => {
      this.setState({
        loading: false,
        data: Database.data.original.data,
      });
    });
  }

  // Animation
  _slideUp() {
    this.slideValue.setValue(1);
    Animated.timing(this.slideValue, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(),
    }).start();
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

  _slideDown() {
    this.slideValue.setValue(0);
    Animated.timing(this.slideValue, {
      toValue: 1,
      duration: 250,
      easing: Easing.in(),
    }).start();
  }

  _viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

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


  render() {
    let slideIn = this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 0],
    });

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} onScroll={({nativeEvent}) => {
        if (this.method.isCloseToBottom(nativeEvent) && this.slideValue._value == 1 && this.state.searchQuery.trim() != '')  {
          this._loadMore();
        }
      }}>
        {/* Header */}
        {/* <StatusBar translucent={false} /> */}

        {/* <Dialog.Container visible={this.state.quitDialog}>
              <Dialog.Title>Exit</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to exit?
              </Dialog.Description>
              <Dialog.Button
                label="No"
                onPress={() => this.setState({quitDialog: false})}
              />
              <Dialog.Button
                label="Sure"
                onPress={() => {
                  BackHandler.exitApp();
                }}
              />
            </Dialog.Container> */}

        {/* Search Bar */}
        <Animated.View
          style={{
            ...styles.srcContainer,
            position: 'absolute',
            zIndex: 2,
            top: slideIn,
          }}>
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
              this.setState(
                {
                  searchQuery: '',
                  searchData: [],
                  totalDataSearch: 0
                },
                () => {
                  this._slideUp();
                },
              );
            }}>
            <MaterialIcon
              name="close"
              style={{
                fontSize: 18,
                opacity: this.state.searchQuery != '' ? 1 : 0,
              }}
            />
          </TouchableOpacity>
        </Animated.View>
        {/* END OF SEARCHBAR */}

        {this.state.searchQuery == '' ? (
          <View>
            <View style={{...styles.header, paddingHorizontal: 20}}>
              <Text style={styles.homeText}>Home Page</Text>

              <TouchableOpacity
                onPress={() => {
                  this._slideDown();
                }}>
                <View style={styles.searchContainer}>
                  <Icon name="search" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            <FlatList
              style={{
                ...styles.carouselContainer,
                height: 'auto',
                maxHeight: 200,
              }}
              data={this.state.carousel}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      this.props.navigation.navigate('DetailComic', {
                        mangaId: item.id_manga,
                      });
                    }}>
                    <View
                      style={{
                        ...styles.cardCarousel,
                        marginLeft: index == 0 ? 20 : 0,
                      }}>
                      <FastImage
                        source={{uri: item.url}}
                        style={styles.carouselImgs}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <View style={{...styles.comicList, height: 'auto', maxHeight: 250}}>
              <View style={styles.headerComicList}>
                <View style={styles.doubleText}>
                  <Text style={styles.subHeader}>Recend Trends </Text>
                  <Text style={styles.onWeek}>on week</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.scrollRecend.scrollToOffset({
                      offset: this.scrollRecendPosition + 200,
                    });
                  }}>
                  <Icon name="chevron-right" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={this.state.trendData}
                ref={node => (this.scrollRecend = node)}
                onScroll={({nativeEvent}) => {
                  this.scrollRecendPosition = nativeEvent.contentOffset.x;
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.id_manga}
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
                          marginLeft: index == 0 ? 20 : 0,
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
              style={{
                ...styles.comicList,
                height: 'auto',
                maxHeight: 220,
                marginBottom: 0,
              }}>
              <View style={styles.headerComicList}>
                <Text style={styles.subHeader}>Top Collections</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.topCollection.scrollToIndex({
                      animated: true,
                      index:
                        this.scrollTopCollectionPosition <=
                        this.state.collection.length - 2
                          ? this.scrollTopCollectionPosition + 1
                          : this.scrollTopCollectionPosition,
                    });
                  }}>
                  <Icon name="chevron-right" />
                </TouchableOpacity>
              </View>

              <FlatList
                onViewableItemsChanged={this._onViewableItemsChanged}
                viewabilityConfig={this._viewabilityConfig}
                ref={node => (this.topCollection = node)}
                data={this.state.collection}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.id}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.props.navigation.navigate(
                          'Other',
                          {},
                          NavigationActions.navigate({
                            routeName: 'Genres',
                            params: {
                              inject: true,
                              dataGenre: item.genre,
                            },
                          }),
                        );
                      }}>
                      <View
                        style={{
                          ...styles.collections,
                          marginLeft: index == 0 ? 20 : 0,
                        }}>
                        <FastImage
                          source={{uri: item.url}}
                          style={styles.collectionsImgs}
                        />
                        <View style={styles.collectionsGenreContainer}>
                          <Text style={styles.collectionsGenre}>
                            {item.genre}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <View
              style={{
                ...styles.comicList,
                maxHeight: 600,
                height: 'auto',
                marginBottom: 0,
                paddingHorizontal: 10,
                alignSelf: 'center',
              }}>
              <View style={styles.headerComicList}>
                <Text style={styles.subHeader}>Schedule</Text>
                {/* <Icon name="chevron-right"/> */}
              </View>
              <View style={styles.scheduleContainer}>
                <FlatList
                  data={this.state.data}
                  keyExtractor={(item, index) => item.id}
                  numColumns={3}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          this.props.navigation.navigate('DetailComic', {
                            mangaId: item.id_chapters,
                          });
                        }}>
                        <View style={styles.scheduleList}>
                          <FastImage
                            source={{uri: item.realImage}}
                            style={styles.scheduleImgs}
                          />

                          <Text style={styles.scheduleTitle}>
                            {item.nameOfManga}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate(
                  'Other',
                  {},
                  NavigationActions.navigate({
                    routeName: 'Genres',
                  }),
                );
              }}>
              <View style={styles.morecomic}>
                <Text style={styles.moreText}>More Comic</Text>
                <Icon style={styles.moreChevron} name="chevron-right" />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginTop: 55}}>
            <SearchTab
              data={this.state.searchData}
              navigation={this.props.navigation}
              method={this.method}
              totalData={this.state.totalDataSearch}
              loading={this.state.loading}
            />
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = globalStyle;
