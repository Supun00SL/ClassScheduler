
import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  formdata = {
    fname: '',
    lname: '',
    nic: '',
    email: '',
    mobile: '',
    telephone: '',
    password: '',
    reenterpassword: ''
  };
  submitAttempt: boolean = false;
  myForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      //password_ctrl: this.formBuilder.group({
      fname: ['', Validators.compose([Validators.required])],
      lname: ['', Validators.compose([Validators.required])],
      nic: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required])],
      telephone: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      reenterpassword: ['', Validators.compose([Validators.required])]
      //}, this.matchPassword)
    }, { 'validator': this.isMatching });

  }
  isMatching(group: FormGroup) {

    console.log("password check");

    var firstPassword = group.controls['password'].value;
    var secondPassword = group.controls['reenterpassword'].value;
    if ((firstPassword && secondPassword) && (firstPassword != secondPassword)) {
      console.log("mismatch");
      return { "pw_mismatch": true };
    } else {
      return null;
    }

  }

  SignUp() {

    this.submitAttempt = true;


    if (!this.myForm.valid) {
      console.log("Not valid!");
      let alert = this.alertCtrl.create({
        title: 'Invalid Form !',
        subTitle: 'Please Fill the Data Correctly.',
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      console.log("success!");

      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')

      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/signup", JSON.stringify(this.formdata), headers).subscribe(
        data => {
          if (data.text() == "1") {
            console.log("Successfully Saved!");
            let alert = this.alertCtrl.create({
              title: 'Successfull !',
              subTitle: 'Successfully Saved, Wait till Account got Active!',
              buttons: ['OK']
            });
            alert.present();
            this.navCtrl.pop();
          } else {
            console.log("User Already Found!");
            let alert = this.alertCtrl.create({
              title: 'Information !',
              subTitle: 'User Already Found!',
              buttons: ['OK']
            });
            alert.present();

          }
        },
        err => {
          console.log("Something went wrong one");
          let alert = this.alertCtrl.create({
            title: 'Error !',
            subTitle: 'Something Went Wrong :' + err,
            buttons: ['OK']
          });
          alert.present();
        }
      );
    }


  }

}
