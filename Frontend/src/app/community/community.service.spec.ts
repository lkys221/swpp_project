import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { CommunityService } from "./community.service";
import { Article } from "./article";
import { Comment } from "./comment";


describe('CommunityService (mockBackend)', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [CommunityService, {provide: XHRBackend, useClass: MockBackend}]
    }).compileComponents();
  }));

  it('can instantiate service when injected',
    inject([CommunityService], (service: CommunityService) => {
      expect(service instanceof CommunityService).toBe(true);
    }));

  it('can instantiate service with new',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new CommunityService(http);
      expect(service instanceof CommunityService).toBe(true, 'new service should be ok');
    }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
    }));



  describe('when getArticles', () => {
    let backend: MockBackend;
    let service: CommunityService;
    let fakeData: Article[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, back: MockBackend) => {
      backend = back;
      service = new CommunityService(http);
      fakeData = fakeArticles;
      response = new Response(new ResponseOptions({status: 200, body: fakeData}));
    }));

    it('should have expected articles', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getArticles()
        .then(data => {
          expect(data).toBe(fakeData);
        });
    })));

    it('can handle error', async(() => {
      expect(service.handleError).toThrow();
    }));
  });

  describe('when getArticle', () => {
    let backend: MockBackend;
    let service: CommunityService;
    let fakeData: Article;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new CommunityService(http);
      fakeData = fakeArticle;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have expected article', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getArticle(0)
        .then(data => {
          expect(data).toBe(fakeData);
        });
    })));
  });

  describe('when createArticle', () => {
    let backend: MockBackend;
    let service: CommunityService;
    let fakeData: Article;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new CommunityService(http);
      fakeData = fakeArticle;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have created article', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.createArticle(fakeArticle.author, fakeArticle.title, fakeArticle.content, fakeArticle.type)
        .then(article => {
          service.getArticle(article.id)
            .then(new_article => {
              expect(new_article.title).toBe(fakeArticle.title);
              expect(new_article.content).toBe(fakeArticle.content);
            })
        })
    })));
  });

  describe('when updateArticle', () => {
    let backend: MockBackend;
    let service: CommunityService;
    let fakeData: Article;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new CommunityService(http);
      fakeData = fakeArticle;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have updated article', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      fakeArticle.content = "update article content";
      fakeArticle.title = "update article title";
      service.updateArticle(fakeArticle)
        .then(article => {
          service.getArticle(article.id)
            .then(updated_article => {
              expect(updated_article.title).toBe("update article title");
              expect(updated_article.content).toBe("update article content");
            })
        })
    })));
  });

  describe('when deleteArticle', () => {
    let backend: MockBackend;
    let service: CommunityService;
    let fakeData: Article[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new CommunityService(http);
      fakeData = deletedFakeArticles;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have deleted articles', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.deleteArticle(0).then(() => {
          service.getArticles()
            .then(articles => {
              expect(articles.length).toBe(fakeArticles.length-1);
            })
        })
    })));
  });

  describe('when getComments', () => {
    let backend: MockBackend;
    let service: CommunityService;
    let fakeData: Comment[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new CommunityService(http);
      fakeData = fakeComments;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have expected comments', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getComments(1)
        .then(comments => {
          expect(comments).toBe(fakeData);
        });
    })));
  });

  describe('when createComment', () => {
    let backend: MockBackend;
    let service: CommunityService;
    let fakeData: Comment[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new CommunityService(http);
      fakeData = fakeComments;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have created comment', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.createComment(fakeComment.author, fakeComment.article, fakeComment.content, fakeComment.create_time)
        .then(comment => {
          service.getComments(1)
            .then(new_comments => {
              expect(new_comments[0].content).toBe(fakeComment.content);
            })
        })
    })));
  });

  describe('when updateComment', () => {
    let backend: MockBackend;
    let service: CommunityService;
    let fakeData: Comment[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new CommunityService(http);
      fakeData = fakeComments;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have updated comment', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      fakeComments[0].content = "update article content";
      service.updateComment(fakeComments[0])
        .then(comment => {
          service.getComments(1)
            .then(updated_comments => {
              expect(updated_comments[0].content).toBe("update article content");
            })
        })
    })));
  });

  describe('when deleteComment', () => {
    let backend: MockBackend;
    let service: CommunityService;
    let fakeData: Comment[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new CommunityService(http);
      fakeData = deletedFakeComments;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have deleted comments', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.deleteComment(0).then(() => {
        service.getComments(1)
          .then(comments => {
            expect(comments.length).toBe(fakeComments.length-1);
          })
      })
    })));
  });

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

export const fakeArticle: Article = { id: 0, author: 1, title: 'title1', content: 'content1', create_time: 1, type: '0'};
export const fakeComment: Comment =  { id: 0, author: 1, article: 0, content: 'content1', create_time: 1};

