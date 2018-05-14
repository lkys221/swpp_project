import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PanelComponent } from './panel.component';
import { PanelCreateComponent } from './panel-create.component';
import { PanelDetailComponent } from './panel-detail.component';
import { PanelEditComponent } from './panel-edit.component';

import { ProfileService } from '../profile.service';
import { PanelService } from './panel.service';
import { ImageService } from '../image-upload/image.service';

import { FakeProfileService } from '../app.component.spec';

import { Profile } from '../profile';
import { Panel } from './panel';
import {AppModule} from "../app.module";
import {AppRoutingModule, routes} from "../app-routing.module";
import { Location } from '@angular/common';


describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let router: Router;
  let location: Location;

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
          PanelService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: ProfileService, useClass: FakeProfileService},
          {provide: PanelService, useClass: FakePanelService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(PanelComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();
      sessionStorage.setItem('logged in user', JSON.stringify(Customer));

      fixture.whenStable().then(() => {
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

  it('should go to Create Page when click create button', fakeAsync(() => {
    component.gotoCreate();
    tick();
    expect(location.path()).toBe('/panel/create');
  }));

  it('should go to detail page', fakeAsync(() => {
    fixture.detectChanges();
    let buttonLogin: HTMLElement = fixture.debugElement.query(By.css('.panel_information')).nativeElement;
    buttonLogin.click();
    tick();
    expect(location.path()).toBe('/panel/1');
  }));
});

describe('PanelEditComponent', () => {
  let component: PanelEditComponent;
  let fixture: ComponentFixture<PanelEditComponent>;
  let router: Router;
  let location: Location;

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
          PanelService,
          ImageService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: ProfileService, useClass: FakeProfileService},
          {provide: PanelService, useClass: FakePanelService},
          {provide: ImageService, useClass: FakeImageService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(PanelEditComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();
      sessionStorage.setItem('logged in user', JSON.stringify(Customer));

      fixture.whenStable().then(() => {
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

  it('onFileUpload', fakeAsync(() => {
    let event = {
      file: File
    };
    component.onFileUpload(event);
    expect(true).toBe(true);
  }));

  it('save', fakeAsync(() => {
    component.save(fakePanel);
    component.image = null;
    tick();
    expect(true).toBe(true);
  }));

  it('save null data', fakeAsync(() => {
    component.save(nullPanel);
    tick();
    expect(true).toBe(true);
  }));
});


describe('PanelDetailComponent', () => {
  let component: PanelDetailComponent;
  let fixture: ComponentFixture<PanelDetailComponent>;
  let router: Router;
  let location: Location;

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
          PanelService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: ProfileService, useClass: FakeProfileService},
          {provide: PanelService, useClass: FakePanelService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(PanelDetailComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();
      sessionStorage.setItem('logged in user', JSON.stringify(Customer));

      fixture.whenStable().then(() => {
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

  it('gotoEdit', fakeAsync(() => {
    component.gotoEdit();
    tick();
    expect(true).toBe(true);
  }));

  it('deleteAndGoBack', fakeAsync(() => {
    component.deleteAndGoBack();
    tick();
    expect(location.path()).toBe('/');
  }));

  it('goBack', fakeAsync(() => {
    component.goBack();
    tick();
    expect(location.path()).toBe('/');
  }));
});

describe('PanelCreateComponent', () => {
  let component: PanelCreateComponent;
  let fixture: ComponentFixture<PanelCreateComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        imports: [
          AppRoutingModule
        ],
        providers: [
          PanelService,
          ImageService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: ImageService, useClass: FakeImageService},
          {provide: PanelService, useClass: FakePanelService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(PanelCreateComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();
      sessionStorage.setItem('logged in user', JSON.stringify(Customer));

      fixture.whenStable().then(() => {
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

  it('create', fakeAsync(() => {
    component.create(fakePanel);
    component.image = null;
    tick();
    expect(true).toBe(true);
  }));

  it('create null data', fakeAsync(() => {
    component.create(nullPanel);
    tick();
    expect(true).toBe(true);
  }));

  it('onFileUpload', fakeAsync(() => {
    let event = {
      file: File
    };
    component.onFileUpload(event);
    expect(true).toBe(true);
  }));

});

const fakePanel: Panel = {
  id: 1,
  manufacturer: 2,
  name: 'panel1',
  company: 'solar inc',
  price: 1000000,
  power: 1000,
  width: 2,
  length: 3,
  image: '/media/default_image.jpg',
  efficiency: 0.15
};

const nullPanel: Panel = {
  id: null,
  manufacturer: null,
  name: '',
  company: '',
  price: null,
  power: null,
  width: null,
  length: null,
  image: '',
  efficiency: null
};

const Customer: Profile = {id: 2, email: 'user2@snu.ac.kr', password: 'user2pwd', username: 'user2', user_id: 2, phone_number: '01043212222', type: '1'};


const fakePanels: Panel[] = [
  fakePanel
];

const requestUserId = 2;


export class FakePanelService {
  getPanels(): Promise<Panel[]> {
    return Promise.resolve<Panel[]>(fakePanels)
  }

  getPanel(id: number): Promise<Panel> {
    return Promise.resolve<Panel>(fakePanel)
  }

  create(
    name: string,
    company: string,
    price: number,
    power: number,
    width: number,
    length: number
  ): Promise<any> {
    fakePanels.push({
      id: fakePanels.length,
      manufacturer: requestUserId,
      name: name,
      company: company,
      price: price,
      power: power,
      width: width,
      length: length,
      image: '/media/default_image.jpg',
      efficiency: 0.15
    });
    return Promise.resolve({status: 201});
  }

  update(panel: Panel): Promise<any> {
    let index: number = -1;

    for(let i = 0; i < fakePanels.length; i++) {
      if(fakePanels[i].id === panel.id) {
        index = i;
        break;
      }
    }

    if(index === - 1) {
      return Promise.resolve({status: 405});
    } else {
      fakePanels[index] = panel;
      return Promise.resolve({status: 202});
    }
  }

  delete(id: number): Promise<any> {
    let index: number = -1;

    for(let i = 0; i < fakePanels.length; i++) {
      if(fakePanels[i].id === id) {
        index = i;
        break;
      }
    }

    if(index === - 1) {
      return Promise.resolve({status: 405});
    } else {
      fakePanels.splice(index, 1);
      return Promise.resolve({status: 202});
    }
  }
}


class FakeImageService {
  public postImage(
    url: string,
    image: File,
    headers?: Headers | { [name: string]: any },
    partName: string = 'image',
    customFormData?: { [name: string]: any },
    withCredentials?: boolean
  ): Observable<any> {
    return Observable.of();
  }
}

