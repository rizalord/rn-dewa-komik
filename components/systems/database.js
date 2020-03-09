import {mobileApi} from './config';
import { AsyncStorage } from 'react-native';

export var Database = {
    data : [],
    totalData : 0,

    GET : async function(route , data = null) {
        const userId = await AsyncStorage.getItem('userId');
        const token = await this.Builder.tokenBuild(userId);
        const routes = mobileApi + route ;


        return new Promise((resolve, reject) => {
            fetch(routes, {
              headers: {
                Authorization: `Bearer ${userId}::${token}`,
              },
              body: JSON.stringify({
                data: data,
              }),
            })
            .then(res => res.json())
            .then(res => {
                if(res.status == true){
                    this.data = res.data
                    this.totalData = res.totalData != undefined ? res.totalData : 0
                    resolve(true)
                }else{
                    reject(res.message);
                }
            })
            .catch(e => {
                console.log(e)
                reject(e);
            })
        })
        
        
    },

    POST : async function(route , data) {
        const userId = await AsyncStorage.getItem('userId');
        const token = await this.Builder.tokenBuild(userId);
        const routes = mobileApi + route 

        return new Promise((resolve, reject) => {
            fetch(routes, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${userId}::${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                data: data,
              }),
            })
              .then(res => res.json())
              .then(res => {
                if (res.status == true) {
                    this.data = res.data != undefined ? res.data : null
                    resolve(true);
                } else {
                    reject(false);
                }
              })
              .catch(e => {
                console.log(e);
                reject(e);
              });
        })
        
        
    },

    Builder : {
        tokenBuild : async (userId) => {
            // var today = new Date();
            // var token = today.getTime().toString() + 'Lt2d' + userId;

            
            var asyncToken = await AsyncStorage.getItem('token');
            var token = `${asyncToken}Lt2d${userId}`;
            

            return token;
        },
    }


};