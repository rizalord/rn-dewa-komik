import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Animated,
  TextInput,
  Easing,
  BackHandler,
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyle from '../../assets/css/global';
import {mobileApi} from '../../systems/config';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import FastImage from 'react-native-fast-image';
import {genreItems, genre} from '../../systems/config';
import AllGenre from '../../controllers/Others/Genres/AllGenre';
import ChooseGenre from './../../Views/Others/ChooseGenre';
import {createStackNavigator} from 'react-navigation-stack';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchTab from './../../Views/Others/SearchTab';
import {Database} from '../../systems/database';

export default class GenreScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      loading: true,
      data: [],
      otherGenreSelected: 'Other',
      searchQuery: '',
      searchData: [],
      page: 1,
      loading: false,
      loadingAgain: true,
      totalDataSearch: 0,
      text: '',
    };

    // default route
    let defRoute = 'All';
    let otherDefRoute = 'ChooseGenre';
    let dataInject = undefined;

    if (props.navigation.state.params !== undefined) {
      let genreInject = props.navigation.state.params.dataGenre;

      defRoute = genre.includes(genreInject) ? genreInject : 'Other';

      if (defRoute == 'Other') {
        otherDefRoute = 'SelectedGenre';
        dataInject = genreInject;
      }
    }

    genre.forEach(e => {
      Object.assign(genreItems, {
        [e]: {
          screen: () => (
            <AllGenre genre={e} navigator={props.navigation} backprop={true} />
          ),
        },
      });
    });

    // make other route
    const otherRoute = createAppContainer(
      createStackNavigator(
        {
          ChooseGenre: {
            screen: ChooseGenre,
          },
          SelectedGenre: {
            screen: props2 => (
              <AllGenre
                injectGenre={dataInject}
                navigation={props2.navigation}
                navigator={props.navigation}
              />
            ),
          },
        },
        {
          headerMode: 'none',
          initialRouteName: otherDefRoute,
        },
      ),
    );
    // Add 'other' route
    Object.assign(genreItems, {
      Other: {
        screen: otherRoute,
      },
    });

    this.Tab = createAppContainer(
      createMaterialTopTabNavigator(
        {
          ...genreItems,
        },
        {
          initialRouteName: defRoute,
          defaultNavigationOptions: ({navigation}) => ({
            tabBarLabel: ({focused}) => {
              const {routeName} = navigation.state;
              switch (routeName) {
                case 'Other':
                  return (
                    <View
                      style={{
                        backgroundColor: '#F8C654',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 15,
                      }}>
                      <Text style={{color: 'white'}}>Other</Text>
                    </View>
                  );
                  break;
                default:
                  return focused ? (
                    <Text style={{color: 'orange'}}>{routeName}</Text>
                  ) : (
                    <Text>{routeName}</Text>
                  );
                  break;
              }
            },
          }),
          tabBarOptions: {
            activeTintColor: 'orange',
            indicatorStyle: {
              backgroundColor: 'orange',
              height: 3,
              borderRadius: 30,
            },
            tabStyle: {
              justifyContent: 'center',
              alignItems: 'center',
              width: 'auto',
              overflow: 'scroll',
              color: 'black',
            },
            upperCaseLabel: false,
            inactiveTintColor: 'rgba(0,0,0,0.7)',
            style: {
              backgroundColor: 'white',
              elevation: 0,
              marginLeft: 15,
            },
            scrollEnabled: true,
          },
        },
      ),
    );

    this.slideValue = new Animated.Value(0);
    this.onBackClick = this.onBackClick.bind(this);

    this._searchDatabase = this._searchDatabase.bind(this);

    this.method = {
      isCloseToBottom: this.isCloseToBottom.bind(this),
      loadMore: this._loadMore.bind(this),
    };
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
        totalDataSearch : 0,
        text : text,
        loadingAgain : true
      },
      () => {
        if (text !== '') {
          Database.GET('search/' + text + `/${this.state.page}`).then(() => {
            this.setState({
              totalDataSearch: Database.totalData,
              searchData: Database.data.data,
            });
          });
        } else {
          this.setState({
            searchData: [],
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
    this.setState(
      {
        loading: this.state.loadingAgain ? true : false,
        page: this.state.page + 1,
      },
      async () => {
        Database.GET('search/' + this.state.text + '/' + this.state.page).then(
          res => {
            this.setState({
              searchData: [...this.state.searchData, ...Database.data.data],
              loading: false,
              loadingAgain: Database.data.data.length < 8 ? false : true,
            });
          },
        );
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

  componentDidMount() {
    this._getDataSchedule();

    this.slideValue.addListener(({value}) => (this._value = value));

    BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackClick);
  }

  onBackClick() {
    if (this.slideValue._value == 1) {
      this.setState(
        {
          searchData: [],
          searchQuery: '',
        },
        () => {
          this._slideUp();
        },
      );
    } else {
      this.props.navigation.goBack(null);
    }
    return true;
  }

  _getDataSchedule() {
    Database.GET('schedule')
      .then(() => {
        this.setState({
          loading: false,
          data: Database.data,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    let slideIn = this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 30],
    });

    return (
      <View
        style={{
          ...styles.container,
          flex: 1,
          paddingTop : 0,
          backgroundColor: 'white',
        }}>
        {/* Header */}

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
                  totalDataSearch : 0,
                  text : ''
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
          <View style={{flex: 1 , marginTop : 30}}>
            <View
              style={{
                ...styles.header,
                paddingHorizontal: 15,
                marginBottom: 0,
              }}>
              <Text
                style={{
                  ...styles.homeText,
                  fontWeight: 'bold',
                  fontSize: 25,
                }}>
                Genre
              </Text>

              <TouchableOpacity
                onPress={() => {
                  this._slideDown();
                }}>
                <View style={styles.searchContainer}>
                  <Icon name="search" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>
            <this.Tab />
          </View>
        ) : (
          
            <SearchTab
              data={this.state.searchData}
              navigation={this.props.navigation}
              method={this.method}
              totalData={this.state.totalDataSearch}
              loading={this.state.loading}
              priority={true}
            />
          
        )}
      </View>
    );
  }
}

const styles = globalStyle;
