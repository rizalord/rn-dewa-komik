import React, { Component } from 'react';
import {View , Text , StyleSheet } from 'react-native';
import globalStyle from '../../assets/css/global';
import FastImage from 'react-native-fast-image';

export default class CardComment extends Component {
    constructor(props){
        super(props);



    }

    render(){
        return (
            <View style={styles.cardComment}>
                <View style={styles.leftComment}>
                    <FastImage source={{uri : this.props.item.userData.image == null ? 'https://cdn.myanimelist.net/s/common/uploaded_files/1482965945-3d9561fa5a014da11e0dd3b2f148b1b0.jpeg' : this.props.item.userData.image}} style={styles.leftCommentImg} />
                </View>
                <View style={styles.rightComment}>
                    <Text style={styles.rightCommentName}>{this.props.item.userData.name}</Text>
                    <Text style={styles.rightCommentText}>
                        {this.props.item.text}
                    </Text>
                    <Text style={styles.dateComment}>{this.props.item.created_at}</Text>
                    
                </View>
            </View>
        )
    }
}


const styles = globalStyle;