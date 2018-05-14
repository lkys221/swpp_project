import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../community.service';
import { Router } from '@angular/router';

import { Article } from '../article';

@Component({
  selector: 'notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})

export class NoticeComponent implements OnInit {
  notice_list: Article[];
  selectedNotice : Article;
  searchArticle: any = {title: ""};


  constructor(
    private communityService: CommunityService,
    private router: Router
  ) {}

  ngOnInit(){
    this.notice_list = [];
    this.getNotices();

  }

  getNotices():void {
    this.notice_list = [];
    this.communityService.getArticles().then(notice => {
      for(let x in notice){
        if ( notice[x].type == '0'){
          this.notice_list.push(notice[x]);
        }
      }
    });
  }

  onSelect(notice: Article): void {
    this.selectedNotice = notice;
    this.gotoDetail();
  }

  gotoDetail() : void {
    this.router.navigate(['/community/detail', this.selectedNotice.id]);
  }

  gotoCreate(): void {
    this.router.navigate(['/community/create']);
  }

}
