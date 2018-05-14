import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { Article } from './article';
import { Comment } from "./comment";

@Injectable()
export class CommunityService {
  private communityUrl = 'api/article/';
  private commentsUrl = 'api/comment/';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http
  ) {}


  getArticles(): Promise<Article[]> {
    return this.http
      .get(this.communityUrl, { headers : this.headers })
      .toPromise()
      .then(res => res.json() as Article)
      .catch(this.handleError);
  }

  getArticle(id: number): Promise<Article> {
    const url = `${this.communityUrl}${id}/`;
    return this.http
      .get(url, { headers : this.headers})
      .toPromise()
      .then(res => res.json() as Article)
      .catch(this.handleError);
  }

  createArticle(author: number, title: string, content: string, type: string): Promise<any>{
    return this.http
      .post(this.communityUrl, JSON.stringify({author: author, title: title, content: content, type: type}), {headers: CSRF_token()})
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  updateArticle(article: Article): Promise<any> {
    const url = `${this.communityUrl}${article.id}/`;
    return this.http
      .put(url, JSON.stringify(article), {headers: CSRF_token()})
      .toPromise()
      .then(() => article)
      .catch(this.handleError);
  }

  deleteArticle(id: number): Promise<void> {
    const url = `${this.communityUrl}${id}/`;
    return this.http
      .delete(url, {headers: CSRF_token()})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }


  getComments(article_id: number): Promise<Comment[]> {
    const url = `${this.communityUrl}${article_id}/comment/`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Comment[])
      .catch(this.handleError);
  }

  createComment(author: number,article: number, content: string, create_time: number): Promise<any>{
    const url = `${this.communityUrl}${article}/comment/`;
    return this.http
      .post(url, JSON.stringify({author: author, article: article, content: content, create_time: create_time}), {headers: CSRF_token()})
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  deleteComment(id: number): Promise<any> {
    const url = `${this.commentsUrl}${id}/`;
    return this.http.delete(url, {headers: CSRF_token()})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  updateComment(comment: Comment): Promise<any> {
    const url = `${this.commentsUrl}${comment.id}/`;
    return this.http
      .put(url, JSON.stringify(comment), {headers: CSRF_token()})
      .toPromise()
      .then(() => comment)
      .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}

function CSRF_token(): Headers {
  const cookie = document.cookie.split('=')[1];
  return new Headers({
    'Content-Type': 'application/json',
    'X-CSRFTOKEN': cookie
  });
}
