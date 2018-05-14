import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommunityService } from "./community.service";
import { Article } from "./article";
import { Profile } from "../profile";


@Component({
  selector: 'article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent implements OnInit {
  article: Article = { id:0, author: null, title: '', content: '', create_time:null, type: 'Notice' };
  articles_list: Article[];
  loggedInUser: Profile;
  articleTitle = '';
  articleContent = '';
  type = '';
  types = [
    { value: '0', display: 'Notice' },
    { value: '1', display: 'Forum' },
    { value: '2', display: 'FAQ' }
  ];

  constructor(
    private router: Router,
    private communityService: CommunityService
  ) {}

  ngOnInit(): void {
    if(sessionStorage.getItem('logged in user')) {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('logged in user'));
    }
    this.getArticles();
  }
  getArticles(): void {
    this.communityService.getArticles().then(article => this.articles_list = article);
  }

  addArticle(title: string, content: string): void {
    title = title.trim();
    content = content.trim();
    if (!title) {
      alert('type in title');
      return;
    }
    if (!content) {
      alert('type in content');
      return;
    }
    if (this.articleTitle.length >= 200) {
      alert('title should be less than 200 characters');
      return;
    }
    if (this.articleContent.length >= 10000) {
      alert('content should be less than 10000 characters');
      return;
    }
    if (this.type === '') {
      alert('choose the type of article');
      return;
    }

    if (this.loggedInUser.type !== '2' && this.type === '0') {
      alert('Only admins can create a notice')
    } else {
      this.communityService.createArticle(this.loggedInUser.id, title, content, this.type)
        .then(res => {
          if(res.status === 201) {
            if(this.type === '0') {
              this.router.navigate(['/community']);
            }
            if(this.type === '1') {
              this.router.navigate(['/community/forum']);
            }
            if(this.type === '2') {
              this.router.navigate(['/community/faq']);
            }

      }});
    }}
}
