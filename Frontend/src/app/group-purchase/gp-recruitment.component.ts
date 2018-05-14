import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GroupPurchaseService } from "./group-purchase.service";
import { GPRecruitment } from "./GPRecruitment";
import { PanelService } from "../panel/panel.service";
import { Panel } from "../panel/panel";

@Component({
  selector: 'app-group-purchase',
  templateUrl: './gp-recruitment.component.html',
  styleUrls: ['./gp-recruitment.component.css']
})
export class GPRecruitmentComponent implements OnInit {
  recruitmentList: GPRecruitment[];
  selectedRecruitment: GPRecruitment;
  panelList: Panel[];

  constructor(
    private gpService: GroupPurchaseService,
    private panelService: PanelService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getRecruitments();
    this.getPanels();
  }

  getRecruitments(): void {
    this.gpService.getGPRecruitments().then(rec => this.recruitmentList = rec);
  }

  onSelect(recruitment: GPRecruitment): void {
    this.selectedRecruitment = recruitment;
    this.gotoDetail();
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

  gotoDetail(): void {
    this.router.navigate(['/gp/recruitment', this.selectedRecruitment.id]);
  }

  gotoCreate(): void {
    this.router.navigate(['/gp/recruitment/create']);
  }

}
