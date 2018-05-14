import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { CommunityService } from "./community.service";
import { Article } from "./article";
import { Profile } from "../profile";

@Component({
  selector: 'article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css']
})

export class ArticleEditComponent implements OnInit {
  article: Article = {id:0, author:null, title:'', content:'', create_time:null, type: null};
  loggedInUser: Profile;

  constructor(
    private communityService: CommunityService,
    private route: ActivatedRoute,
    private location: Location,) {

  }

  ngOnInit(): void {
    if(sessionStorage.getItem('logged in user')) {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('logged in user'));
    }
    this.route.paramMap
      .switchMap((params: ParamMap) => this.communityService.getArticle(+params.get('id')))
      .subscribe(article => this.article = article);
  }

  save(): void {
    if (this.article.title.length >= 200) {
      alert('title should be less than 200 characters');
      return;
    }
    if (this.article.title.length >= 10000) {
      alert('content should be less than 10000 characters');
      return;
    }
    this.communityService.updateArticle(this.article).then(
      () => this.goBack()
    );
  }

  goBack(): void {
    this.location.back();
  }
}
