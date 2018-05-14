import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppModule } from './app.module';
import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileService } from './profile.service';
import { Profile } from './profile';
import { Location } from '@angular/common';
import { isUndefined } from 'util';
import {promised} from "q";

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let element: Element;
let router: Router;
let location: Location;

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        imports: [
          AppRoutingModule
        ],
        providers: [
          ProfileService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: ProfileService, useClass: FakeProfileService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        element = new Element();
      });
    });
  }));

  it('can instantiate it', () => {
    expect(component).not.toBeNull();
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should show Login Page when not login`, (() => {
    let loginPageTitle = fixture.debugElement.query(By.css('h1'));
    let loginPageTitleEle: HTMLElement = loginPageTitle.nativeElement;
    expect(loginPageTitleEle.textContent).toBe('SNULAR');
  }));


  it(`should fail register when type nothing in username`, fakeAsync(() => {
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = profile1.email;
    element.usernameInput.value = null;
    element.emailInput.dispatchEvent(new Event('input'));
    element.usernameInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(false);
  }));

  it(`should fail register when type a wrong email`, fakeAsync(() => {
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = 'wrongEmail';
    element.emailInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(false);
  }));

  it(`should fail register when type a wrong password`, fakeAsync(() => {
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = profile1.email;
    element.usernameInput.value = profile1.username;
    element.phoneNumberInput.value = profile1.phone_number;
    element.passwordInput.value = null;
    element.emailInput.dispatchEvent(new Event('input'));
    element.usernameInput.dispatchEvent(new Event('input'));
    element.passwordInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(false);
  }));

  it(`should fail register when type a wrong confirm password`, fakeAsync(() => {
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = profile1.email;
    element.usernameInput.value = profile1.username;
    element.passwordInput.value = profile1.password;
    element.confirmPasswordInput.value = 'different';
    element.emailInput.dispatchEvent(new Event('input'));
    element.usernameInput.dispatchEvent(new Event('input'));
    element.passwordInput.dispatchEvent(new Event('input'));
    element.confirmPasswordInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(false);
  }));

  it(`should fail register when type a wrong phone number`, fakeAsync(() => {
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = profile1.email;
    element.usernameInput.value = profile1.username;
    element.passwordInput.value = profile1.password;
    element.confirmPasswordInput.value = profile1.password;
    element.phoneNumberInput.value = null;
    element.emailInput.dispatchEvent(new Event('input'));
    element.usernameInput.dispatchEvent(new Event('input'));
    element.passwordInput.dispatchEvent(new Event('input'));
    element.confirmPasswordInput.dispatchEvent(new Event('input'));
    element.phoneNumberInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(false);
  }));

  it(`should fail register when do not select a purpose`, fakeAsync(() => {
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = profile1.email;
    element.usernameInput.value = profile1.username;
    element.passwordInput.value = profile1.password;
    element.confirmPasswordInput.value = profile1.password;
    element.phoneNumberInput.value = profile1.phone_number;
    element.emailInput.dispatchEvent(new Event('input'));
    element.usernameInput.dispatchEvent(new Event('input'));
    element.passwordInput.dispatchEvent(new Event('input'));
    element.confirmPasswordInput.dispatchEvent(new Event('input'));
    element.phoneNumberInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(false);
  }));

  it(`should fail register when type a already existed email`, fakeAsync(() => {
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = profile1.email;
    element.usernameInput.value = profile1.username;
    element.phoneNumberInput.value = profile1.phone_number;
    element.passwordInput.value = profile1.password;
    element.confirmPasswordInput.value = profile1.password;
    component.type = '0'
    element.emailInput.dispatchEvent(new Event('input'));
    element.usernameInput.dispatchEvent(new Event('input'));
    element.phoneNumberInput.dispatchEvent(new Event('input'));
    element.passwordInput.dispatchEvent(new Event('input'));
    element.confirmPasswordInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    element.registerSubmitButton.dispatchEvent(new Event('click'));
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(false);
  }));

  it(`should fail register when type a already existed username`, fakeAsync(() => {
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = profile2.email;
    element.usernameInput.value = profile1.username;
    element.phoneNumberInput.value = profile1.phone_number;
    element.passwordInput.value = profile1.password;
    element.confirmPasswordInput.value = profile1.password;
    component.type = '0'
    element.emailInput.dispatchEvent(new Event('input'));
    element.usernameInput.dispatchEvent(new Event('input'));
    element.phoneNumberInput.dispatchEvent(new Event('input'));
    element.passwordInput.dispatchEvent(new Event('input'));
    element.confirmPasswordInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    element.registerSubmitButton.dispatchEvent(new Event('click'));
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(false);
  }));

  it(`should success register when type a correct register form`, fakeAsync(() => {
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = 'user4@snu.ac.kr';
    element.usernameInput.value = 'user4';
    element.phoneNumberInput.value = '01044445555';
    element.passwordInput.value = 'user4pwd';
    element.confirmPasswordInput.value = 'user4pwd';
    component.type = '1';
    element.emailInput.dispatchEvent(new Event('input'));
    element.usernameInput.dispatchEvent(new Event('input'));
    element.phoneNumberInput.dispatchEvent(new Event('input'));
    element.passwordInput.dispatchEvent(new Event('input'));
    element.confirmPasswordInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    element.registerSubmitButton.dispatchEvent(new Event('click'));
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(true);
  }));


  it(`should fail login when type a empty username`, fakeAsync(() => {
    element.loginUsernameInput.value = null;
    element.loginPasswordInput.value = null;
    element.loginUsernameInput.dispatchEvent(new Event('input'));
    element.loginPasswordInput.dispatchEvent(new Event('input'));
    element.loginSubmitButton.click();
    element.loginSubmitButton.dispatchEvent(new Event('click'));
    tick();
    fixture.detectChanges();
    expect(component.isLogin).toBe(false);
  }));

  it(`should fail login when type a empty password input`, fakeAsync(() => {
    element.loginUsernameInput.value = profile1.username;
    element.loginPasswordInput.value = null;
    element.loginUsernameInput.dispatchEvent(new Event('input'));
    element.loginPasswordInput.dispatchEvent(new Event('input'));
    element.loginSubmitButton.click();
    element.loginSubmitButton.dispatchEvent(new Event('click'));
    tick();
    fixture.detectChanges();
    expect(component.isLogin).toBe(false);
  }));

  it(`should fail login when type a wrong user data`, fakeAsync(() => {
    element.loginUsernameInput.value = 'anony';
    element.loginPasswordInput.value = 'anonypwd';
    element.loginUsernameInput.dispatchEvent(new Event('input'));
    element.loginPasswordInput.dispatchEvent(new Event('input'));
    element.loginSubmitButton.click();
    element.loginSubmitButton.dispatchEvent(new Event('click'));
    tick();
    fixture.detectChanges();
    expect(component.isLogin).toBe(false);
  }));

  it(`should fail login when type a correct user data`, fakeAsync(() => {
    element.loginUsernameInput.value = profile1.username;
    element.loginPasswordInput.value = profile1.password;
    element.loginUsernameInput.dispatchEvent(new Event('input'));
    element.loginPasswordInput.dispatchEvent(new Event('input'));
    element.loginSubmitButton.click();
    element.loginSubmitButton.dispatchEvent(new Event('click'));
    tick();
    fixture.detectChanges();
    expect(component.isLogin).toBe(true);
  }));
});

describe('AppComponent (error handling)', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        imports: [
          AppRoutingModule
        ],
        providers: [
          ProfileService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: ProfileService, useClass: FakeErrorProfileService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        element = new Element();
      });
    });
  }));

  it(`should fail login when signIn return bad response`, fakeAsync(() => {
    component.isLogin = false;
    tick();
    fixture.detectChanges();
    element = new Element();
    element.loginUsernameInput.value = profile1.username;
    element.loginPasswordInput.value = profile1.password;
    element.loginUsernameInput.dispatchEvent(new Event('input'));
    element.loginPasswordInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.loginSubmitButton.click();
    tick();
    fixture.detectChanges();
    expect(component.isLogin).toBe(false);
  }));

  it(`should fail logout when signIn return bad response`, fakeAsync(() => {
    component.isLogin = true;
    component.signOut();
    tick();
    fixture.detectChanges();
    expect(component.isLogin).toBe(true);
  }));

  it(`should fail login when signUp return bad response`, fakeAsync(() => {
    component.isLogin = false;
    tick();
    fixture.detectChanges();
    element = new Element();
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.emailInput.value = profile2.email;
    element.usernameInput.value = profile2.username;
    element.phoneNumberInput.value = profile2.phone_number;
    element.passwordInput.value = profile2.password;
    element.confirmPasswordInput.value = profile2.password;
    component.type = '1';
    element.emailInput.dispatchEvent(new Event('input'));
    element.usernameInput.dispatchEvent(new Event('input'));
    element.phoneNumberInput.dispatchEvent(new Event('input'));
    element.passwordInput.dispatchEvent(new Event('input'));
    element.confirmPasswordInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    element.registerSubmitButton.click();
    element.registerSubmitButton.dispatchEvent(new Event('click'));
    tick();
    fixture.detectChanges();
    expect(component.isSingUp).toBe(false);
  }));

  it(`should go login page when click login button`, fakeAsync(() => {
    component.isLogin = false;
    tick();
    fixture.detectChanges();
    element = new Element();
    element.registerTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    element.loginTab.click();
    tick();
    fixture.detectChanges();
    element = new Element();
    expect(isUndefined(element.emailInput)).toBe(true);
  }));

});

describe('AppComponent for Routing', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        imports: [
          AppRoutingModule
        ],
        providers: [
          ProfileService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: ProfileService, useClass: FakeProfileService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        element = new Element();
      });
    });
  }));

  it(`should go to Home Page when click home tab`, fakeAsync(() => {
    component.isLogin = true;
    tick();
    fixture.detectChanges();
    component.gotoHomePage();
    tick();
    expect(location.path()).toEqual('/');
  }));

  it(`should go to Simulation Page when click simulation tab`, fakeAsync(() => {
    component.isLogin = true;
    tick();
    fixture.detectChanges();
    component.gotoSimulationPage();
    tick();
    expect(location.path()).toEqual('/simulation');
  }));

  it(`should go to Community Page when click community tab`, fakeAsync(() => {
    component.isLogin = true;
    tick();
    fixture.detectChanges();
    component.gotoCommunityPage();
    tick();
    expect(location.path()).toEqual('/community');
  }));

  it(`should go to Panel Page when click panel tab`, fakeAsync(() => {
    component.isLogin = true;
    tick();
    fixture.detectChanges();
    component.gotoPanelPage();
    tick();
    expect(location.path()).toEqual('/panel');
  }));

  it(`should go to My Page when click my account tab`, fakeAsync(() => {
    component.isLogin = true;
    tick();
    fixture.detectChanges();
    component.gotoMyPage();
    tick();
    expect(location.path()).toEqual('/mypage');
  }));

  it(`should success logout when click logout tab`, fakeAsync(() => {
    component.isLogin = true;
    tick();
    fixture.detectChanges();
    component.signOut();
    tick();
    expect(component.isLogin).toBe(false);
  }));
});

class Element {
  loginTab: HTMLElement;
  registerTab: HTMLElement;
  emailInput: HTMLInputElement;
  usernameInput: HTMLInputElement;
  phoneNumberInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  confirmPasswordInput: HTMLInputElement;
  registerSubmitButton: HTMLElement;
  loginUsernameInput: HTMLInputElement;
  loginPasswordInput: HTMLInputElement;
  loginSubmitButton: HTMLElement;

  constructor() {
    if (fixture.debugElement.query(By.css('#login_tab'))) {
      this.loginTab = fixture.debugElement.query(By.css('#login_tab')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#register_tab'))) {
      this.registerTab = fixture.debugElement.query(By.css('#register_tab')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#email'))) {
      this.emailInput = fixture.debugElement.query(By.css('#email')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#username'))) {
      this.usernameInput = fixture.debugElement.query(By.css('#username')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#phone_number'))) {
      this.phoneNumberInput = fixture.debugElement.query(By.css('#phone_number')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#password'))) {
      this.passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#confirm_password'))) {
      this.confirmPasswordInput = fixture.debugElement.query(By.css('#confirm_password')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#register_submit'))) {
      this.registerSubmitButton = fixture.debugElement.query(By.css('#register_submit')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#login_username'))) {
      this.loginUsernameInput = fixture.debugElement.query(By.css('#login_username')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#login_password'))) {
      this.loginPasswordInput = fixture.debugElement.query(By.css('#login_password')).nativeElement;
    }
    if (fixture.debugElement.query(By.css('#login_submit'))) {
      this.loginSubmitButton = fixture.debugElement.query(By.css('#login_submit')).nativeElement;
    }
  };
}

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

const fakeProfiles: Profile[] = [
  profile1,
  profile2,
  profile3
];


export class FakeProfileService {
  getProfile(): Promise<Profile> {
    return Promise.resolve<Profile>(fakeProfiles[0]);
  }
  getProfiles(): Promise<Profile[]> {
    return Promise.resolve<Profile[]>(fakeProfiles);
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
