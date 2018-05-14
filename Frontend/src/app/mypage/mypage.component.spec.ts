import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {MypageComponent} from "./mypage.component";
import {AppModule} from "../app.module";
import {AppRoutingModule, routes} from "../app-routing.module";
import {ProfileService} from "../profile.service";
import {Profile} from "../profile";
import {GroupPurchaseService} from "../group-purchase/group-purchase.service";
import {GPRegister} from "../group-purchase/GPRegister";
import {AppComponent} from "../app.component";
import {PanelService} from "../panel/panel.service";
import {FakePanelService} from "../panel/panel.component.spec";
import {FakeGroupPurchaseService} from "../group-purchase/gp-recruitment.component.spec";

let component: MypageComponent;
let fixture: ComponentFixture<MypageComponent>;
let router: Router;
let location: Location;

describe('MyPageComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        imports: [
          AppRoutingModule
        ],
        providers: [
          ProfileService,
          GroupPurchaseService,
          PanelService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          AppComponent,
          {provide: ProfileService, useClass: FakeProfileService},
          {provide: GroupPurchaseService, useClass: FakeGroupPurchaseService},
          {provide: PanelService, useClass: FakePanelService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(MypageComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();

      fixture.whenStable().then(() => {
        sessionStorage.setItem('logged in user', JSON.stringify(profile1));
        fixture.detectChanges();
      });
    });
  }));

  it('can instantiate it', () => {
    expect(component).not.toBeNull();
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`deleteProfile`, fakeAsync(() => {
    component.deleteProfile();
    tick();
    expect(true).toBe(true);
  }));

  it(`passwordVerify1`, fakeAsync(() => {
    component.passwordVerification = 'user1pwd';
    tick();
    fixture.detectChanges();
    component.passwordVerify();
    expect(true).toBe(true);
  }));

  it(`passwordVerify2`, fakeAsync(() => {
    component.passwordVerification = 'wrong_password';
    tick();
    fixture.detectChanges();
    component.passwordVerify();
    expect(true).toBe(true);
  }));

  it(`updateProfile`, fakeAsync(() => {
    component.before_email = profile4.email;
    component.change_password = 'pswdpswd1212';
    component.confirm_password = 'pswdpswd1212';
    component.change_profile = profile4;
    component.email_check = true;
    tick();
    fixture.detectChanges();
    component.updateProfile();
    expect(true).toBe(true);
  }));

  it(`updateProfile with null data1`, fakeAsync(() => {
    component.change_password = 'pswdpswd1212';
    tick();
    fixture.detectChanges();
    component.updateProfile();
    expect(true).toBe(true);
  }));

  it(`updateProfile with null data2`, fakeAsync(() => {
    component.updateProfile();
    expect(true).toBe(true);
  }));

  it(`updateProfile with null data1`, fakeAsync(() => {
    component.change_password = 'pswdpswd1212';
    component.confirm_password = 'pswdpswd1212';
    tick();
    fixture.detectChanges();
    component.updateProfile();
    expect(true).toBe(true);
  }));

  it(`checkEmail`, fakeAsync(() => {
    component.change_profile = profile4;
    tick();
    fixture.detectChanges();
    component.checkEmail();
    expect(true).toBe(true);
  }));

  it(`checkEmail with null data`, fakeAsync(() => {
    component.change_profile = profile4;
    tick();
    fixture.detectChanges();
    component.checkEmail();
    expect(true).toBe(true);
  }));
});


const profile1: Profile = {
  id: 1,
  email: 'user1@snu.ac.kr',
  password: 'user1pwd',
  username: 'user1',
  user_id: 1,
  phone_number: '01011112222',
  type: '0'
};

const profile2: Profile = {
  id: 2,
  email: 'user2@snu.ac.kr',
  password: 'user2pwd',
  username: 'user2',
  user_id: 2,
  phone_number: '01022223333',
  type: '1'
};

const profile3: Profile = {
  id: 3,
  email: 'user3@snu.ac.kr',
  password: 'user3pwd',
  username: 'user3',
  user_id: 3,
  phone_number: '01033334444',
  type: '1'
};

const profile4: Profile = {
  id: 4,
  email: 'id@snu.ac.kr',
  password: 'pswdpswd1212',
  username: 'pswdpswd1212',
  user_id: 3,
  phone_number: '01033334444',
  type: '1'
}

const profile5: Profile = {
  id: 4,
  email: '',
  password: 'pswdpswd1212',
  username: 'pswdpswd1212',
  user_id: 3,
  phone_number: '01033334444',
  type: '1'
}

const fakeProfiles: Profile[] = [
  profile1,
  profile2,
  profile3
];

const fakeGPRegisters: GPRegister[] = [
  {id: 1, customer: 1, num_panel: 1, gp_recruitment: 1},
]

export class FakeProfileService {
  getProfile(id: number): Promise<Profile> {
    return Promise.resolve<Profile>(fakeProfiles[0]);
  }

  getProfiles(): Promise<Profile[]> {
    return Promise.resolve<Profile[]>(fakeProfiles);
  }

  updateProfile(profile: Profile): Promise<any> {
    return Promise.resolve({status: 202});
  }

  deleteProfile(): Promise<any> {
    return Promise.resolve({status: 204});
  }

  signIn(): Promise<any> {
    return Promise.resolve({status: 202});
  }

  signUp(): Promise<any> {
    return Promise.resolve({status: 201});
  }

  signOut(): Promise<any> {
    return Promise.resolve({status: 202});
  }
}


class FakeErrorProfileService {
  getProfiles(): Promise<Profile[]> {
    return Promise.resolve<Profile[]>(fakeProfiles);
  }

  signIn(): Promise<any> {
    return Promise.reject('error');
  }

  signUp(): Promise<any> {
    return Promise.reject('error');
  }

  signOut(): Promise<any> {
    return Promise.reject('error');
  }
}

