import { Component, OnInit } from '@angular/core';
import { Profile } from './profile';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLogin: boolean;
  isSingUp = false;
  isLoginTab = true;
  profile: Profile;
  profileList: Profile[];
  loginUsername = '';
  loginPassword = '';
  email = '';
  username = '';
  password = '';
  type = '';
  phoneNumber = '';
  confirmPassword = '';
  types = [
    { value: '0', display: 'Customer' },
    { value: '1', display: 'Manufacturer' }
  ];

  constructor(
    private profileService: ProfileService,
    private router: Router
    ) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('logged in user')) {
      this.profile = JSON.parse(sessionStorage.getItem('logged in user'));
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  }

  signIn(): void {
    if (this.loginUsername === '') {
      alert('Please fill the username')
      return;
    }
    if (this.loginPassword === '') {
      alert('Please fill the password')
      return;
    }
    this.profileService.signIn(this.loginUsername, this.loginPassword).then(response => {
      if (response.status === 202) {
        this.profileService.getProfiles().then(data => {
          this.profileList = data;

          for (let i in this.profileList) {
            if (this.loginUsername === this.profileList[i].username) {
              this.profileList[i].password = this.loginPassword;
              sessionStorage.setItem('logged in user', JSON.stringify(this.profileList[i]));

              this.loginUsername = '';
              this.loginPassword = '';
              this.profile = JSON.parse(sessionStorage.getItem('logged in user'));
              this.isLogin = true;
              this.router.navigate(['/']).then();
              return;
            }
          }
        })
      }
    }).catch(e => {
      alert('Wrong Email or Password');
      console.log(e.statusText);
      return;
    })
  }

  signUp(): void {
    if (!RegExp('^[^\\s@]\\w+@\\w+((.[a-z]{2,3})|(.[a-z]{2}.[a-z]{2}))$').test(this.email)) {
      alert('Email Form: id@domain.co.kr(com)');
      return;
    }
    if (this.username === '') {
      alert('Please fill the username');
      return;
    }
    if (!RegExp('^(?=.*[0-9])(?=.*[a-z, A-Z]).{8,}$').test(this.password)) {
      alert('Password contains 8 or more characters');
      return;
    }
    if (this.confirmPassword === '' || this.confirmPassword !== this.password) {
      alert('Different password');
      return;
    }
    if (!RegExp('^[0-9]{10,11}$').test(this.phoneNumber)) {
      alert('Phone number Form: 01012345678');
      return;
    }
    if (this.type === '') {
      alert('Select Your Purpose');
      return;
    }
    this.profileService.getProfiles().then(data => {
        this.profileList = data;

        for(let i in this.profileList) {
          if(this.profileList[i].email === this.email) {
            alert('There is a same email address')
            return;
          }
          else if(this.profileList[i].username === this.username) {
            alert('There is a same username')
            return;
          }
        }
        this.profileService.signUp(this.email, this.username, this.password, this.phoneNumber, this.type).then(response => {
          if (response.status === 201) {
            this.email = '';
            this.username = '';
            this.password = '';
            this.phoneNumber = '';
            this.confirmPassword = '';
            this.type = '';
            this.isSingUp = true;
            alert('Sign Up Successfully');
            this.isLoginTab = true;
            return;
          }
        }).catch(e => {
            alert('Sign Up Error');
            console.log(e.status);
            return;
        });
    })
  }

  signOut(): void {
    this.profileService.signOut().then(
      response => {
        if (response.status === 202) {
          sessionStorage.clear();
          this.isLogin = false;
          this.router.navigate(['/']).then();
          return;
        }
      })
      .catch(e => {
        alert('Sign Out Error');
        console.log(e.statusText);
        return;
      })
  }

  gotoHomePage(): void {
    this.router.navigate(['/']).then();
  }

  gotoSimulationPage(): void {
    this.router.navigate(['/simulation']).then();
  }

  gotoCommunityPage(): void {
    this.router.navigate(['/community']).then();
  }

  gotoForumPage(): void {
    this.router.navigate(['/community/forum']).then();
  }

  gotoFAQPage(): void {
    this.router.navigate(['/community/faq']).then();
  }

  gotoPanelPage(): void {
    this.router.navigate(['/panel']).then();
  }

  gotoGroupPurchasePage(): void {
    this.router.navigate(['/gp/recruitment']).then();
  }

  gotoRegisterTab(): void {
    this.isLoginTab = false;
    this.loginUsername = '';
    this.loginPassword = '';
  }

  gotoLoginTab(): void {
    this.isLoginTab = true;
    this.email = '';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.phoneNumber = '';
    this.type = '';
  }

  gotoMyPage(): void {
    this.router.navigate(['/mypage']).then();
  }
}

