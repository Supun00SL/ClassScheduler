import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

/**
 * Generated class for the NotimodalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notimodal',
  templateUrl: 'notimodal.html',
})
export class NotimodalPage implements OnInit {

  notiid: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController
    , private network: Network, public http: Http, public toastCtrl: ToastController) {
   
  }
  ngOnInit(): void {
    this.notiid = this.navParams.data;
    this.setNotificationDetails();
  }

  ionViewDidLoad() {
   // this.setNotificationDetails();
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

  notifications: { id: string, header: string, desc: string, state: string, time: string }[];
  setNotificationDetails(): void {
   
    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')
      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/drawnoti", JSON.stringify(this.notiid), headers).subscribe(
        data => {
          console.log(data.text());
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
  showToast(text: any) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

}
