import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location }  from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { GroupPurchaseService} from "./group-purchase.service";
import { GPRecruitment } from "./GPRecruitment";
import { Profile } from "../profile";

@Component({
  selector: 'recruitment-edit',
  templateUrl: './gp-recruitment-edit.component.html',
  styleUrls: ['./gp-recruitment-edit.component.css']
})
export class GPRecruitmentEditComponent implements OnInit {
  recruitment: GPRecruitment = {id:0, manufacturer:null, solar_panel:null, min_panel:0, discounted_price: 0, num_requested_panel: 0};
  loggedInUser: Profile = JSON.parse(sessionStorage.getItem('loggedInUser'));

  constructor(private gpService: GroupPurchaseService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location,) {

  }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.gpService.getGPRecruitment(+params.get('id')))
      .subscribe(rec => this.recruitment = rec);
  }

  save(): void {
    if (!this.recruitment.min_panel) {
      alert('type in minimum number of panels');
      return;
    }
    if (!this.recruitment.discounted_price) {
      alert('type in discounted price');
      return;
    }
    if (this.recruitment.min_panel <= 0){
      alert('minimum number of panel should be greater than 0');
      return;
    }
    if (this.recruitment.discounted_price <=0){
      alert('discounted price should be greater than 0');
      return;
    }
    if (!RegExp('^[0-9]+$').test(String(this.recruitment.min_panel))) {
      alert('Please type in number');
      return;
    }
    if (!RegExp('^[0-9]+$').test(String(this.recruitment.discounted_price))) {
      alert('Please type in number');
      return;
    }

    this.gpService.updateGPRecruitment(this.recruitment)
      .then(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }




}
