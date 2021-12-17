import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';
import { CallNumber } from '@ionic-native/call-number';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ContactlecturerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactlecturer',
  templateUrl: 'contactlecturer.html',
})
export class ContactlecturerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams
    , private callNumber: CallNumber, private network: Network,public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactlecturerPage');
    this.getlecturerenumbers();
  }

  calllecturer(number:string): void {
    this.callNumber.callNumber(number, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));

  }

  lecturerdetails:{name:string,phonenumber:string,email:string}[];
  getlecturerenumbers():void{
    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')
      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/lecturernums", null, headers).subscribe(
        data => {
          this.lecturerdetails=JSON.parse(data.text());
        },
        err => {
          console.log("Something went wrong one");

        }
      );
    } else {
      //this.showToast("No Such Network Found");
      // this.viewexamData();
    }

  }

}
