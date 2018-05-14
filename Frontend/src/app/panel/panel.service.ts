import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Panel } from './panel';


@Injectable()
export class PanelService {
  private panelUrl = 'api/panel/';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http
  ) {}

  getPanels(): Promise<Panel[]> {
    return this.http
      .get(this.panelUrl, { headers : this.headers })
      .toPromise()
      .then(response => (response.json() as Panel[]))
      .catch(this.handleError);
  }

  getPanel(id: number): Promise<Panel> {
    const url = `${this.panelUrl}${id}/`;
    return this.http
      .get(url, { headers : this.headers })
      .toPromise()
      .then(response => response.json() as Panel)
      .catch(this.handleError);
  }

  create(
    name: string,
    company: string,
    price: number,
    power: number,
    width: number,
    length: number
  ): Promise<any> {
    return this.http
      .post(this.panelUrl,
        JSON.stringify({
          name: name,
          company: company,
          price: price,
          power: power,
          width: width,
          length: length
        }),
        { headers: CSRF_token() }
      )
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  update(panel: Panel): Promise<any> {
    const url = `${this.panelUrl}${panel.id}/`;
    return this.http
      .put(url, JSON.stringify(panel), { headers: CSRF_token() })
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  delete(id: number): Promise<any> {
    const url = `${this.panelUrl}${id}/`;
    return this.http.delete(url, { headers: CSRF_token() })
      .toPromise()
      .then()
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
