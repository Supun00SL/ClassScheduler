import { ContactlecturerPage } from './../pages/contactlecturer/contactlecturer';
import { NotimodalPage } from './../pages/notimodal/notimodal';
import { PopoverExamPage } from './../pages/popoverexam/popoverexam';
import { PopoverPage } from './../pages/popover/popover';
import { SignupPage } from './../pages/signup/signup';
import { NotificationPage } from './../pages/notification/notification';
import { TabsPage } from './../pages/tabs/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular//http';
import { AppMinimize } from '@ionic-native/app-minimize';
import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { SQLite } from '@ionic-native/sqlite';
import { CallNumber } from '@ionic-native/call-number';
import { Push, PushOptions } from '@ionic-native/push';
import { Badge } from '@ionic-native/badge';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    NotificationPage,
    SignupPage,
    PopoverPage,
    PopoverExamPage,
    NotimodalPage,
    ContactlecturerPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    NotificationPage,
    SignupPage,
    PopoverPage,
    PopoverExamPage,
    NotimodalPage,
    ContactlecturerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,

    AppMinimize,

    Network,

    LocalNotifications,

    SQLite,
    CallNumber,
    Push,
    Badge,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
}
