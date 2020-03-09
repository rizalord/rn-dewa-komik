import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  Switch,
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import globalStyle from '../../../assets/css/global';
import Dialog from 'react-native-dialog';
import {StackActions, NavigationActions} from 'react-navigation';

export default class MainProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: Dimensions.get('window').width,
      darkMode: false,
      dialogLogout: false,
      image: props.state.userProfilePicture,
    };
  }

  componentWillUnmount() {}

  render() {
    return (
      <ScrollView
        style={{...styles.container, paddingTop: 0, backgroundColor: 'white'}}
        showsVerticalScrollIndicator={false}>
        {/* Logout Dialog */}

        <Dialog.Container visible={this.state.dialogLogout}>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to logout?
          </Dialog.Description>
          <Dialog.Button
            label="No"
            onPress={() =>
              this.setState({
                dialogLogout: !this.state.dialogLogout,
              })
            }
          />
          <Dialog.Button
            label="Sure"
            onPress={() => {
              this.setState(
                {
                  dialogLogout: !this.state.dialogLogout,
                },
                async () => {
                  await this.props.method.logout();
                },
              );
            }}
          />
        </Dialog.Container>

        {/* End of Logout Dialog */}
        {/* Header */}
        <StatusBar translucent={true} backgroundColor="transparent" />

        <View
          style={{
            backgroundColor: 'orange',
            width: (Dimensions.get('window').height * 50) / 100,
            height: (Dimensions.get('window').height * 50) / 100,
            borderRadius: 360,
            borderTopLeftRadius: 0,
            marginLeft: -40,
            marginTop: -40,
            borderBottomLeftRadius: 340,
          }}>
          <View
            style={{
              ...styles.header,
              paddingHorizontal: 20,
              marginTop: 70,
              marginLeft: 40,
            }}>
            <Text
              style={{
                ...styles.homeText,
                color: 'rgb(30,30,30)',
                fontWeight: 'bold',
              }}>
              Profile
            </Text>
          </View>

          {/* Image Rounded */}
          <View
            style={{
              width: (Dimensions.get('window').height * 25) / 100,
              height: (Dimensions.get('window').height * 25) / 100,
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 15,
              right: 55,
              borderRadius: 150,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.8)',
            }}>
            <View
              style={{
                position: 'absolute',
                width: 45,
                height: 45,
                backgroundColor: 'orange',
                bottom: -10,
                right: -1,
                borderRadius: 45,
                zIndex: 3,
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>
            <View
              style={{
                position: 'absolute',
                zIndex: 5,
                bottom: -5,
                right: 4,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  let returned = await this.props.method.pickPhotoProfile();
                  // this.setState({
                  //   image: returned,
                  // });
                }}>
                <View
                  style={{
                    backgroundColor: '#c4c2c2',
                    borderRadius: 40,
                  }}>
                  <MaterialIcon
                    name="add"
                    style={{
                      fontSize: 35,
                      color: 'black',
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <FastImage
              source={{
                uri: this.props.state.userProfilePicture,
              }}
              key={this.state.image}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 150,
                position: 'absolute',
                zIndex: 3,
                backgroundColor: 'whitesmoke',
              }}
            />
          </View>
        </View>
        {/* End Header */}

        <TouchableOpacity activeOpacity={0.7} onPress={() => {
          this.props.navigation.navigate('Other' , {} , NavigationActions.navigate({
            routeName : 'ProfileSettings',
            params : {
              state : this.props.state,
              method : this.props.method
            }
          }))
        }}>
          <View
            style={{
              width: '85%',
              height: 60,
              backgroundColor: '#E9EDF0',
              alignSelf: 'flex-end',
              marginTop: 40,
              borderTopLeftRadius: 60,
              borderBottomLeftRadius: 60,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              padding: 25,
              borderWidth: 2,
              borderColor: '#E9EDF0',
            }}>
            <Text
              style={{
                color: 'rgba(0,0,0,0.65)',
              }}>
              Profile Settings
            </Text>
          </View>
        </TouchableOpacity>

        {/* Log out */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this.setState({
              dialogLogout: !this.state.dialogLogout,
            });
          }}>
          <View
            style={{
              width: '85%',
              height: 60,
              backgroundColor: '#E9EDF0',
              alignSelf: 'flex-end',
              marginTop: 20,
              borderTopLeftRadius: 60,
              borderBottomLeftRadius: 60,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              padding: 25,
              borderWidth: 2,
              borderColor: '#E9EDF0',
            }}>
            <Text
              style={{
                color: 'rgba(0,0,0,0.65)',
              }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = globalStyle;
