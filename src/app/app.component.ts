
import { TabsPage } from './../pages/tabs/tabs';
import { Badge } from '@ionic-native/badge';
import { NotificationPage } from './../pages/notification/notification';
import { LoginPage } from './../pages/login/login';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { Http } from '@angular/http';

import { Network } from '@ionic-native/network';
import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController, AlertController, NavController, Tabs } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild("appNav") nav: NavController;

  rootPage: any = LoginPage;


  constructor(public platform: Platform, statusBar: StatusBar,
    splashScreen: SplashScreen,
    public http: Http, private sqlite: SQLite, private network: Network
    , private localNotifications: LocalNotifications, public toastCtrl: ToastController, public push: Push
    , public alertCtrl: AlertController, private badge: Badge) {


    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();
      this.getid();
      this.badge.clear();


      network.onchange().subscribe(() => {
        console.log('network connected!');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          if (network.type === 'wifi' || network.type === '3g' || network.type === '4g') {
            this.getid();
          }
        }, 3000);
      });
    });
  }


  notifications: { Header: string, Description: string }[];
  checknotifications() {
    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')
      // headers.append( 'Access-Control-Allow-Origin', '*')
      // headers.append( 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT')

      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/checknoti", JSON.stringify(this.id), headers).subscribe(
        data => {
          this.notifications = JSON.parse(data.text());
          this.shownotifications();
        },
        err => {
          console.log("Something went wrong one");

        }
      );
    }
  }

  shownotifications() {
    let i = 0;
    for (let noti of this.notifications) {
      this.localNotifications.schedule({
        id: i,
        title: noti.Header,
        text: noti.Description,
        sound: this.platform.is('android') ? 'file://assets/sounds/sound.mp3' : 'file://assets/sounds/sound.m4r'
      });

      i++;
    }

  }
  id: string;
  ideka: string;
  getid(): void {

    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql("SELECT * FROM details", []).then((data) => {

          for (let i = 0; i < data.rows.length; i++) {
            this.id = data.rows.item(i);
            //this.checknotifications();
            //  console.log("id ============================== :"+data.rows.item(i).id);
            this.ideka = data.rows.item(i).id;
            this.initPushNotification();
          }


        }, (error) => {

        });
      }, (error) => {

      }
        );
    });
  }
  showToast(text: any) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  //push

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {
        //senderID: '658187799182'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      //TODO - send device token to server
      this.savedevicetoken(data.registrationId, this.ideka);
    });

    pushObject.on('notification').subscribe((data: any) => {
      // this.badge.increase(1);
      console.log('message -> ' + data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              let navTransition = confirmAlert.dismiss();
              navTransition.then(() => {

              });

              return false;

            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.nav.push(LoginPage);
        console.log('Push notification clicked');
        //this.badge.decrease(1);

      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }


  savedevicetoken(token: string, id: string) {
    let params = { id, token }

    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')

      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/savedevicetoken", params, headers).subscribe(
        data => {
          // this.notifications = JSON.parse(data.text());
          // this.shownotifications();
          console.log("Successfully Saved Token!");
        },
        err => {
          console.log("Something went wrong one");

        }
      );
    }

  }
}




