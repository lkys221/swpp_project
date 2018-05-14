import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GroupPurchaseService } from "./group-purchase.service";
import { PanelService } from "../panel/panel.service";

import { GPRecruitment } from "./GPRecruitment";
import { Profile } from "../profile";
import { Panel } from "../panel/panel";

@Component({
  selector: 'gp-recruitment-create',
  templateUrl: './gp-recruitment-create.component.html',
  styleUrls: ['./gp-recruitment-edit.component.css']
})
export class GPRecruitmentCreateComponent implements OnInit {
  recruitment: GPRecruitment = {id:0, manufacturer:null, solar_panel:null, min_panel:0, discounted_price: 0, num_requested_panel: 0};
  recruitmentList: GPRecruitment[];
  panelsList: Panel[];
  loggedInUser: Profile;
  minNum: number = null;
  discountedPrice: number = null;
  type = null;
  types = [];
  status = 0;

  constructor(
    private router: Router,
    private gpService: GroupPurchaseService,
    private panelService: PanelService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('logged in user'));
    this.getRecruitments();
    this.panelService.getPanels().then(
      data => {
        for(let i in data) {
          if(this.loggedInUser.id === data[i].manufacturer) {
            this.types.push({'value': data[i].id, 'display': data[i].name});
          }
        }
      }
    )

  }

  getRecruitments(): void {
    this.status = 1;
    this.gpService.getGPRecruitments().then(rec => this.recruitmentList = rec);
  }

  addRecruitment(minPanel: number, discountedPrice: number): void {
    this.status = 2;
    if (!minPanel) {
      alert('type in minimum number of panels');
      return;
    }
    if (!discountedPrice) {
      alert('type in discounted price');
      return;
    }
    if (minPanel <= 0) {
      alert('minimum number of panel should be greater than 0');
      return;
    }
    if (discountedPrice <= 0) {
      alert('discounted price should be greater than 0');
      return;
    }
    if (this.loggedInUser.type !== '1') {
      alert('Only manufacturers can recruit');
      return;
    }
    if (this.type == '' || this.type == null) {
      alert('choose a panel');
      return;
    }
    if (!RegExp('^[0-9]+$').test(String(this.minNum))) {
      alert('Please type in number');
      return;
    }
    if (!RegExp('^[0-9]+$').test(String(this.discountedPrice))) {
      alert('Please type in number');
      return;
    }
    this.gpService.createGPRecruitment(this.type, minPanel, discountedPrice).then();
    this.router.navigate(['/gp/recruitment'])
  }

  getPanels(): void {
    this.status =3;
    this.panelService
      .getPanels()
      .then(panels => {
        this.panelsList = panels;
      });
  }

}
