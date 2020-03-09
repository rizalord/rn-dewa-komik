import React from 'react';
import {View , Text , StyleSheet , StatusBar , Dimensions, Image , FlatList, AsyncStorage} from 'react-native';
import { ScrollView, TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import globalStyle from '../../assets/css/global';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import BookmarkScreen from './../../Views/General/BookmarkScreen';
import HistoryScreen from './../../Views/General/HistoryScreen';
import LoadingScreen from './../../Views/components/LoadingIndicator';
import { mobileApi } from '../../systems/config';




export default class Bookmark extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width : Dimensions.get('window').width,
            loading : true,
            data : null,
            history : null
        }

        this.Tabs = createAppContainer(createMaterialTopTabNavigator({
            Bookmark: {
                screen: (props2) => (<BookmarkScreen data={this.state.data} navigation={props.navigation} />),
            },
            History: {
                screen: () => ( <HistoryScreen data={this.state.history} navigation={props.navigation} />),
            }

        }, {
            tabBarOptions: {
                activeTintColor: 'orange',
                inactiveTintColor: 'black',
                tabStyle: {
                    paddingTop: 0,
                },
                style: {
                    elevation: 0,
                    backgroundColor: 'white',
                    borderBottomColor: 'rgba(0,0,0,0.1)',
                    borderBottomWidth: 1,
                    height: 40,
                },
                labelStyle: {
                    fontSize: 12,
                    alignSelf: 'center',
                },
                indicatorStyle: {
                    borderBottomWidth: 1,
                    backgroundColor: 'orange',
                    borderBottomColor: 'orange',

                },

            },
        }));
        
        this._getItem = this._getItem.bind(this);
    }

    componentWillUnmount(){
        this.setState({
            loading : true
        })
        this.didFocusListener.remove();
        this.didBlurListener.remove();
    }

    async componentDidMount(){
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            async () => {
                this._getItem();
            },
        );

        this.didBlurListener = this.props.navigation.addListener(
            'didBlur',
            async () => {
                this.setState({
                    loading : true,
                    data : [],
                    history : []
                })
            },
        );

        

        
    }

    async _getItem(){
        await AsyncStorage.getItem('bookmark')
            .then(res => JSON.parse(res))
            .then(async res => {
                const userId = await AsyncStorage.getItem('userId');
                let dataBookmark = JSON.parse(await AsyncStorage.getItem('bookmark'));
                let dataHistory = JSON.parse(await AsyncStorage.getItem('realHistory'));
                this.setState({
                    data: dataBookmark != null ? dataBookmark.reverse() : [],
                    history: dataHistory != null ? dataHistory.reverse() : [],
                    loading: false
                })

            })
    }


    render(){
        return (
            <View style={{ flex : 1}}>
                {/* <StatusBar translucent={false} /> */}

                <View style={styles.headerBookmark}>
                    <Text style={styles.headerTitle}>Library</Text>    
                </View>
                {
                    this.state.loading ? 
                    <LoadingScreen />
                    :
                    <this.Tabs />
                }
                

            </View>   
            
        )
    }
}

const styles = globalStyle;