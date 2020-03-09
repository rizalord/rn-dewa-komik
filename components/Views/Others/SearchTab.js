import React from 'react';
import { View , Text , ScrollView , Dimensions , FlatList , TouchableOpacity , ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import globalStyle from './../../assets/css/global';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicon from 'react-native-vector-icons/Octicons';

export default class SearchTab extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
          <ScrollView
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              paddingBottom: 35,
              marginTop: this.props.priority == true ? 60 : 0,
            }}
            showsVerticalScrollIndicator={false}
            onScroll={({nativeEvent}) => {
                if(this.props.method.isCloseToBottom(nativeEvent)){
                    this.props.method.loadMore()
                }
            }}>
            <View>
              <View
                style={{
                  ...styles.headerComicList,
                  paddingHorizontal: 18,
                  marginHorizontal: 0,
                  marginTop: this.props.priority == true ? 25 : 0,
                }}>
                <View style={styles.doubleText}>
                  <Text style={styles.subHeader}>
                    Results - {this.props.totalData}{' '}
                  </Text>
                </View>
              </View>
            </View>

            <FlatList
              data={this.props.data}
              keyExtractor={(item, index) => item.id_manga}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.props.navigation.navigate('DetailComic', {
                      mangaId: item.id_manga,
                    });
                  }}>
                  <View
                    style={{
                      ...styles.rangkingContainer,
                      marginTop: index == 0 ? 0 : 0,
                      marginLeft: 15,
                      width: (Dimensions.get('window').width * 85) / 100,
                    }}>
                    <View style={styles.leftContainer}>
                      <FastImage
                        source={{uri: item.image}}
                        style={styles.rangkingImages}
                      />
                    </View>
                    <View
                      style={{
                        ...styles.rightContainer,
                        width: (Dimensions.get('window').width * 85) / 100 - 70,
                      }}>
                      <Text style={styles.containerTitle} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View style={styles.description}>
                        <View
                          style={{
                            ...styles.descLeft,
                            width: Dimensions.get('window').width - 40 - 120,
                          }}>
                          <Text style={styles.authorText}>{item.author}</Text>

                          <View style={styles.littleSinopsis}>
                            <Text
                              numberOfLines={2}
                              style={styles.littleSummary}>
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
                              <Icon
                                name="bookmark"
                                style={styles.iconReaction}
                              />
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
              )}
            />
            {this.props.loading == true ? (
              <ActivityIndicator
                style={{marginBottom: 10}}
                size="large"
                color="rgba(0,0,0,0.5)"
              />
            ) : null}
          </ScrollView>
        );
    }
}

const styles = globalStyle;