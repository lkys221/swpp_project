import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Profile } from './profile';

@Injectable()
export class ProfileService {
  constructor(private http: Http) { }
  getProfiles(): Promise<Profile[]> {
    return this.http.get('api/profile/')
      .toPromise()
      .then(response => response.json() as Profile[])
      .catch(this.handleError);
  }

  getProfile(id: number): Promise<Profile> {
    return this.http.get(`${'api/profile/'}/${id}/`)
      .toPromise()
      .then(response => response.json() as Profile[])
      .catch(this.handleError);
  }

  updateProfile(profile: Profile): Promise<any> {
    return this.http.put(`${'api/profile'}/${profile.id}/`, JSON.stringify(profile), { headers: csrf_token() })
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  deleteProfile(id: number): Promise<any> {
    return this.http.delete(`${'api/profile'}/${id}/`, { headers: csrf_token() })
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  signUp(email: string, username: string, password: string, phoneNumber: string, type: string): Promise<any> {
    const data = {
      email: email,
      username: username,
      password: password,
      phone_number: phoneNumber,
      type: type
    };
    return this.http
      .post('api/signup/', JSON.stringify(data), {headers : csrf_token()})
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  signIn(username: string, password: string): Promise<any> {
    return this.http
      .post('api/signin/', JSON.stringify({username: username, password: password}), {headers: csrf_token()})
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  signOut(): Promise<any> {
    return this.http.get('api/signout/')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}

function csrf_token(): Headers {
  const cookie = document.cookie.split('=')[1];
  return new Headers({
    'Content-Type': 'application/json',
    'X-CSRFTOKEN': cookie
  });
}
