import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppComponent } from "../app.component";

import { GroupPurchaseService } from "../group-purchase/group-purchase.service";
import { ProfileService } from '../profile.service';
import { PanelService } from "../panel/panel.service";

import { Profile } from '../profile';

@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.css']
})
export class MypageComponent implements OnInit {
  loggedInUser: Profile;
  profile: Profile;
  profileList: Profile[];
  passwordVerification='';
  isVerified: boolean;
  change_profile: Profile;
  change_password = '';
  confirm_password = '';
  email_check: boolean;
  before_email: string;
  register_History: History[];

  constructor(
    private appComponent: AppComponent,
    private router: Router,
    private profileService: ProfileService,
    private gpService: GroupPurchaseService,
    private panelService: PanelService
  ) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('logged in user')) {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('logged in user'));
      this.change_profile = JSON.parse(sessionStorage.getItem('logged in user'));
    }
    this.profile = this.loggedInUser;
    this.isVerified = false;
    this.email_check = false;
    this.before_email = null;
    this.register_History = this.getGPRegisters();
  }

  passwordVerify(): void {
    if(this.loggedInUser.password===this.passwordVerification) {
      this.isVerified = true;
    } else {
      alert('Wrong Password');
    }
  }

  updateProfile(): void {
    if (!RegExp('^(?=.*[0-9])(?=.*[a-z, A-Z]).{8,}$').test(this.change_password)) {
      alert('Password contains 8 or more characters');
      return;
    }
    if (this.confirm_password === '' || this.confirm_password !== this.change_password) {
      alert('Different password');
      return;
    }
    if (!RegExp('^[0-9]{10,11}$').test(this.change_profile.phone_number)) {
      alert('Phone number Form: 01012345678');
      return;
    }
    this.change_profile.password = this.change_password;
    if(this.email_check && this.before_email === this.change_profile.email) {
      this.profileService.updateProfile(this.change_profile).then(data => {
        this.profileService.signIn(this.change_profile.username, this.change_profile.password).then(response => {
          if (response.status === 202) {
            sessionStorage.setItem('logged in user', JSON.stringify(this.change_profile));
            this.loggedInUser = this.change_profile;
            alert('Update successfully');
            return;
          }
        });
      }).catch(e => {
          alert('Update Error');
          console.log(e.status);
          return;
      });
      return;
    }

    this.email_check = false;
    alert('Check validation of your email first');
    return;
  }

  checkEmail(): void {
    if (!RegExp('^[^\\s@]\\w+@\\w+((.[a-z]{2,3})|(.[a-z]{2}.[a-z]{2}))$').test(this.change_profile.email)) {
      alert('Email Form: id@domain.co.kr(com)');
      return;
    }
    this.profileService.getProfiles().then(
      data => {
        this.profileList = data;

        for (let i in this.profileList) {
          if (this.profileList[i].username === this.change_profile.email && this.profileList[i].id !== this.change_profile.id) {
            alert('There is a same email');
            return;
          }
        }

        this.before_email = this.change_profile.email;
        this.email_check = true;
        alert('This is a valid email');
        return;
      })
  }

  deleteProfile(): void {
    this.profileService.deleteProfile(this.loggedInUser.id).then(response => {
      if (response.status === 204) {
        sessionStorage.clear();
        this.router.navigate(['/']).then();
        this.appComponent.isLogin = false;
        alert('Delete Successfully');
        return;
      }
    }).catch(e => {
        alert('Delete User Error');
        console.log(e.status);
        return;
      });
  }

  getGPRegisters(): History[] {
    let history: History[] = [];
    this.gpService.getGPRegisters().then(data => {
      for(let i in data) {
        if(data[i].customer === this.loggedInUser.id) {
          this.gpService.getGPRecruitment(data[i].gp_recruitment).then(recruit => {
            this.panelService.getPanel(recruit.solar_panel).then(panel => {
              history.push({
                num_panel: data[i].num_panel,
                gp_recruitment: data[i].gp_recruitment,
                solar_panel: panel.name,
                min_panel: recruit.min_panel,
                num_requested_panel: recruit.num_requested_panel
              })
            })
          })
        }
      }
    });
    return history;
  }
}

export interface History {
  num_panel: number;
  gp_recruitment: number;
  solar_panel: string;
  min_panel: number;
  num_requested_panel: number;
};
