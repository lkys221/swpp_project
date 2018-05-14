import 'rxjs/add/operator/switchMap';

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Profile } from '../profile';
import { Panel } from './panel';

import { ProfileService } from '../profile.service';
import { PanelService } from './panel.service';

import { backendIp } from '../../assets/backend-ip';

@Component({
  selector: 'app-panel-detail',
  templateUrl: './panel-detail.component.html',
  styleUrls: [ './panel-detail.component.css' ]
})
export class PanelDetailComponent implements OnInit {
  profile: Profile;
  manufacturer: Profile;
  panel: Panel = new Panel();
  backendIp: string;
  
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private panelService: PanelService,
  ) {}

  ngOnInit(): void {
    if(sessionStorage.getItem('logged in user')) {
      this.profile = JSON.parse(sessionStorage.getItem('logged in user'));
      this.backendIp = backendIp;
      this.getPanel();
    }
  }

  getPanel(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.panelService.getPanel(+params.get('id')))
      .subscribe(panel => {
        this.panel = panel;
        
        this.profileService
          .getProfile(this.panel.manufacturer)
          .then(profile => {
            this.manufacturer = profile;
            const editButton: HTMLInputElement = <HTMLInputElement> document.getElementById('edit_button');
            const deleteButton: HTMLInputElement = <HTMLInputElement> document.getElementById('delete_button');
  
            if(this.manufacturer.id === this.profile.id) {
              editButton.disabled = false;
              deleteButton.disabled = false;
            } else {
              editButton.disabled = true;
              deleteButton.disabled = true;
            }
          });
      });
  }

  gotoEdit(): void {
    this.router.navigate(['/panel', this.panel.id, 'edit'])
      .then(() => null);
  }

  deleteAndGoBack(): void {
    this.panelService
      .delete(this.panel.id)
      .then(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
  
  getEfficiency(efficiency: number): number {
    return Math.round(efficiency * 100000) / 1000;
  }
}
