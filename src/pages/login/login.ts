
import { Network } from '@ionic-native/network';
import { SignupPage } from './../signup/signup';
import { TabsPage } from './../tabs/tabs';
import { Http, Headers } from '@angular/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { IonicPage, NavController, NavParams, AlertController, Platform, ToastController } from 'ionic-angular';
//import { NavController, ToastController, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  result: any = [];

  studata: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    nic: string;
    telephone: string;
    mobile: string;
    state: string;
  };

  b: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
     public alertCtrl: AlertController,
    private network: Network, private sqlite: SQLite,
    private platform: Platform, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.presentLoadingText();
  }


  Login(form: NgForm) {

    //unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
    const headers = new Headers();
    headers.append('Content-type', 'application/json; charser=utf-8')
    this.http.post("http://138.197.37.12:8080/ClassAppServerSide/login"
      , JSON.stringify(form.value), {headers:headers}).subscribe(
      data => {
        //console.log(data.text());
        this.studata = JSON.parse(data.text());
        //console.log(this.studata.state);
        if (this.studata.state == "0") {
          let alert = this.alertCtrl.create({
            title: 'Incorrect !',
            subTitle: 'Your UserName or Password is Incorrect, Please Try Again.',
            buttons: ['OK']
          });
          alert.present();
        } else if (this.studata.state == "1") {
          this.createTables();
          this.save(this.studata.id, this.studata.fname, this.studata.lname, this.studata.email, this.studata.nic, this.studata.telephone, this.studata.mobile);
          //this.appPreferences.store('student', data.text().split("_")[1]);
          this.navCtrl.push(TabsPage, { id: this.studata.id });
        } else if (this.studata.state == "2") {
          let alert = this.alertCtrl.create({
            title: 'Access Denied !',
            subTitle: 'Your Account is Currently Disabled.',
            buttons: ['OK']
          });
          alert.present();

        }
      },
      err => {
        let alert = this.alertCtrl.create({
          title: 'Error !',
          subTitle: 'Error :'+err,
          buttons: ['OK']
        });
        alert.present();
        console.log("Something went wrong one");
      }
      );

    } else {
     this.showToast('No Such Network Found !');

    }
  }

  gotoSignUp() {
    this.navCtrl.push(SignupPage);
  }

  createTables() {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql('create table if not exists details(id VARCHAR(5),'
            + 'fname VARCHAR(32),lname VARCHAR(32),email VARCHAR(32),nic VARCHAR(32),'
            + 'telephone VARCHAR(32),mobile VARCHAR(32))',
            {}).then(() => {
              // this.showToast('Table Created');
            }, (error) => {
              this.showToast('Error Occured..01');
            });
        }, (error) => {
          this.showToast('Error Occured..02');
        }
        );
    });
  }

  save(id: string, fname: string, lname: string, email: string, nic: string, telephone: string, mobile: string) {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql("INSERT INTO details (id,fname,lname,email,nic,telephone,mobile) VALUES (?,?,?,?,?,?,?)",
            [id, fname, lname, email, nic, telephone, mobile]).then((data) => {
              this.showToast('Login Successfull...!');
            }, (error) => {
              //this.showToast('Error 01 :' + error);
            });
        },
        (error) => {
          //this.showToast('Error 02 :' + error);
        }
        );
    });
    //this.viewData();
  }

  showToast(text: any) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  stid: string;
  stname: string;
  viewData(): void {

    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql("SELECT * FROM details", []).then((data) => {
          this.result = [];
          for (let i = 0; i < data.rows.length; i++) {

            this.stid = data.rows.item(i).id;
            this.stname = data.rows.item(i).fname;
          }

          this.showToast('Welcome Back ' + this.stname + ' !');
          this.navCtrl.push(TabsPage, { id: this.stid });

        }, (error) => {

        });
      }, (error) => {

      }
        );
    });
  }

  presentLoadingText() {
    let loading = this.loadingCtrl.create({
      content: 'Loading Please Wait...'
    });

    loading.present();

    setTimeout(() => {
      this.viewData();
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }






}
