import React, { Component } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default class LoadingIndicator extends Component {
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color="rgba(255,255,255,1)" />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  box : {
    width : 100,
    height : 100,
    justifyContent : 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor : 'rgba(0,0,0,0.45)'
  }
})
