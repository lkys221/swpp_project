import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { GroupPurchaseService } from "./group-purchase.service";
import { GPRecruitment } from "./GPRecruitment";
import { PanelService } from "../panel/panel.service";
import { Panel } from "../panel/panel";

@Component({
  selector: 'recruitment-detail',
  templateUrl: './gp-recruitment-detail.component.html'
})
export class GPRecruitmentDetailComponent implements OnInit {
  recruitmentList: GPRecruitment[];
  recruitment: GPRecruitment = {id:0, manufacturer:null, solar_panel:null, min_panel:0, discounted_price: 0, num_requested_panel: 0};
  panelList: Panel[];
  loggedInUser = JSON.parse(sessionStorage.getItem('logged in user'));
  numPanel: number = null;


  constructor(private gpService: GroupPurchaseService,
              private panelService: PanelService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.gpService.getGPRecruitment(+params.get('id')))
      .subscribe(rec => this.recruitment = rec);
    this.getPanels();
  }

  deleteRecruitment(recruitment: GPRecruitment): void {
    if(this.loggedInUser.id === this.recruitment.manufacturer) {
      this.gpService
        .deleteGPRecruitment(recruitment.id)
        .then(() => {
          this.recruitmentList = this.recruitmentList.filter(a => a !== recruitment);
          this.recruitment = null;
        });
      this.goBack();
    } else {
      alert("You are not authorized to delete!")
    }
  }

  addRegister(numPanel: number): void {
    if (numPanel === null || String(numPanel).length == 0) {
      alert('Please enter a number');
      return;
    }
    if (numPanel <= 0) {
      alert('Number should be greater than 0');
      return;
    }
    if (!RegExp('^[0-9]+$').test(String(this.numPanel))) {
      alert('Please type in number');
      return;
    }
    this.gpService.createGPRegister(this.loggedInUser.id, numPanel, this.recruitment.id).then(() => {
      alert('You have registered successfully!');
      this.goBack();
    });
  }

  getPanels(): void {
    this.panelService
      .getPanels()
      .then(panels => {
        this.panelList = panels;
      });
  }

  getPanelInfo(id: number): Panel {
    for(let x in this.panelList) {
      if(this.panelList[x].id === id) {
        return this.panelList[x];
      }
    }
    return;
  }

  gotoEdit(): void {
    if(this.loggedInUser.id === this.recruitment.manufacturer) {
      this.router.navigate(['/gp/recruitment', this.recruitment.id, 'edit']);
    } else {
      alert("You are not authorized to edit!")
    }
  }

  goBack(): void {
    this.location.back();
  }

}
