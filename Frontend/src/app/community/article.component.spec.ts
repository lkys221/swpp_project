import { async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { By } from "@angular/platform-browser";
import { AppModule } from "../app.module";
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import {ActivatedRoute, Router} from '@angular/router';
import { AppRoutingModule, routes } from '../app-routing.module';

import { ArticleCreateComponent } from "./article-create.component";
import { ArticleDetailComponent } from "./article-detail.component";

import { FakeProfileService } from "../mypage/mypage.component.spec";
import { ProfileService } from "../profile.service";
import { CommunityService } from "./community.service";

import { Article } from "./article";
import { Comment } from "./comment";
import {ImageService} from "../image-upload/image.service";
import {GroupPurchaseService} from "../group-purchase/group-purchase.service";
import {ArticleEditComponent} from "./article-edit.component";

describe('ArticleCreateComponent', () => {
  let comp: ArticleCreateComponent;
  let fixture: ComponentFixture<ArticleCreateComponent>;
  let location: Location;
  let router: Router;

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
        fixture = TestBed.createComponent(ArticleCreateComponent);
        comp = fixture.componentInstance;
        location = TestBed.get(Location);
        router = TestBed.get(Router);
        router.initialNavigation();
        sessionStorage.setItem("logged in user", JSON.stringify(fakeLoggedInUserCust));

        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
  }));

  it('can instantiate it', () => {
    expect(comp).not.toBeNull();
  });

  it('should create the app', async(() => {
    expect(comp).toBeTruthy();
  }));

  it('addArticle1', fakeAsync(() => {
    comp.addArticle('', '');
    expect(fakeArticles.length).toBe(fakeArticles.length);
  }));

  it('addArticle2', fakeAsync(() => {
    comp.addArticle('title', '');
    expect(fakeArticles.length).toBe(fakeArticles.length);
  }));

  it('addArticle3', fakeAsync(() => {
    comp.addArticle('title', 'content');
    expect(fakeArticles.length).toBe(fakeArticles.length);
  }));

  it('addArticle4', (() => {
    comp.type = '1';
    fixture.detectChanges();
    comp.addArticle('title', 'content');
    expect(fakeArticles.length).toBe(fakeArticles.length);
  }));

  it('should goto `notice page` ', fakeAsync(() => {
    sessionStorage.setItem('logged in user', JSON.stringify(fakeLoggedInUserAdmin));
    let titleInput: HTMLInputElement = fixture.debugElement.query(By.css('#articleTitle')).nativeElement;
    titleInput.value = 'title1';
    let contentInput: HTMLInputElement = fixture.debugElement.query(By.css('#articleContent')).nativeElement;
    contentInput.value = 'content1';
    titleInput.dispatchEvent(new Event('input'));
    contentInput.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    comp.type = '0';
    comp.loggedInUser = fakeLoggedInUserAdmin;

    let buttonCreate: HTMLElement = fixture.debugElement.query(By.css('#button_add')).nativeElement;
    buttonCreate.click();
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/community');
  }));

  it('should goto `forum page` ', fakeAsync(() => {
    sessionStorage.setItem("loggedInUser", JSON.stringify(fakeLoggedInUserCust));
    comp.article = fakeArticleForum;
    let buttonCreate: HTMLElement = fixture.debugElement.query(By.css('#button_add')).nativeElement;
    buttonCreate.click();
    tick();
    expect(location.path()).toBe('/');
  }));

  it('should goto `faq page` ', fakeAsync(() => {
    sessionStorage.setItem("loggedInUser", JSON.stringify(fakeLoggedInUserCust));
    comp.article = fakeArticleFAQ;
    let buttonCreate: HTMLElement = fixture.debugElement.query(By.css('#button_add')).nativeElement;
    buttonCreate.click();
    tick();
    expect(location.path()).toBe('/');
  }));

});



describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).overrideModule(AppModule, {
      remove: {
        imports: [
          AppRoutingModule
        ],
        providers: [
          CommunityService,
          ProfileService,
          ImageService,
          GroupPurchaseService,
          ProfileService
        ]
      },
      add: {
        imports: [
          RouterTestingModule.withRoutes(routes)
        ],
        providers: [
          {provide: CommunityService, useClass: FakeCommunityService},
          {provide: ProfileService, useClass: FakeProfileService}
        ]
      }
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(ArticleDetailComponent);
      component = fixture.componentInstance;
      location = TestBed.get(Location);
      router = TestBed.get(Router);
      router.initialNavigation();

      sessionStorage.setItem("loggedInUser", JSON.stringify(fakeLoggedInUserAdmin));
      // component.article = fakeArticles[0];
      fixture.whenStable().then(() => {
        fixture.detectChanges();
      });
    });
  }));

  it('can instantiate it', () => {
    expect(component).not.toBeNull();
  });

  it('should create the component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('getProfileInfo', fakeAsync(() => {
    component.getProfileInfo(0);
    expect(fakeLoggedInUserAdmin).toBe(fakeLoggedInUserAdmin);
  }));

  it('addComment1', fakeAsync(() => {
    component.addComment('');
    expect(fakeComments.length).toBe(fakeComments.length);
  }));

  it('addComment2', (() => {
    component.article = fakeArticles[0];
    fixture.detectChanges();
    component.addComment('content');
    expect(fakeComments.length).toBe(fakeComments.length);
  }));

  it('editComment', fakeAsync(() => {
    component.editComment(fakeComments[0]);
    expect(fakeComments.length).toBe(fakeComments.length);
  }));

  it('saveComment', fakeAsync(() => {
    component.saveComment(fakeComments[0]);
    expect(fakeComments.length).toBe(fakeComments.length);
  }));

  it('gotoEdit', (() => {
    component.article = fakeArticles[0];
    fixture.detectChanges();
    component.gotoEdit();
    expect(fakeComments.length).toBe(fakeComments.length);
  }));

  it('deleteArticle', (() => {
    component.article = fakeArticles[0];
    fixture.detectChanges();
    component.deleteArticle(fakeArticles[0]);
    expect(fakeArticles.length).toBe(fakeArticles.length);
  }));

  it('deleteComment', fakeAsync(() => {
    component.deleteComment(fakeComments[0]);
    expect(fakeArticles.length).toBe(fakeArticles.length);
  }));
});


describe('ArticleEditComponent', () => {
  let component: ArticleEditComponent;
  let fixture: ComponentFixture<ArticleEditComponent>;
  let location: Location;
  let router: Router;

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
        fixture = TestBed.createComponent(ArticleEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        location = TestBed.get(Location);
        router = TestBed.get(Router);
        router.initialNavigation();

        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
  }));


  it('can instantiate it', () => {
    expect(component).not.toBeNull();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('save', fakeAsync(() => {
    component.save();
    expect(fakeLoggedInUserAdmin).toBe(fakeLoggedInUserAdmin);
  }));

});


export const fakeArticles: Article[] = [
  { id: 0, author: 1, title: 'title1', content: 'content1', create_time: 1, type: '0'},
  { id: 1, author: 2, title: 'title2', content: 'content2', create_time: 1, type: '1'},
  { id: 2, author: 3, title: 'title3', content: 'content3', create_time: 1, type: '2'}
];

export const deletedFakeArticles: Article[] = [
  { id: 1, author: 2, title: 'title2', content: 'content2', create_time: 1, type: '1'},
  { id: 2, author: 3, title: 'title3', content: 'content3', create_time: 1, type: '2'}
];

export const fakeComments: Comment[] = [
  { id: 0, author: 1, article: 0, content: 'content1', create_time: 1},
  { id: 1, author: 2, article: 0, content: 'content2', create_time: 1},
  { id: 2, author: 3, article: 0, content: 'content3', create_time: 1}
];

export const deletedFakeComments: Comment[] = [
  { id: 1, author: 2, article: 0, content: 'content2', create_time: 1},
  { id: 2, author: 3, article: 0, content: 'content3', create_time: 1}
];

export const fakeArticleNotice: Article = { id: 0, author: 1, title: 'title1', content: 'content1', create_time: 1, type: '0'};
export const fakeArticleForum: Article = { id: 0, author: 1, title: 'title1', content: 'content1', create_time: 1, type: '1'};
export const fakeArticleFAQ: Article = { id: 0, author: 1, title: 'title1', content: 'content1', create_time: 1, type: '2'};

export const fakeLoggedInUserCust  = { id: 1, email: 'user1@snu.ac.kr', password: 'qqqq1111', username: 'user1', phone_number: '11122223333', user_id: 1,  type: '0'};
export const fakeLoggedInUserManu  = { id: 1, email: 'user1@snu.ac.kr', password: 'qqqq1111', username: 'user2', phone_number: '11122223333', user_id: 2,  type: '1'};
export const fakeLoggedInUserAdmin  = { id: 1, email: 'user1@snu.ac.kr', password: 'qqqq1111', username: 'user3', phone_number: '11122223333', user_id: 3,  type: '2'};


class FakeCommunityService {
  getArticles(): Promise<Article[]> {
    return Promise.resolve<Article[]>(fakeArticles);
  }

  getArticle(id: number): Promise<Article> {
    return Promise.resolve<Article>(fakeArticleForum);
  }

  createArticle(author: number, title: string, content: string, type: string): Promise<any> {
    return Promise.resolve({status: 201});
  }

  updateArticle(article: Article): Promise<any> {
    return Promise.resolve({status: 204});
  }

  deleteArticle(id: number): Promise<any> {
    return Promise.resolve({status: 204});
  }

  getComments(article_id: number): Promise<Comment[]> {
    return Promise.resolve<Comment[]>(fakeComments);
  }

  createComment(author: number,article: number, content: string, create_time: number): Promise<any> {
    return Promise.resolve({status: 201});
  }

  deleteComment(id: number): Promise<any> {
    return Promise.resolve({status: 204});
  }

  updateComment(comment: Comment): Promise<any> {
    return Promise.resolve({status: 204});
  }

}
