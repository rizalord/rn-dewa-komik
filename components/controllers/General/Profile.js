import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  Switch,
  AsyncStorage,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import globalStyle from '../../assets/css/global';
import {createStackNavigator} from 'react-navigation-stack';
import MainProfile from './../Others/Profiles/MainProfile';
import {createAppContainer} from 'react-navigation';
import {StackActions, NavigationActions} from 'react-navigation';
import LoadingIndicator from './../../Views/components/LoadingIndicator';
import ImagePicker from 'react-native-image-crop-picker';
import firebaseConfig, {mobileApi} from './../../systems/config';
import RNFetchBlob from 'react-native-fetch-blob';
import ProfileSettingsLayout from './../Others/Profiles/SettingsLayout';
import ValidationComponent from 'react-native-form-validator';
import Dialog from 'react-native-dialog';
import {Database} from '../../systems/database';

const {Blob} = RNFetchBlob.polyfill;
const {fs} = RNFetchBlob;
const {Fetch} = RNFetchBlob.polyfill;

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
window.fetch = new Fetch({
  auto: true,
  // binaryContentType: ['image/', 'video/', 'audio/', 'foo/'],
}).build();

export default class Profile extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      darkMode: false,
      quitDialog: false,
      userProfilePicture: null,
      loading: true,
      username: '',
      email: '',
      dialogPassword: false,
      password: '',
    };

    this.method = {
      logout: this._logout.bind(this),
      setDialogLogout: this._setDialogLogout.bind(this),
      pickPhotoProfile: this._pickPhotoProfile.bind(this),
      setState: this._setState.bind(this),
      saveHandler: this._saveHandler.bind(this),
    };

    this.firebase = require('firebase/app');
    require('firebase/auth');
    require('firebase/database');
    require('firebase/storage');

    if (!this.firebase.apps.length) {
      this.firebase.initializeApp(firebaseConfig);
    }

    // this.Screen = createAppContainer(
    //   createStackNavigator(
    //     {
    //       MainProfile: {
    //         screen: props => (
    //           <MainProfile
    //             method={this.method}
    //             state={this.state}
    //             navigation={props.navigation}
    //           />
    //         ),
    //       },
    //       ProfileSettings: {
    //         screen: props => (
    //           <ProfileSettingsLayout
    //             navigation={props.navigation}
    //             method={this.method}
    //             state={this.state}
    //           />
    //         ),
    //       },
    //     },
    //     {
    //       // initialRouteName : 'ProfileSettings',
    //       headerMode: 'none',
    //     },
    //   ),
    // );
  }

  componentDidMount() {
    this._getUserData();
  }

  _setState(data) {
    this.setState(data);
  }

  async _getUserData() {
    const pp = await AsyncStorage.getItem('profilePicture');
    const fullName = await AsyncStorage.getItem('fullName');
    this.setState({
      userProfilePicture:
        pp != 'null'
          ? pp
          : 'https://cdn.myanimelist.net/s/common/uploaded_files/1482965945-3d9561fa5a014da11e0dd3b2f148b1b0.jpeg',
      loading: false,
      username: fullName,
    });
  }

  async _logout() {
    await this._deleteLocalStorage();
  }

  async _pickPhotoProfile() {
    return await ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      return this._uploadImage(image);
    });
  }

  async _uploadImage(image) {
    let file = image;
    let metadata = image.mime;
    let storageRef = this.firebase.storage().ref();
    let fileName = await AsyncStorage.getItem('userId');
    let imageUploadedUrl = null;

    let uploadBlob = null;
    // create image reference
    let imageRef = storageRef.child('images/' + fileName);
    // build blob
    return await fs
      .readFile(image.path, 'base64')
      .then(data => Blob.build(data, {type: `${metadata};BASE64`}))
      // put image to reference
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, {contentType: metadata});
      })
      .then(async () => {
        uploadBlob.close;
        return imageRef.getDownloadURL().then(async downloadUrl => {
          return this._updateRestProfile(downloadUrl);
        });
      });
  }

  async _updateRestProfile(url) {
    const userId = await AsyncStorage.getItem('userId');
    return await Database.POST('user/profile', {
      url: url,
      userId: userId,
    })
      .then(res => {
        if (res == true) {
          ToastAndroid.show('Photo has been updated', ToastAndroid.SHORT);
          this._setUserProfilePicture(url);
          return url;
        }
      })
      .catch(err => {
        ToastAndroid.show(
          'Update Image failed, please try again later.',
          ToastAndroid.LONG,
        );
      });
  }

  async _setUserProfilePicture(uri) {
    await AsyncStorage.setItem('profilePicture', uri).then(() => {
      this.setState({
        userProfilePicture: uri,
      });
    });
  }

  async _deleteLocalStorage() {
    await AsyncStorage.multiRemove(
      [
        'userId',
        'email',
        'profilePicture',
        'bookmark',
        'fullname',
        'history',
        'liked',
        'realHistory',
        'readedId',
        'darkMode',
      ],
      () => {
        ToastAndroid.show('You have been logged out', ToastAndroid.SHORT);

        const navigateAction = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({routeName: 'Auth'})],
        });
        this.props.navigation.dispatch(navigateAction);
      },
    );
  }

  _setDialogLogout() {
    this.setState({
      quitDialog: !this.state.quitDialog,
    });
  }

  async _saveHandler(username, email) {
    await this.setState(
      {
        username: username,
        email: email,
      },
      async () => {
        await this.validate({
          username: {
            minlength: 8,
            maxlength: 16,
            required: true,
          },
          email: {
            email: true,
            required: true,
          },
        });

        if (this.getErrorMessages() != '') {
          ToastAndroid.show(this.getErrorMessages(), ToastAndroid.SHORT);
        } else {
          await this._doSave();
        }
      },
    );
  }

  async _doSave() {
    let userCredential = null;
    await AsyncStorage.getItem('userCredential')
      .then(res => JSON.parse(res))
      .then(res => (userCredential = res));

    const fullName = this.state.username;
    const prevEmail = await AsyncStorage.getItem('email');
    const nextEmail = this.state.email == prevEmail ? null : this.state.email;
    const userId = await AsyncStorage.getItem('userId');

    const lastUsername = await AsyncStorage.getItem('fullName');
    const lastEmail = await AsyncStorage.getItem('email');

    if (nextEmail == lastEmail || fullName == lastUsername) {
      this.props.navigation.navigate('Profile');
    } else {
      if (nextEmail != null) {
        this._getPassword();
      } else {
        await this._doUpdate(fullName, nextEmail, userId, prevEmail);
        this.props.navigation.navigate('Profile');
      }
    }
  }

  async _doUpdate(fullName, nextEmail, userId, prevEmail) {
    await Database.POST('user/nameemail', {
      username: fullName,
      email: nextEmail,
      fbId: userId,
    }).then(async res => {
      if (res) {
        await AsyncStorage.setItem('fullName', fullName);
        await AsyncStorage.setItem(
          'email',
          nextEmail != null ? nextEmail : prevEmail,
        );
        ToastAndroid.show('Update Sucess!', ToastAndroid.SHORT);

        return true;
      } else {
        return false;
      }
    });
  }

  _getPassword() {
    this.setState({
      dialogPassword: true,
    });
  }

  async _checkPassword() {
    let firebase = this.firebase;
    const fullName = this.state.username;
    const prevEmail = await AsyncStorage.getItem('email');
    const nextEmail = this.state.email == prevEmail ? null : this.state.email;
    const userId = await AsyncStorage.getItem('userId');
    const doUpdate = this._doUpdate;
    const func = async () => {
      if (
        (await doUpdate(fullName, nextEmail, userId, prevEmail)) == undefined
      ) {
        this.setState(
          {
            password: '',
            dialogPassword: false,
          },
          () => {
            this.props.navigation.navigate('Profile');
          },
        );
      }
    };

    await firebase
      .auth()
      .signInWithEmailAndPassword(prevEmail, this.state.password)
      .then(async userCredential => {
        userCredential.user
          .updateEmail(nextEmail)
          .catch(err => {
            ToastAndroid.show(err.message, ToastAndroid.SHORT);
          })
          .then(async res => {
            // success
            await func();
          });
      })
      .catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      });
  }

  render() {
    return this.state.loading ? (
      <LoadingIndicator />
    ) : (
      <View style={{flex: 1}}>
        <Dialog.Container visible={this.state.dialogPassword}>
          {/* <Dialog.Title>Password Verification</Dialog.Title> */}
          <Dialog.Description>
            Password required to edit Email
          </Dialog.Description>
          <Dialog.Input
            secureTextEntry={true}
            placeholder={'password'}
            wrapperStyle={{
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(0,0,0,0.1)',
              padding: 0,
              paddingHorizontal: 5,
            }}
            value={this.state.password}
            onChangeText={text => this.setState({password: text})}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() =>
              this.setState({
                dialogPassword: false,
                password: '',
              })
            }
          />
          <Dialog.Button
            label="Submit"
            onPress={async () => {
              await this._checkPassword();
              // setTimeout(() => {
              //   this.setState(
              //     {
              //       password: '',
              //       dialogPassword: false,
              //     },
              //     () => {
              //       this.props.navigation.navigate('Profile');
              //     },
              //   );
              // } , 2000);
            }}
          />
        </Dialog.Container>
        <MainProfile
          method={this.method}
          state={this.state}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = globalStyle;
