import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { PopoverExamPage } from './../popoverexam/popoverexam';
import { PopoverPage } from './../popover/popover';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, PopoverController, ToastController, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AppMinimize } from '@ionic-native/app-minimize';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  id: string;
  mon: string;

  caldata: { type: string, day: string }[];
  calexamdata: { type: string, day: string }[];

  futurecalclassdata: { day: string, month: string, starttime: string, endtime: string, description: string }[];

  futurecalexamdata: { day: string, month: string, starttime: string, endtime: string, description: string }[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public http: Http, public popoverCtrl: PopoverController, private platform: Platform,
    private appMinimize: AppMinimize, private network: Network, private sqlite: SQLite,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.disablebackbtn();


  }

  ionViewDidLoad() {

    this.setmonth();

    //palawenipara bladdi
    this.setCalender();
    this.setexamCalender();
    this.setfutureclasses();
    this.setfutureexams();


  }

  setmonth(): void {
    let d = new Date().getMonth();

    switch (d) {
      case (0): {
        this.mon = "JANUARY";
        break;
      } case (1): {
        this.mon = "FEBRUARY";
        break;
      } case (2): {
        this.mon = "MARCH";
        break;
      } case (3): {
        this.mon = "APRIL";
        break;
      } case (4): {
        this.mon = "MAY";
        break;
      } case (5): {
        this.mon = "JUNE";
        break;
      } case (6): {
        this.mon = "JULY";
        break;
      } case (7): {
        this.mon = "AUGUST";
        break;
      } case (8): {
        this.mon = "SEPTEMBER";
        break;
      } case (9): {
        this.mon = "OCTOBER";
        break;
      } case (10): {
        this.mon = "NOVEMBER";
        break;
      } case (11): {
        this.mon = "DECEMBER";
        break;
      }
    }

  }

  //setting class calender------------------------------------------------------------

  setCalender(): void {
    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')
      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/calenderdays", JSON.stringify(this.id), headers).subscribe(
        data => {
          //console.log(data.text());
          this.caldata = JSON.parse(data.text());
          this.viewlengthclassData();
          this.createclassTable();
        },
        err => {
          console.log("Something went wrong one");
        }
      );
    } else {
      this.showToast("No Such Network Found");
      this.viewclassData();
    }

  }
  createclassTable() {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql('create table if not exists classcal('
            + 'type VARCHAR(32),day VARCHAR(32))',
            {}).then(() => {

              this.addingclassdata();

            }, (error) => {
              this.showToast('Error Occured..01');
            });
        }, (error) => {
          this.showToast('Error Occured..02');
        }
        );
    });
  }
  saveclassTable(type: string, day: string) {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql("INSERT INTO classcal (type,day) VALUES (?,?)",
            [type, day]).then((data) => {

            }, (error) => {
              this.showToast('Error class 01 :' + error);
            });
        },
        (error) => {
          this.showToast('Error class  02 :' + error);
        }
        );
    });
  }
  deleteclassTable() {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql("Delete from classcal",
            []).then((data) => {

            }, (error) => {
              this.showToast('Error class 01 :' + error);
            });
        },
        (error) => {
          this.showToast('Error class  02 :' + error);
        }
        );
    });
  }

  addingclassdata() {
    this.deleteclassTable();

    for (let data of this.caldata) {
      this.saveclassTable(data.type, data.day);
    }
    this.showToast('Class Shedule added...!');
    this.viewclassData();
  }



  sqlcaldata = [];
  viewclassData(): void {

    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql("SELECT * FROM classcal", []).then((data) => {

          for (let i = 0; i < data.rows.length; i++) {

            this.sqlcaldata.push({ type: data.rows.item(i).type, day: data.rows.item(i).day });
          }


        }, (error) => {

        });
      }, (error) => {

      }
        );
    });
  }

  length: any = 0;
  viewlengthclassData(): void {

    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql("SELECT * FROM classcal", []).then((data) => {
          this.length = data.rows.length;
        }, (error) => {

        });
      }, (error) => {

      }
        );
    });
  }


  //---------------------------------------------------------------------------------------------

  //set exam calender----------------------------------------------------------------------------
  setexamCalender(): void {
    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
      console.log("in examcal");
      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')
      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/calenderexamdays", JSON.stringify(this.id), headers).subscribe(
        data => {
         // console.log(data.text());
          this.calexamdata = JSON.parse(data.text());
          this.viewexamlengthclassData();
          this.createexamTable();
        },
        err => {
          console.log("Something went wrong one");

        }
      );
    } else {
      this.showToast("No Such Network Found");
      this.viewexamData();
    }

  }

  createexamTable() {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql('create table if not exists examcal(id VARCHAR(5),'
            + 'type VARCHAR(32),day VARCHAR(32))',
            {}).then(() => {

              this.addingexamdata();

            }, (error) => {
              this.showToast('Error Occured..01');
            });
        }, (error) => {
          this.showToast('Error Occured..02');
        }
        );
    });
  }
  saveexamTable(type: string, day: string) {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql("INSERT INTO examcal (type,day) VALUES (?,?)",
            [type, day]).then((data) => {

            }, (error) => {
              this.showToast('Error class 01 :' + error);
            });
        },
        (error) => {
          this.showToast('Error class  02 :' + error);
        }
        );
    });
  }
  deleteexamTable() {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql("Delete from examcal",
            []).then((data) => {

            }, (error) => {
              this.showToast('Error class 01 :' + error);
            });
        },
        (error) => {
          this.showToast('Error class  02 :' + error);
        }
        );
    });
  }

  addingexamdata() {
    this.deleteexamTable();
    for (let data of this.calexamdata) {
      this.saveexamTable(data.type, data.day);
    }
    this.showToast('Exam Shedule added...!');
    this.viewexamData();
  }

  sqlexamdata = [];
  viewexamData(): void {

    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql("SELECT * FROM examcal", []).then((data) => {

          for (let i = 0; i < data.rows.length; i++) {

            this.sqlexamdata.push({ type: data.rows.item(i).type, day: data.rows.item(i).day });
          }


        }, (error) => {

        });
      }, (error) => {

      }
        );
    });
  }

  examlength: any = 0;
  viewexamlengthclassData(): void {

    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql("SELECT * FROM examcal", []).then((data) => {
          this.examlength = data.rows.length;
        }, (error) => {

        });
      }, (error) => {

      }
        );
    });
  }

  //--------------------------------------------------------------------------------------------

  //set future classs---------------------------------------------------------------------------
  futurelength: string;
  setfutureclasses(): void {
    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
      console.log("in examcal");
      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')
      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/setfutureclasses", JSON.stringify(this.id), headers).subscribe(
        data => {
         // console.log(data.text());

          this.futurecalclassdata = JSON.parse(data.text());

          if (this.futurecalclassdata.length == 0) {
            this.futurelength = "no";
          } else {
            this.futurelength = "found";
          }

          //this.viewexamlengthclassData();
          //this.createexamTable();
        },
        err => {
          console.log("Something went wrong one");

        }
      );
    } else {
      this.showToast("No Such Network Found");
      // this.viewexamData();
    }

  }

  createfutureclassTable() {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql('create table if not exists futureclass(id VARCHAR(5),'
            + 'day VARCHAR(32),mon VARCHAR(32),starttime VARCHAR(32),endtime VARCHAR(32),'
            + 'description VARCHAR(32))',
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


  //--------------------------------------------------------------------------------------------


  //set future classs---------------------------------------------------------------------------
  futureexamlength: string;
  setfutureexams(): void {
    if (this.network.type === 'wifi' || this.network.type === '3g' || this.network.type === '4g') {
      console.log("in examcal");
      const headers = new Headers();
      headers.append('Content-type', 'application/json; charser=utf-8')
      this.http.post("http://138.197.37.12:8080/ClassAppServerSide/setfutureexams", JSON.stringify(this.id), headers).subscribe(
        data => {
         // console.log(data.text());

          this.futurecalexamdata = JSON.parse(data.text());

          if (this.futurecalexamdata.length == 0) {
            this.futureexamlength = "no";
          } else {
            this.futureexamlength = "found";
          }

          //this.viewexamlengthclassData();
          //this.createexamTable();
        },
        err => {
          console.log("Something went wrong one");

        }
      );
    } else {
      this.showToast("No Such Network Found");
      // this.viewexamData();
    }

    //--------------------------------------------------------------------------------------------
  }
  ngOnInit() {
    console.log("in init");
    this.id = this.navParams.data;

  }
  presentPopover(myEvent, day: string) {
    let popover = this.popoverCtrl.create(PopoverPage, { day: day, id: this.id });
    popover.present({
      ev: myEvent
    });
  }
  presentPopoverexam(myEvent, day: string) {
    let popover = this.popoverCtrl.create(PopoverExamPage, { day: day, id: this.id });
    popover.present({
      ev: myEvent
    });
  }

  disablebackbtn(): void {
    this.platform.registerBackButtonAction(() => {
      this.appMinimize.minimize();
    });
  }

  createfutureexamTable() {
    this.platform.ready().then((readySource) => {
      this.sqlite.create({
        name: 'classapp.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql('create table if not exists futureexam(id VARCHAR(5),'
            + 'day VARCHAR(32),mon VARCHAR(32),starttime VARCHAR(32),endtime VARCHAR(32),'
            + 'description VARCHAR(32))',
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

  showToast(text: any) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  doRefresh(refresher) {
    this.setmonth();

    this.calexamdata = [];
    this.caldata = [];
    this.sqlcaldata = [];
    this.sqlexamdata = [];
    //palawenipara bladdi
    this.setCalender(),
    this.setexamCalender(),
    this.setfutureclasses()

    setTimeout(() => {
      this.showToast("Home Page Refreshed !");
      //console.log('Async operation has ended');
      refresher.complete();
    },
      2000
    );
  }

  // presentLoadingText() {
  //   let loading = this.loadingCtrl.create({
  //     content: 'Loading Please Wait...'
  //   });

  //   loading.present();

  //   setTimeout(() => {
  //     this.viewData();
  //   }, 1000);

  //   setTimeout(() => {
  //     loading.dismiss();
  //   }, 2000);
  // }

}
