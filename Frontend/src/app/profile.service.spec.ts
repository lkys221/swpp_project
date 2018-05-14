import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { User, Profile } from './profile';
import { ProfileService } from './profile.service';

const profileList = [
  {id: 1, email: 'user1@snu.ac.kr', password: 'user1pwd', username: 'user1', user_id: 1, phone_number: '01011112222', type: '0'},
  {id: 2, email: 'user2@snu.ac.kr', password: 'user2pwd', username: 'user2', user_id: 2, phone_number: '01043212222', type: '1'},
  {id: 3, email: 'user3@snu.ac.kr', password: 'user3pwd', username: 'user3', user_id: 3, phone_number: '01012342222', type: '0'}
] as Profile[];

const deletedProfileList = [
  {id: 2, email: 'user2@snu.ac.kr', password: 'user2pwd', username: 'user2', user_id: 2, phone_number: '01043212222', type: '1'},
  {id: 3, email: 'user3@snu.ac.kr', password: 'user3pwd', username: 'user3', user_id: 3, phone_number: '01012342222', type: '0'}
] as Profile[];

const profile = {
  id: 1,
  email: 'user1@snu.ac.kr',
  password: 'user1pwd',
  username: 'user1',
  user_id: 1,
  phone_number: '01011112222',
  type: '0'
} as Profile;

const userList = [
  {id: 1, email: 'user1@snu.ac.kr', password: 'user1pwd', username: 'user1'},
  {id: 2, email: 'user2@snu.ac.kr', password: 'user2pwd', username: 'user2'},
  {id: 3, email: 'user3@snu.ac.kr', password: 'user3pwd', username: 'user3'}
] as User[];

const user = {
  id: 1,
  email: 'user1@snu.ac.kr',
  password: 'user1pwd',
  username: 'user1',
} as User;

describe('ProfileService (mockBackend)', () => {
  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ProfileService, { provide: XHRBackend, useClass: MockBackend }]
    }).compileComponents();
  }));

  it('can instantiate service when injected',
    inject([ProfileService], (service: ProfileService) => {
      expect(service instanceof ProfileService).toBe(true);
    }));

  it('can instantiate service with new',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new ProfileService(http);
      expect(service instanceof ProfileService).toBe(true, 'new service should be ok');
    }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
    }));

  describe('when getProfile', () => {
    let backend: MockBackend;
    let service: ProfileService;
    let fakeData: Profile;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new ProfileService(http);
      fakeData = profile;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have expected profile', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getProfile(1)
        .then(data => {
          expect(data.id).toBe(fakeData.id);
        });
    })));

    it('can handle error', async(() => {
      expect(service.handleError).toThrow();
    }))
  });

  describe('when getProfiles', () => {
    let backend: MockBackend;
    let service: ProfileService;
    let fakeData: Profile[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new ProfileService(http);
      fakeData = profileList;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have expected profiles', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getProfiles()
        .then(data => {
          expect(data.length).toBe(fakeData.length);
        });
    })));
  });

  describe('when updateProfile', () => {
    let backend: MockBackend;
    let service: ProfileService;
    let fakeData: Profile;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new ProfileService(http);
      fakeData = profile;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have updated panel', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      profile.email = 'profile@snu.ac.kr';
      service.updateProfile(profile)
        .then(data => {
          service.getProfile(data.id)
            .then(updated_profile => {
              expect(updated_profile.email).toBe('profile@snu.ac.kr');
            })
        })
    })));
  });

  describe('when deletePanel', () => {
    let backend: MockBackend;
    let service: ProfileService;
    let fakeData: Profile[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new ProfileService(http);
      fakeData = deletedProfileList;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have deleted panels', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.deleteProfile(1).then(() => {
        service.getProfiles()
          .then(profiles => {
            expect(profiles.length).toBe(profileList.length-1);
          })
      })
    })));
  });


  describe('when signUp', () => {
    let backend: MockBackend;
    let service: ProfileService;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new ProfileService(http);
      response = new Response(new ResponseOptions({status:201}));
    }));

    it('should have return status 200', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.signUp(profile.email, profile.username, profile.password, profile.phone_number, profile.type)
        .then(resp => {
          expect(resp.status).toBe(201);
        });
    })));
  });

  describe('when signIn', () => {
    let backend: MockBackend;
    let service: ProfileService;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new ProfileService(http);
      response = new Response(new ResponseOptions({status:202}));
    }));

    it('should have return status 200', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.signIn(user.username, user.password)
        .then(resp => {
          expect(resp.status).toBe(202);
        });
    })));
  });

  describe('when signOut', () => {
    let backend: MockBackend;
    let service: ProfileService;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new ProfileService(http);
      response = new Response(new ResponseOptions({status:202}));
    }));

    it('should have return status 200', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.signOut()
        .then(resp => {
          expect(resp.status).toBe(202);
        });
    })));
  });
});
