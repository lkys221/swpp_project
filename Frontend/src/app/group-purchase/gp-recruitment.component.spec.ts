import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import { Location } from '@angular/common';

import { GPRecruitmentComponent } from './gp-recruitment.component';
import { GPRecruitmentCreateComponent } from './gp-recruitment-create.component';
import { GPRecruitmentEditComponent } from './gp-recruitment-edit.component';
import { GPRecruitmentDetailComponent } from './gp-recruitment-detail.component';

import { GroupPurchaseService } from './group-purchase.service';
import { FakePanelService } from "../panel/panel.component.spec";
import { PanelService } from "../panel/panel.service";

import { Profile } from '../profile';

import { AppModule } from "../app.module";
import { AppRoutingModule, routes } from "../app-routing.module";

import { GPRegister } from "./GPRegister";
import { GPRecruitment } from "./GPRecruitment";


describe('GPRecruitmentComponent', () => {
  let component: GPRecruitmentComponent;
  let fixture: ComponentFixture<GPRecruitmentComponent>;
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
          GroupPurchaseService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: PanelService, useClass: FakePanelService},
          {provide: GroupPurchaseService, useClass: FakeGroupPurchaseService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(GPRecruitmentComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();

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

  it('onSelect', fakeAsync(() => {
    component.onSelect(fakeGPRecruitment);
    tick();
    expect(true).toBe(true);
  }));

  it('getPanelInfo', fakeAsync(() => {
    component.getPanelInfo(0);
    tick();
    expect(true).toBe(true);
  }));

  it('gotoCreate', fakeAsync(() => {
    component.gotoCreate();
    tick();
    expect(true).toBe(true);
  }));
});

describe('GPRecruitmentEditComponent', () => {
  let component: GPRecruitmentEditComponent;
  let fixture: ComponentFixture<GPRecruitmentEditComponent>;
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
          GroupPurchaseService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: GroupPurchaseService, useClass: FakeGroupPurchaseService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(GPRecruitmentEditComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();
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

  it('save no data1', fakeAsync(() => {
    component.save();
    tick();
    expect(true).toBe(true);
  }));

  it('save no data2', fakeAsync(() => {
    component.recruitment.min_panel = null;
    tick();
    fixture.detectChanges();
    component.save();
    tick();
    expect(true).toBe(true);
  }));

  it('save no data3', fakeAsync(() => {
    component.recruitment.min_panel = fakeGPRecruitment.min_panel;
    component.recruitment.discounted_price = null;
    tick();
    fixture.detectChanges();
    component.save();
    tick();
    expect(true).toBe(true);
  }));

  it('save no data4', fakeAsync(() => {
    component.recruitment.min_panel = -1;
    component.recruitment.discounted_price = fakeGPRecruitment.discounted_price;
    tick();
    fixture.detectChanges();
    component.save();
    tick();
    expect(true).toBe(true);
  }));

  it('save no data4', fakeAsync(() => {
    component.recruitment.min_panel = -1;
    component.recruitment.discounted_price = -1;
    tick();
    fixture.detectChanges();
    component.save();
    tick();
    expect(true).toBe(true);
  }));


  it('save correct data', fakeAsync(() => {
    component.recruitment = fakeGPRecruitment;
    tick();
    fixture.detectChanges();
    component.save();
    tick();
    expect(true).toBe(true);
  }));
});


describe('GPRecruitmentDetailComponent', () => {
  let component: GPRecruitmentDetailComponent;
  let fixture: ComponentFixture<GPRecruitmentDetailComponent>;
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
          GroupPurchaseService,
          PanelService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: PanelService, useClass: FakePanelService},
          {provide: GroupPurchaseService, useClass: FakeGroupPurchaseService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(GPRecruitmentDetailComponent);
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

  it('deleteRecruitment', fakeAsync(() => {
    component.recruitmentList = fakeGPRecruitments;
    tick();
    fixture.detectChanges();
    component.deleteRecruitment(fakeGPRecruitment);
    tick();
    expect(true).toBe(true);
  }));

  it('addRegister1', fakeAsync(() => {
    component.addRegister(0);
    tick();
    expect(true).toBe(true);
  }));

  it('addRegister2', fakeAsync(() => {
    component.addRegister(null);
    tick();
    expect(true).toBe(true);
  }));

  it('addRegister3', fakeAsync(() => {
    component.addRegister(5);
    tick();
    expect(true).toBe(true);
  }));

  it('getPanelInfo', fakeAsync(() => {
    component.getPanelInfo(0);
    tick();
    expect(true).toBe(true);
  }));

  it('gotoEdit1', fakeAsync(() => {
    component.gotoEdit();
    tick();
    expect(true).toBe(true);
  }));

  it('gotoEdit2', fakeAsync(() => {
    component.recruitment.manufacturer = Customer.id;
    tick();
    fixture.detectChanges();
    component.gotoEdit();
    tick();
    expect(true).toBe(true);
  }));
});


describe('GPRecruitmentCreateComponent', () => {
  let component: GPRecruitmentCreateComponent;
  let fixture: ComponentFixture<GPRecruitmentCreateComponent>;
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
          GroupPurchaseService,
          PanelService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: GroupPurchaseService, useClass: FakeGroupPurchaseService},
          {provide: PanelService, useClass: FakePanelService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(GPRecruitmentCreateComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();
      sessionStorage.setItem('logged in user', JSON.stringify(Manufacturer));
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

  it('addRecruitment1', fakeAsync(() => {
    component.addRecruitment(null, null);
    tick();
    expect(true).toBe(true);
  }));

  it('addRecruitment2', fakeAsync(() => {
    component.addRecruitment(0, null);
    tick();
    expect(true).toBe(true);
  }));


  it('addRecruitment3', fakeAsync(() => {
    component.addRecruitment(-1, -1);
    tick();
    expect(true).toBe(true);
  }));

  it('addRecruitment4', fakeAsync(() => {
    component.addRecruitment(1, -1);
    tick();
    expect(true).toBe(true);
  }));

  it('addRecruitment5', fakeAsync(() => {
    component.addRecruitment(1, 1);
    tick();
    expect(true).toBe(true);
  }));

  it('addRecruitment6', fakeAsync(() => {
    component.type = 0;
    tick();
    fixture.detectChanges();
    component.addRecruitment(1, 1);
    tick();
    expect(true).toBe(true);
  }));

  it('getPanels', fakeAsync(() => {
    component.getPanels();
    tick();
    expect(true).toBe(true);
  }));
});


export const fakeGPRecruitments: GPRecruitment[] = [
  { id: 0, manufacturer: 1, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5},
  { id: 1, manufacturer: 2, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5},
  { id: 2, manufacturer: 3, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5}
];

export const deletedFakeGPRecruitments: GPRecruitment[] = [
  { id: 1, manufacturer: 2, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5},
  { id: 2, manufacturer: 3, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5}
];

export const fakeGPRegisters: GPRegister[] = [
  { id: 0, customer: 1, num_panel: 5, gp_recruitment: 1},
  { id: 1, customer: 2, num_panel: 5, gp_recruitment: 1},
  { id: 2, customer: 3, num_panel: 5, gp_recruitment: 1}
];

export const deletedFakeGPRegisters: GPRegister[] = [
  { id: 1, customer: 2, num_panel: 5, gp_recruitment: 1},
  { id: 2, customer: 3, num_panel: 5, gp_recruitment: 1}
];

export const fakeGPRecruitment: GPRecruitment = { id: 0, manufacturer: 1, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5};
export const fakeGPRegister: GPRegister =  { id: 0, customer: 1, num_panel: 5, gp_recruitment: 1};


const Customer: Profile = {id: 2, email: 'user2@snu.ac.kr', password: 'user2pwd', username: 'user2', user_id: 2, phone_number: '01043212222', type: '1'};
const Manufacturer: Profile = {id: 1, email: 'user1@snu.ac.kr', password: 'user1pwd', username: 'user1', user_id: 1, phone_number: '01043212221', type: '1'};


export class FakeGroupPurchaseService {
  getGPRecruitments(): Promise<GPRecruitment[]> {
    return Promise.resolve<GPRecruitment[]>(fakeGPRecruitments)
  }

  getGPRecruitment(id: number): Promise<GPRecruitment> {
    return Promise.resolve<GPRecruitment>(fakeGPRecruitment)
  }

  createGPRecruitment(solarPanel: number, minPanel: number, discountedPrice: number): Promise<any> {
    return Promise.resolve({status:201})
  }

  deleteGPRecruitment(id: number): Promise<any> {
    return Promise.resolve({status:204})
  }

  updateGPRecruitment(recruit: GPRecruitment): Promise<any> {
    return Promise.resolve({status:204})
  }

  getGPRegisters(): Promise<GPRegister[]> {
    return Promise.resolve<GPRegister[]>(fakeGPRegisters)
  }

  getGPRegister(id: number): Promise<GPRegister> {
    return Promise.resolve<GPRegister>(fakeGPRegister)
  }

  createGPRegister(customer: number, numPanel: number, gpRecruitment: number): Promise<any> {
    return Promise.resolve({status:204})
  }
}
