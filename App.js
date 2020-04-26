import React, {Fragment,useEffect} from "react";
import {
 SafeAreaView,
 StyleSheet,
 ScrollView,
 View,
 Text,
 StatusBar,
 Alert
} from "react-native";
import firebase from "react-native-firebase";


export default function App() {


 useEffect(() => {
 this.checkPermission();
 this.messageListener();
}, []);

checkPermission = async () => {
 const enabled = await firebase.messaging().hasPermission();
 if (enabled) {
   this.getFcmToken();
 } else {
   this.requestPermission();
 }
}

getFcmToken = async () => {
 const fcmToken = await firebase.messaging().getToken();
 if (fcmToken) {
  console.log(fcmToken);
  this.showAlert("Your Firebase Token is:", fcmToken);
 } else {
  this.showAlert("Failed", "No token received");
 }
}

requestPermission = async () => {
 try {
  await firebase.messaging().requestPermission();
  // User has authorised
 } catch (error) {
   // User has rejected permissions
 }
}

messageListener = async () => {
 this.notificationListener = firebase.notifications().onNotification((notification) => {
   const { title, body } = notification;
   this.showAlert(title, body);
 });

 this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
   const { title, body } = notificationOpen.notification;
   this.showAlert(title, body);
 });

 const notificationOpen = await firebase.notifications().getInitialNotification();
 if (notificationOpen) {
   const { title, body } = notificationOpen.notification;
   this.showAlert(title, body);
 }

 this.messageListener = firebase.messaging().onMessage((message) => {
  console.log(JSON.stringify(message));
 });
}

showAlert = (title, message) => {
 Alert.alert(
  title,
  message,
  [
   {text: "OK", onPress: () => console.log("OK Pressed")},
  ],
  {cancelable: false},
 );
}

  return (
    <View style={ styles.screen }>

    <Text> hi </Text>
  
    </View>
  );
}

const styles = StyleSheet.create({
  screen : {
    flex : 1,
    alignItems : 'center'
  }

});


// import React, {Component} from 'react';
// import { AsyncStorage, View, Text } from 'react-native';
// import firebase from 'react-native-firebase';

// export default class App extends Component {

// async componentDidMount() {
//   this.checkPermission();
// }

//   //1
// async checkPermission() {
//   const enabled = await firebase.messaging().hasPermission();
//   if (enabled) {
//       this.getToken();
//   } else {
//       this.requestPermission();
//   }
// }

//   //3
// async getToken() {
//   let fcmToken = await AsyncStorage.getItem('fcmToken');
//   if (!fcmToken) {
//       fcmToken = await firebase.messaging().getToken();
//       if (fcmToken) {
//           // user has a device token
//           await AsyncStorage.setItem('fcmToken', fcmToken);
//       }
//   }
// }

// componentWillMount() {
// PushNotification.popInitialNotification(notification => {
// console.log('Initial notification: ', notification);
// });
// }

//   //2
// async requestPermission() {
//   try {
//       await firebase.messaging().requestPermission();
//       // User has authorised
//       this.getToken();
//   } catch (error) {
//       // User has rejected permissions
//       console.log('permission rejected');
//   }
// }

//   render() {
//     return (
//       <View style={{flex: 1}}>
//         <Text>Welcome to React Native!</Text>
//       </View>
//     );
//   }
// }

// import firebase from 'react-native-firebase'
// import type {Notification ,NotificationOpen} from 'react-native-firebase'

// class FCMService{
//     register = (onRegister , onNotification, onOpenNotification) => {
//         this.checkPermission(onRegister)
//         this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
//     }

//     checkPermission = (onRegister) => {
//          firebase.messaging().hasPermission()
//         .then(enabled => {
//             if(enabled) {
//                 //user has permissions
//                 this.getToken(onRegister)
//             }
//             else {
//                 //user doesn't have permission
//                 this.requestPermission(onRegister)
//             }
//         }).catch(error => {
//             console.log("permission rejected",error)
//         })
//         }

//     getToken = (onRegister) => {
//         firebase.messaging().getToken().then(fcmToken => {
//             if(fcmToken){
//                 onRegister(fcmToken)
//             }else{
//                 console.log("User does not have a device token")
//             }
//         }).catch(error => {
//             console.log("getToken rejected " ,error)
//         })
//     }

//     requestPermission = (onRegister) => {
//         firebase.messaging().requestPermission()
//         .then(() => {
//             this.getToken(onRegister)
//         }).catch(error =>{
//             console.log("Request Permission  required" ,error)
//         })
//     }
    
//     deleteToken = () => {
//         firebase.messaging().deleteToken()
//         .catch(error => {
//             console.log("Delete token error" ,error)
//         })
//     }

    

//     createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
//         //Triggered when a particular notification has been received
//         this.NotificationListener = firebase.notifications()
//         .onNotification((notification: Notification) => {
//             onNotification(notification)
//         })

//         //if your app is in background ,you can listen for when a notification is clicked 
//         this.notificationOpenedListener = firebase.notification()
//         .onNotificationOpened((notificationOpen : NotificationOpen) =>{
//             onOpenNotification(notification)
//         })

//         firebase.notification().getInitialNotification()
//         .then(notificationOpen =>{
//             if(notification) {
//                 const notification : Notification = notification.notification
//                 onOpenNotification(notification)
//             }
//         })

//         //Triggered for data only payload in foreground
//         this.messageListener = firebase.messaging().onMessage((message) => {
//             onNotification(message)
//         })

//         //Triggered when we have new token
//         this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
//             cosole.log("New Token refresh : ", fcmToken)
//             onRegister(fcmToken)
//         })
//     } 

//     unRegister = () =>{
//         this.notificationListener()
//         this.notificationOpenedListener()
//         ths.messageListener()
//         this.onTokenRefreshListener()
//     }

//     buildChannel = (obj) =>{
//         return new firebase.notification.Android.Channel(
//             obj.channelId, obj.channelName,
//             firebase.notifications.Android.Importance.High)
//             .setDescription(obj.channelDes)
        
//     }

//     buildNotification = (obj) =>{
//         firebase.notification().android.createChannel(obj.channel)

//         //for android and ios
//         return new firebase.notifications.Notification()
//         .setSound(obj.sound)
//         .setNotificationId(obj.dataId)
//         .setTitle(obj.title)
//         .setBody(obj.content)
//         .setData(obj.data)
//         //for android
//         .android.setChannelId(obj.channel.channelID)
//         .android.setLargeIcon(obj.largeIcon)
//         .android.setSmallIcon(obj.smallIcon)
//         .android.setColor(obj.colorBgIcon)
//         .android.setPriority(firebase.notifications.Android.Priority.High)
//         .android.setVibrate(obj.vibrate)
//     }

//     scheduleNotification = (notification, days , minutes) =>{
//         const date = new Date()
//         if(days) {
//             date.setDate(date.getDate() + days)

//         }
//         if(minutes) {
//             date.setMinutes(date.getMinutes() + minutes)
//         }
//         firebase.notifications()
//         .scheduleNotification(notification, { fireDate: date.getTime()})
//     }
       

//        displayNotification = (notification) =>{
//            firebase.notification().displayNotification(notification)
//            .catch(error => console.log("Display Notification error : ", error))
//        }

//        removeDeliveredNotification = (notification) => {
//            firebase.notifications()
//            .removeDeliveredNotification(notification.notificationId)
//        }
// }

// export const fcmService = new FCMService()