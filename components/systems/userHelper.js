// import firebase from 'react-native-firebase';
import permission from './permissions';

class Helper {
    run(){
        this._getUserData();
        this._getPermissions();
    }

    // method list
    _getUserData = async () => {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            console.log(`fcmToken : ${fcmToken}`);
        } else {
            // user doesn't have a device token yet
            console.log(`fcmToken : failed`);
        }

    }

    _getPermissions = async () => {
        permission.notificationPermission();
    }

}

export default new Helper();
