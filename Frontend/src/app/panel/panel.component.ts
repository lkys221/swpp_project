import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Profile } from '../profile';
import { Panel } from './panel';

import { ProfileService } from '../profile.service';
import { PanelService } from './panel.service';

import { backendIp } from '../../assets/backend-ip'


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  profile: Profile;
  profiles: Profile[] = [];
  panels: Panel[] = [];
  selectedPanel: Panel;
  backendIp: string;
  
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private panelService: PanelService
  ) {}

  ngOnInit() {
    const createButton: HTMLInputElement = <HTMLInputElement> document.getElementById('create_button');
    const notManuNotice: HTMLElement = document.getElementById('not_manu_notice');
    
    if(sessionStorage.getItem('logged in user')) {
      this.profile = JSON.parse(sessionStorage.getItem('logged in user'));
      this.backendIp = backendIp;
      this.getProfiles();
      this.getPanels();
    }
    
    if(this.profile.type === '1') {
      createButton.disabled = false;
    } else {
      createButton.disabled = true;
      notManuNotice.innerText = 'You have to be a manufacturer to register new Solar Panel.';
    }
  }

  getProfiles(): void {
    this.profileService
      .getProfiles()
      .then(panels => {
        this.profiles = panels;
      });
  }

  getPanels(): void {
    this.panelService
      .getPanels()
      .then(panels => {
        this.panels = panels;
      });
  }
  
  getEfficiency(efficiency: number): number {
    return Math.round(efficiency * 100000) / 1000;
  }

  gotoCreate(): void {
    this.router.navigate(['/panel/create'])
      .then(() => null);
  }

  onSelectAndGotoDetail(panel: Panel): void {
    this.selectedPanel = panel;
    this.router.navigate(['/panel', this.selectedPanel.id])
      .then(() => null);
  }
}
