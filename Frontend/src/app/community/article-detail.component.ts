import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { CommunityService } from "./community.service";
import { Article } from "./article";
import { Comment } from "./comment";
import { Profile } from "../profile";
import { ProfileService } from "../profile.service";

@Component({
  selector: 'article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})

export class ArticleDetailComponent implements OnInit {
  article: Article = {id:0, author:null, title:'', content:'', create_time:null, type: null};
  articleList: Article[] = [{id:0, author:null, title:'', content:'', create_time:null, type: null}];
  comment: Comment;
  comment_list: Comment[];
  loggedInUser: Profile;
  create_time = 1; // Date.now();
  commentBeingEdited: Boolean = false;
  commentBeingEditedId: number;
  profileList: Profile[];
  profile: Profile;
  commentContent = '';


  constructor(
    private communityService: CommunityService,
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    if(sessionStorage.getItem('logged in user')) {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('logged in user'));
    }
    this.profileList = [];
    this.route.paramMap
      .switchMap((params: ParamMap) => this.communityService.getArticle(+params.get('id')))
      .subscribe(article => this.article = article);
    this.getComments();
    this.getProfiles();
  }

  getProfiles(): void {
    this.profileService
      .getProfiles()
      .then(profile => {
        this.profileList = profile;
      });
  }

  getProfileInfo(id: number): Profile {
    for(let x in this.profileList) {
      if(this.profileList[x].id == id) {
        return this.profileList[x];
      }
    }
  }


  deleteArticle(article: Article): void {
    if(this.loggedInUser.id === this.article.author) {
      this.communityService
        .deleteArticle(article.id)
        .then(() => {
          this.articleList = this.articleList.filter(a => a !== article);
          this.article = null;
        });
      this.goBack();
    } else {
      alert("You are not authorized to delete!")
    }
  }

  getComments(): void{
    this.route.paramMap
      .switchMap((params: ParamMap) => this.communityService.getComments(+params.get('id')))
      .subscribe(comment => this.comment_list = comment);
  }

  addComment(content: string): void {
    content = content.trim();
    if (!content) {
      alert('content should not be empty');
      return;
    }
    if (content.length >= 200) {
      alert('content should be less than 200 characters');
      return;
    }
    this.communityService.createComment(this.loggedInUser.id,this.article.id, content, this.create_time)
      .then(comment => {
        this.comment_list.push(comment);
      });
    this.commentContent = '';
    this.getComments();
  }

  deleteComment(comment: Comment): void {
      this.communityService
        .deleteComment(comment.id)
        .then(() => {
          this.comment_list = this.comment_list.filter(c => c !== comment);
          this.comment = null;
        });
      this.getComments();

  }

  editComment(comment: Comment): void{
    this.commentBeingEdited = true;
    this.commentBeingEditedId = comment.id;
  }

  saveComment(comment: Comment): void {
    if(comment.content.length >= 200){
      alert('content should be less than 200 characters');
      return;
    }
    this.communityService.updateComment(comment)
      .then();
    this.commentBeingEdited = false;
  }


  gotoEdit(): void {
    if(this.loggedInUser.id === this.article.author) {
      this.router.navigate(['/community/edit', this.article.id]);
    } else {
      alert("You are not authorized to edit!")
    }
  }

  goBack(): void {
    this.location.back();
  }

}
