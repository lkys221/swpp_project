import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../community.service';
import { Router } from '@angular/router';

import { Article } from '../article';


@Component({
  selector: 'forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit {
  searchArticle: any = {title: ""};
  forumList: any[];
  selectedForum : Article;

  constructor(
    private communityService: CommunityService,
    private router: Router
  ) {}

  ngOnInit(){
    this.forumList = [];
    this.getForums();
  }

  getForums():void {
    this.forumList = [];
    this.communityService.getArticles().then(forum => {
      for(let x in forum){
        if ( forum[x].type == '1'){
          this.forumList.push(forum[x]);
        }
      }
    });
  }

  onSelect(forum: Article): void {
    this.selectedForum = forum;
    this.gotoDetail();
  }

  gotoDetail() : void {
    this.router.navigate(['/community/detail', this.selectedForum.id]);
  }

  gotoCreate(): void {
    this.router.navigate(['/community/create']);
  }

}
