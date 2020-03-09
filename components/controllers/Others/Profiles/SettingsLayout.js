import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';

export default SettingsLayout = props => {
  const [keyboardFocus , setKeyboardFocus] = useState(null);
  const {goBack} = props.navigation;
  const [photoProfile, setPhotoProfile] = useState(props.navigation.state.params.state.userProfilePicture)
  let [userName , setUserName] = useState('');
  let [email, setEmail] = useState('');
  let userCredential = null;
  useEffect(() => {
    didMount();
    
  } , []);

  const didMount = async () => {
    userCredential = await AsyncStorage.getItem('userCredential');
    setUserName(await AsyncStorage.getItem('fullName'));
    setEmail(await AsyncStorage.getItem('email'));
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={{flex: 1}} onPress={() => { props.navigation.navigate('Profile') }}>
          <View style={styles.backBtn}>
            <MaterialIcon name="chevron-left" size={30} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { props.navigation.navigate('Profile') }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={styles.editProfileTxt}>Edit profile</Text>
            <MaterialIcon name="chevron-down" size={20} />
          </View>
        </TouchableOpacity>

        <View style={{flex: 1}}></View>
      </View>
      {/* End Header */}

      {/* Photo Profile */}
      <View style={styles.ppContainer}>
        <View style={styles.layerThird}>
          <View style={styles.layerSecond}>
            <View style={styles.layerFirst}>
              <FastImage source={{uri: photoProfile}} style={styles.imagePpStyle} />
            </View>
          </View>
          {/* Tombol Update */}
          <TouchableOpacity style={styles.tombolUbah} onPress={async () => {
            let returned = await props.navigation.state.params.method.pickPhotoProfile();
            setPhotoProfile(returned);
          }}>
            <Icon name="add" color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      {/* End Photo Profile */}

      {/* Form */}
      <View style={{ ...styles.formGroup , borderColor : keyboardFocus != 'fullname' ? '#ccc' : 'orange'}}>
        <Text style={{ ...styles.labelFormGroup , color : keyboardFocus != 'fullname' ? '#ababab' : 'orange' }}>Fullname</Text>
        <TextInput style={{ ...styles.inputFormGroup , color : keyboardFocus != 'fullname' ? '#ababab' : 'rgba(0,0,0,0.7)'}} value={userName} onFocus={ () => { setKeyboardFocus('fullname') }} onChangeText={(text) => {setUserName(text) }} />
      </View>

      <View style={{ ...styles.formGroup , borderColor : keyboardFocus != 'email' ? '#ccc' : 'orange'}}>
        <Text style={{ ...styles.labelFormGroup , color : keyboardFocus != 'email' ? '#ababab' : 'orange' }}>Email</Text>
        <TextInput
          style={{ ...styles.inputFormGroup , color : keyboardFocus != 'email' ? '#ababab' : 'rgba(0,0,0,0.7)'}}
          value={email} onChangeText={text => setEmail(text)}
          onFocus={ () => { setKeyboardFocus('email') }}
        />
      </View>
      {/* ENd FOrm */}

      {/* Save btn */}
      <TouchableOpacity onPress={ async () => {
        props.navigation.state.params.method.saveHandler(userName , email)
        }}>
          <View style={styles.saveBtn}>
            <Text style={styles.saveTxt} >Save</Text>
          </View>
      </TouchableOpacity>
      {/* end save btn */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
  },
  editProfileTxt: {
    fontSize: 18,
    marginRight: 5,
  },
  ppContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerThird: {
    width: 130,
    height: 130,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: '#e9e9e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerSecond: {
    width: 100,
    height: 100,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: '#b5b7b7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerFirst: {
    width: 80,
    height: 80,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePpStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  tombolUbah: {
    position: 'absolute',
    width: 39,
    height: 39,
    backgroundColor: 'orange',
    right: 10,
    bottom: 10,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  formGroup: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  labelFormGroup: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 15,
    paddingVertical: 5,
    top: -15,
    left: 20,
    color: '#ABABAB',
  },
  inputFormGroup: {
    color: '#ABABAB',
  },
  saveBtn : {
      alignSelf : 'center',
      alignItems : 'center',
      justifyContent : 'center',
      paddingHorizontal : 50,
      paddingVertical : 10,
      backgroundColor : 'orange',
      borderRadius : 30
  },
  saveTxt : {
      color : 'white'
  }
});
