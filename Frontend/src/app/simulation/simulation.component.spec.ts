import {ComponentFixture, TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import 'rxjs/add/observable/of';

import { SimulationComponent } from "./simulation.component";

import { PanelService } from "../panel/panel.service";

import { FakePanelService } from "../panel/panel.component.spec";

import { AppModule } from "../app.module";
import { AppRoutingModule, routes } from "../app-routing.module";
import { Location } from '@angular/common';
import { Profile } from "../profile";
import { Marker } from "../simulation/simulation.component"



describe('SimulationComponent', () => {
  let component: SimulationComponent;
  let fixture: ComponentFixture<SimulationComponent>;
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
          PanelService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: PanelService, useClass: FakePanelService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(SimulationComponent);
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

  it('mapClicked', (() => {
    component.mapClicked(event);
    expect(true).toBe(true);
  }));

  it('markerDragEnd', (() => {
    component.markerDragEnd(m, event);
    expect(true).toBe(true);
  }));

  it('geoCoding', (() => {
    component.geoCoding();
    expect(true).toBe(true);
  }));

  it('chartClicked', (() => {
    component.chartClicked(event);
    expect(true).toBe(true);
  }));

  it('chartHovered', (() => {
    component.chartHovered(event);
    expect(true).toBe(true);
  }));

  it('simulate', (() => {
    component.markerLat = 37.5;
    component.markerLng = 127;
    fixture.detectChanges();
    component.simulate();
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

const event = {
  coords: {
    lat: 37,
    lng: 127
  }
};
const m: Marker = {
  lat: 37,
  lng: 127,
  draggable: true
}
