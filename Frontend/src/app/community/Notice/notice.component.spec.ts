import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {By} from "@angular/platform-browser";
import {AppModule} from "../../app.module";
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router'
import {AppRoutingModule, routes} from '../../app-routing.module'

import { NoticeComponent } from './notice.component';
import { Article } from "../article";
import { CommunityService } from "../community.service";

let comp: NoticeComponent;
let fixture: ComponentFixture<NoticeComponent>;
let location: Location;
let router: Router;
let page: Page;


describe('NoticeComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        imports: [
          AppRoutingModule
        ],
        providers: [
          CommunityService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: CommunityService, useClass: FakeCommunityService}
        ]
      }
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NoticeComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();

        location = TestBed.get(Location);
        router = TestBed.get(Router);
        router.initialNavigation();


        fixture.whenStable().then(() => {
          fixture.detectChanges();
          page = new Page();
        });
      });
  }));


  it('can instantiate it', () => {
    expect(comp).not.toBeNull();
  });


  it('should create', () => {
    expect(comp).toBeTruthy();
  });


  it('should render title in a h1 tag', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Notice Page');
  }));


  it('should display articles', () => {
    expect(page.articlesRows.length).toEqual(0);
  });


  it('should goto `/create` ', fakeAsync(() => {
    fixture.detectChanges();
    let buttonCreate: HTMLElement = fixture.debugElement.query(By.css('#button_create')).nativeElement;
    buttonCreate.click();
    tick();
    expect(location.path()).toBe('/community/create');
  }));

});


export const fakeArticles: Article[] = [
  { id: 0, author: 1, title: 'title1', content: 'content1', create_time: 1, type: '0'},
  { id: 1, author: 2, title: 'title2', content: 'content2', create_time: 1, type: '1'},
  { id: 2, author: 3, title: 'title3', content: 'content3', create_time: 1, type: '2'}
];

export const fakeLoggedInUser  = { id: 1, email: 'swpp@snu.ac.kr', password: 'iluvswpp', name: 'Software Lover'};

class Page {
  articlesRows: HTMLLIElement[];

  constructor() {
    this.articlesRows = fixture.debugElement.queryAll(By.css('li')).map(de => de.nativeElement);
  };
}


class FakeCommunityService {

  getArticle(id: number): Promise<Article> {
    let article = fakeArticles.find(article => article.id === id);
    return Promise.resolve<Article>(article);
  }

  getArticles(): Promise<Article[]> {
    return Promise.resolve<Article[]>(fakeArticles);
  }

  // implement other fake functions to use them later, for create and delete.
}

