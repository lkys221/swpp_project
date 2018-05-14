import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../community.service';
import { Router } from '@angular/router';

import { Article } from '../article';

@Component({
  selector: 'faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})

export class FaqComponent implements OnInit {

  constructor(
    private communityService: CommunityService,
    private router: Router) { }

  searchArticle: any = {title: ""};
  faq_list: Article[];
  selectedFaq : Article;

  ngOnInit(){
    this.faq_list = [];
    this.getFaq();

  }

  getFaq():void {
    this.communityService.getArticles().then(faq => {
      for(let x in faq){
        if ( faq[x].type == '2'){
          this.faq_list.push(faq[x]);
        }
      }
    });
  }



  onSelect(faq: Article): void {
    this.selectedFaq = faq;
    this.gotoDetail();
  }

  gotoDetail() : void {
    this.router.navigate(['/community/detail', this.selectedFaq.id]);
  }

  gotoCreate(): void {
    this.router.navigate(['/community/create']);
  }

}
