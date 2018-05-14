import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { GPRecruitment } from "./GPRecruitment";
import { GPRegister } from "./GPRegister";


@Injectable()
export class GroupPurchaseService {
  private GPRecruitURL = 'api/gp_recruitment/';
  private GPRegisterURL = 'api/gp_register/';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http
  ) {}

  getGPRecruitments(): Promise<GPRecruitment[]> {
    return this.http
      .get(this.GPRecruitURL)
      .toPromise()
      .then(res => (res.json() as GPRecruitment[]))
      .catch(this.handleError);
  }

  getGPRecruitment(id: number): Promise<GPRecruitment> {
    const url = `${this.GPRecruitURL}${id}/`;
    return this.http
      .get(url, { headers : this.headers})
      .toPromise()
      .then(res => res.json() as GPRecruitment)
      .catch(this.handleError);
  }

  createGPRecruitment(solarPanel: number, minPanel: number, discountedPrice: number): Promise<any> {
    return this.http
      .post(this.GPRecruitURL, JSON.stringify({solar_panel: solarPanel, min_panel: minPanel, discounted_price: discountedPrice}), {headers: CSRF_token()})
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  deleteGPRecruitment(id: number): Promise<any> {
    const url = `${this.GPRecruitURL}${id}/`;
    return this.http
      .delete(url, {headers: CSRF_token()})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  updateGPRecruitment(recruit: GPRecruitment): Promise<any> {
    const url = `${this.GPRecruitURL}${recruit.id}/`;
    return this.http
      .put(url, JSON.stringify(recruit), {headers: CSRF_token()})
      .toPromise()
      .then(() => recruit)
      .catch(this.handleError);
  }

  // GPRegister
  getGPRegisters(): Promise<GPRegister[]> {
    return this.http
      .get(this.GPRegisterURL, { headers : this.headers })
      .toPromise()
      .then(res => res.json() as GPRegister)
      .catch(this.handleError);
  }

  getGPRegister(id: number): Promise<GPRegister> {
    const url = `${this.GPRegisterURL}${id}/`;
    return this.http
      .get(url, { headers : this.headers})
      .toPromise()
      .then(res => res.json() as GPRegister)
      .catch(this.handleError);
  }

  createGPRegister(customer: number, numPanel: number, gpRecruitment: number): Promise<any> {
    return this.http
      .post(this.GPRegisterURL, JSON.stringify({customer: customer, num_panel: numPanel, gp_recruitment: gpRecruitment}), {headers: CSRF_token()})
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
