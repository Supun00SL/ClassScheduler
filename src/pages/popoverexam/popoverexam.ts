import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    template: `
      <ion-list *ngFor="let data of popoverdata">
        <div ion-item *ngFor="let item of data">     
            <ion-list-header>              
                <strong><p>{{item.code}}</p></strong>
                <strong><p style='font-size:12px;'>{{item.title}}</p></strong>
                <strong style="color:blue;"><p>{{item.type}}</p></strong>
            </ion-list-header>
                <p>{{item.location}}</p>
                <p>{{item.lecturehall}}</p>
                <ion-badge>{{item.time}}</ion-badge>  
        </div>
      </ion-list>
    `
})
export class PopoverExamPage implements OnInit {
    data: { day: string, id: string };

    popoverdata: { details: { title: string,code:string,type:string, time: string, location, string ,lecturehall:string}[] }[];

    constructor(public viewCtrl: ViewController, public navParams: NavParams, public http: Http) { }

    close() {
        this.viewCtrl.dismiss();
    }

    ngOnInit() {
        console.log("in init");
        //console.log(this.appPreferences.fetch('student'));
        this.data = this.navParams.data;
    }

    setPopOver(): void {
        console.log("in exampop");
        const headers = new Headers();
        headers.append('Content-type', 'application/json; charser=utf-8')
        this.http.post("http://138.197.37.12:8080/ClassAppServerSide/popoverexam", JSON.stringify(this.data), headers).subscribe(
            data => {
                //console.log(data.text());   
                this.popoverdata = JSON.parse(data.text());
                console.log(this.popoverdata);
            },
            err => {
                console.log("Something went wrong one");
                // return null;
            }
        );

    }

    ionViewDidLoad() {
        this.setPopOver();
    }
}