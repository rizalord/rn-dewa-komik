// import firebase from 'react-native-firebase'

class Permission {

    notificationPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            console.log('User have permission');
        } else {
            firebase.messaging().requestPermission()
                .then(() => {
                    console.log('(+) notification authorized')
                })
                .catch(error => {
                    console.log('(-) notification not authorized');
                    console.log(error);
                });
        }
    }
}

export default new Permission();