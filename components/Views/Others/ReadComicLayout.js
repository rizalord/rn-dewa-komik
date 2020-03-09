import React from 'react';
import {View , Text , StyleSheet , Dimensions, Animated , Easing , Image , StatusBar} from 'react-native';
import { ScrollView, TouchableWithoutFeedback, TouchableOpacity, TextInput, FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import globalStyle from '../../assets/css/global'
// import AutoHeightImage from 'react-native-auto-height-image';
import FastImage from 'react-native-fast-image';
import PinchZoomView from 'react-native-pinch-zoom-view';
import {ReactNativeZoomableView} from '@dudigital/react-native-zoomable-view';
import ScaledImage from './../components/ScaledImage';

export default class DetailComicLayout extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            width: Dimensions.get('window').width,
            data : this.props.data,
            showHeader : false,
            canPress : false
        }

        this.slideValue = new Animated.Value(0);
        this.scrollRef = 0;
    }

    componentDidMount(){
        // setTimeout(() => {
            
        //     this.setState({
        //         canPress : true
        //     } , () => {
        //         this._slideUp();
        //     })
        // }, 2000);
    }


    _slideDown(){
        this.slideValue.setValue(1);
        Animated.timing(
            this.slideValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.in()
            }
        ).start();
    }

    _slideUp(){
        this.slideValue.setValue(0);
        Animated.timing(
            this.slideValue,
            {
                toValue : 1,
                duration : 300,
                easing : Easing.in()
            }
        ).start();
    }


    render(){
        const slideUp = this.slideValue.interpolate({
            inputRange : [0,1],
            outputRange : [0,-50]
        });
        const slideDown = this.slideValue.interpolate({
            inputRange : [0,1],
            outputRange : [0,-50]
        });

        return (
            <View style={{flex : 1}}>
                <StatusBar hidden={true}/>

                    {/* Top Title */}
                    <Animated.View style={{ 
                            ...styles.headerRead , 
                            opacity : 1,
                            top : slideUp
                        }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            console.log(this.props);
                            this.props.navigation.goBack(null);
                        }}>
                            <View style={styles.backReadBtn}>
                                <MaterialIcon style={styles.cevLeft} name='format-list-bulleted' />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.episodeTitel} numberOfLines={1}>Episode {this.props.episode} - {this.props.title}</Text>
                    </Animated.View>
                    {/* End of Top Title */}

                    {/* Start Navigation Bottom */}
                    <Animated.View style={{ 
                            ...styles.headerRead , 
                            opacity : 1,
                            top :  null,
                            bottom : slideDown,
                            justifyContent : 'space-around'
                        }}>
                        {/* Prev */}
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            if(this.props.prev != null){
                                this.props.method.changePage('prev')
                            }
                            
                        }}>
                            <View style={styles.backReadBtn}>
                                <MaterialIcon style={{ ...styles.cevLeft , color : this.props.prev != null ? 'white' : 'rgba(200,200,200,0.55)' }} name='chevron-left' />
                            </View>
                        </TouchableOpacity>
                        {/* End Prev */}
                        {/* Next */}
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            if(this.props.next != null){
                                this.props.method.changePage('next')
                            }
                            
                        }}>
                            <View style={styles.backReadBtn}>
                                <MaterialIcon style={{ ...styles.cevLeft , color : this.props.next != null ? 'white' : 'rgba(200,200,200,0.55)' }} name='chevron-right' />
                            </View>
                        </TouchableOpacity>
                        {/* End Next */}

                    </Animated.View>
                    {/* End Navigation Bottom */}

                    <TouchableWithoutFeedback 
                        onPress={ () => {
                                this.setState({
                                    showHeader: !this.state.showHeader,
                                    canPress : !this.state.canPress
                                }, () => {
                                    !this.state.showHeader ? this._slideDown() : this._slideUp();
                                })
                            
                        }}>
                        <View style={{width : '100%' , height : '100%'}}>

                            <ReactNativeZoomableView minZoom={1} >
                            <FlatList
                                ref={ref => this.scrollRef =  ref}
                                data={this.state.data}
                                onScroll={({nativeEvent}) => {
                                    if(nativeEvent.contentOffset.y <= 50 && this.state.canPress == true){
                                        this.setState({
                                            showHeader: !this.state.showHeader,
                                            canPress : false
                                        } , () => {
                                            this._slideDown();
                                        })
                                        
                                    } else if (nativeEvent.contentOffset.y > 50 && this.state.canPress == false) {
                                        this.setState({
                                            showHeader: !this.state.showHeader,
                                            canPress: true
                                        }, () => {
                                            this._slideUp();
                                        })
                                    }
                                }}
                                keyExtractor={(item , index) => item.id}
                                renderItem={(item , index) => {

                                    return (
                                        <View style={styles.imgListContainer}>
                                            {/* <AutoHeightImage
                                                width={ Dimensions.get('window').width } 
                                                source={{ uri : item.item.img_link }}
                                            /> */}

                                            <ScaledImage 
                                                uri={item.item.img_link}
                                                // width={ Dimensions.get('window').width } 
                                            />

                                            
                                        </View>
                                    )
                                }}
                            />
                            </ReactNativeZoomableView>
                        </View>
                     </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = globalStyle;