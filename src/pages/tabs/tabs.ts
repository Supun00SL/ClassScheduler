import { ContactlecturerPage } from './../contactlecturer/contactlecturer';
import { NavParams } from 'ionic-angular';
import { NotificationPage } from './../notification/notification';
import { HomePage } from './../home/home';
import { Component,OnInit } from '@angular/core';

@Component({

    selector: 'page-tabs',
    template: `
    <ion-tabs #myTabs>
    <ion-tab [root]="HomePage" [rootParams]="id" tabTitle="Home" tabIcon="ios-home"></ion-tab>
    <ion-tab [root]="NotificationPage" [rootParams]="id" tabTitle="Notifications" tabIcon="ios-notifications"></ion-tab>
    <ion-tab [root]="ContactlecturerPage" [rootParams]="id" tabTitle="Contact Lecturer" tabIcon="ios-contacts"></ion-tab>  
    </ion-tabs>
    `

})
export class TabsPage implements OnInit{
    HomePage=HomePage;
    NotificationPage=NotificationPage;
    ContactlecturerPage=ContactlecturerPage;

    id:string;

    constructor(private navParams: NavParams) {
        
    }

    ngOnInit(){
        
        this.id=this.navParams.data;

    }
}