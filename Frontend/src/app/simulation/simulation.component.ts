import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

import { BaseChartDirective } from 'ng2-charts';

import { Profile } from '../profile';
import { Panel } from '../panel/panel';

import { PanelService } from '../panel/panel.service';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {
  profile: Profile;
  panels: Panel[];
  selectedPanel: Panel = new Panel();
  selectedPanelId: number;

  zoom = 12;

  lat = 37.53984;
  lng = 126.9899264;

  markerLat = 37.53984;
  markerLng = 126.9899264;

  markers: Marker[] = [
    {
      lat: this.lat,
      lng: this.lng,
      draggable: true
    }
  ];

  clickAddress: Object;
  address: Object;

  operationPeriod: number = 10;
  interest: number = 5;
  powerGeneration: number = 4.824250941 * 2 / 3;

  paybackPeriod: String = '5 years';
  totalReturn: number = 10000;

  @ViewChild("baseChart")
  chart: BaseChartDirective;

  chartData: Array<any> = [{data: [-10000, -8000, -6000, -4000, -2000, 0, 2000, 4000, 6000, 8000, 10000], label: 'Future Worth'}];
  chartLabel: Array<any>;
  chartOptions: any = {responsive: true};
  chartColors: Array<any> = [{
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#ffffff',
    pointHoverBackgroundColor: '#ffffff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];
  chartLegend: boolean = true;
  chartType: string = 'line';

constructor(
    private http: Http,
    private panelService: PanelService
  ) {}

  ngOnInit() {
    if(sessionStorage.getItem('logged in user')) {
      this.profile = JSON.parse(sessionStorage.getItem('logged in user'));
      this.getPanels();

      this.chartLabel = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    }
    // alert("Location based simulation service will be coming soon.")
  }

  getPanels(): void {
    this.panelService
      .getPanels()
      .then(panels => {
        this.panels = panels;
      });
  }

  mapClicked($event: any) {
    this.markerLat = $event.coords.lat;
    this.markerLng = $event.coords.lng;
    this.markers[0].lat = $event.coords.lat;
    this.markers[0].lng = $event.coords.lng;
    this.updateClickAddress();
  }

  markerDragEnd(m: Marker, $event: any) {
    this.markerLat = $event.coords.lat;
    this.markerLng = $event.coords.lng;
    this.updateClickAddress();
  }

  updateClickAddress() {
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='
      + this.markerLat + ',' + this.markerLng + '&key=AIzaSyCkOAPFN24SeSXu4gMI54ENUQPFCtC6viM')
      .toPromise()
      .then(response => {
        this.clickAddress = response.json()['results'][1]['formatted_address'];
      })
  }

  geoCoding(): void {
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
      this.address +
      '&key=AIzaSyCOkT2j5NNQ5EmVF9iWQG-lO9mBJ6iCdgQ').toPromise()
      .then(response => {
        this.markerLat = response.json()['results']['0']['geometry']['location']['lat'];
        this.markerLng = response.json()['results']['0']['geometry']['location']['lng'];
        this.markers[0].lat = response.json()['results']['0']['geometry']['location']['lat'];
        this.markers[0].lng = response.json()['results']['0']['geometry']['location']['lng'];
        this.lat = response.json()['results']['0']['geometry']['location']['lat'];
        this.lng = response.json()['results']['0']['geometry']['location']['lng'];

        this.zoom = 16;
        this.updateClickAddress();
      })
  }


  chartClicked(event:any):void {
    console.log(event);
  }

  chartHovered(event:any):void {
    console.log(event);
  }

  simulate(): void {
    if(!(this.markerLat >= 37.4 && this.markerLat <= 37.7 && this.markerLng >= 126.8 && this.markerLng <=127.2)) {
      alert("Marker is not in Seoul.");
      return;
    }
    for(let i = 0; i < this.panels.length; i++) {
      if(this.selectedPanelId == this.panels[i].id) {
        this.selectedPanel = this.panels[i];
        break;
      }
    }
    this.makeData();
  }

  makeData(): void {
    let dataSet: number[] = new Array<number>();
    let dataLabel: string[] = new Array<string>();
    let annualProfit: number = 200 * this.powerGeneration * this.getAnnualCoefficient() *
      this.selectedPanel.efficiency * this.selectedPanel.width * this.selectedPanel.length;

    dataSet.push(-(this.selectedPanel.price));
    dataLabel.push('0');

    for(let i = 1; i < Number(this.operationPeriod) + 1; i++) {
      dataSet.push(dataSet[i - 1] * (1 + Number(this.interest) / 100) + annualProfit);
      dataLabel.push(i + '');
    }

    for(let i = 0; i < Number(this.operationPeriod) + 1; i++) {
      if(dataSet[i] >= 0) {
        if(i == 0) {
          this.paybackPeriod = '0 year';
        } else {
          let paybackPeriod = i - 1 - dataSet[i - 1] / (dataSet[i] - dataSet[i - 1]);
          this.paybackPeriod = Math.round(paybackPeriod * 100) / 100 + ' years';
        }
        break;
      }
      this.paybackPeriod = 'More then ' + this.operationPeriod + ' years'
    }

    this.chartData = [{data: dataSet, label: 'Future Worth'}];
    this.chartLabel = dataLabel;
    this.totalReturn = Math.round(dataSet[Number(this.operationPeriod)] / Math.pow(1 + Number(this.interest) / 100, Number(this.operationPeriod)));

    setTimeout(() => {
      this.chart.ngOnDestroy();
      this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
    }, 10);
  }

  getAnnualCoefficient(): number {
    let realInterest: number = Math.pow(1 + Number(this.interest) / 100, 1 / 365);
    return (Math.pow(realInterest, 365) - 1) / (realInterest - 1);
  }
}

export interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
