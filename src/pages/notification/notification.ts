import { NotimodalPage } from './../notimodal/notimodal';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';

/**
 * Generated class for the NotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage implements OnInit {

  id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , private network: Network, public http: Http, public toastCtrl: ToastController
    , public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.setNotifications();
  }

  notifications: { id: string, header: string, desc: string, state: string, time: string }[];
  setNotifications(): void {
    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')
      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/getnotifications", JSON.stringify(this.id), headers).subscribe(
        data => {
          //console.log(data.text());
          this.notifications = JSON.parse(data.text());


        },
        err => {
          console.log("Something went wrong one");
        }
      );
    } else {
      //this.showToast("No Such Network Found");

    }

  }
  ngOnInit() {
    console.log("in init");
    this.id = this.navParams.data;

  }
  showToast(text: any) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  presentModal(notiid: string) {
    let Modal = this.modalCtrl.create(NotimodalPage, { notiid: notiid });
    Modal.present();
  }

  doRefresh(refresher) {
    this.setNotifications();
    setTimeout(() => {
      this.showToast("Notification Panel Refreashed !");
      //console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


}
