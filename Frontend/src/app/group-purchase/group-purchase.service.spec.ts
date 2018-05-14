import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { GroupPurchaseService } from "./group-purchase.service";
import { GPRegister } from "./GPRegister"
import { GPRecruitment } from "./GPRecruitment";


describe('GroupPurchaseService (mockBackend)', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [GroupPurchaseService, {provide: XHRBackend, useClass: MockBackend}]
    }).compileComponents();
  }));

  it('can instantiate service when injected',
    inject([GroupPurchaseService], (service: GroupPurchaseService) => {
      expect(service instanceof GroupPurchaseService).toBe(true);
    }));

  it('can instantiate service with new',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new GroupPurchaseService(http);
      expect(service instanceof GroupPurchaseService).toBe(true, 'new service should be ok');
    }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
    }));



  describe('when getGPRecruitments', () => {
    let backend: MockBackend;
    let service: GroupPurchaseService;
    let fakeData: GPRecruitment[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, back: MockBackend) => {
      backend = back;
      service = new GroupPurchaseService(http);
      fakeData = fakeGPRecruitments;
      response = new Response(new ResponseOptions({status: 200, body: fakeData}));
    }));

    it('should have expected GPRecruitments', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getGPRecruitments()
        .then(data => {
          expect(data).toBe(fakeData);
        });
    })));

    it('can handle error', async(() => {
      expect(service.handleError).toThrow();
    }));
  });

  describe('when getGPRecruitment', () => {
    let backend: MockBackend;
    let service: GroupPurchaseService;
    let fakeData: GPRecruitment;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new GroupPurchaseService(http);
      fakeData = fakeGPRecruitment;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have expected GPRecruitment', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getGPRecruitment(0)
        .then(data => {
          expect(data).toBe(fakeData);
        });
    })));
  });

  describe('when createGPRecruitment', () => {
    let backend: MockBackend;
    let service: GroupPurchaseService;
    let fakeData: GPRecruitment;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new GroupPurchaseService(http);
      fakeData = fakeGPRecruitment;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have created GPRecruitment', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.createGPRecruitment(fakeGPRecruitment.solar_panel, fakeGPRecruitment.min_panel, fakeGPRecruitment.discounted_price)
        .then(GPRecruitment => {
          service.getGPRecruitment(GPRecruitment.id)
            .then(new_GPRecruitment => {
              expect(new_GPRecruitment.solar_panel).toBe(fakeGPRecruitment.solar_panel);
            })
        })
    })));
  });

  describe('when updateGPRecruitment', () => {
    let backend: MockBackend;
    let service: GroupPurchaseService;
    let fakeData: GPRecruitment;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new GroupPurchaseService(http);
      fakeData = fakeGPRecruitment;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have updated GPRecruitment', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      fakeGPRecruitment.min_panel = 20;
      service.updateGPRecruitment(fakeGPRecruitment)
        .then(GPRecruitment => {
          service.getGPRecruitment(GPRecruitment.id)
            .then(updated_GPRecruitment => {
              expect(updated_GPRecruitment.min_panel).toBe(20);
            })
        })
    })));
  });

  describe('when deleteGPRecruitment', () => {
    let backend: MockBackend;
    let service: GroupPurchaseService;
    let fakeData: GPRecruitment[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new GroupPurchaseService(http);
      fakeData = deletedFakeGPRecruitments;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have deleted GPRecruitments', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.deleteGPRecruitment(0).then(() => {
        service.getGPRecruitments()
          .then(articles => {
            expect(articles.length).toBe(fakeGPRecruitments.length-1);
          })
      })
    })));
  });

  describe('when getGPRegisters', () => {
    let backend: MockBackend;
    let service: GroupPurchaseService;
    let fakeData: GPRegister[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new GroupPurchaseService(http);
      fakeData = fakeGPRegisters;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have expected GPRegisters', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getGPRegisters()
        .then(GPRegisters => {
          expect(GPRegisters).toBe(fakeData);
        });
    })));
  });

  describe('when getGPRegister', () => {
    let backend: MockBackend;
    let service: GroupPurchaseService;
    let fakeData: GPRegister;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new GroupPurchaseService(http);
      fakeData = fakeGPRegister;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have expected GPRegister', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getGPRegister(0)
        .then(GPRegister => {
          expect(GPRegister).toBe(fakeData);
        });
    })));
  });

  describe('when createGPRegister', () => {
    let backend: MockBackend;
    let service: GroupPurchaseService;
    let fakeData: GPRegister;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new GroupPurchaseService(http);
      fakeData = fakeGPRegister;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have created GPRegister', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.createGPRegister(fakeGPRegister.customer, fakeGPRegister.num_panel, fakeGPRegister.gp_recruitment)
        .then(GPRegister => {
          service.getGPRegister(GPRegister.id)
            .then(newGPRegister => {
              expect(newGPRegister.num_panel).toBe(fakeGPRegister.num_panel);
            })
        })
    })));
  });

});

export const fakeGPRecruitments: GPRecruitment[] = [
  { id: 0, manufacturer: 1, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5},
  { id: 1, manufacturer: 2, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5},
  { id: 2, manufacturer: 3, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5}
];

export const deletedFakeGPRecruitments: GPRecruitment[] = [
  { id: 1, manufacturer: 2, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5},
  { id: 2, manufacturer: 3, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5}
];

export const fakeGPRegisters: GPRegister[] = [
  { id: 0, customer: 1, num_panel: 5, gp_recruitment: 1},
  { id: 1, customer: 2, num_panel: 5, gp_recruitment: 1},
  { id: 2, customer: 3, num_panel: 5, gp_recruitment: 1}
];

export const deletedFakeGPRegisters: GPRegister[] = [
  { id: 1, customer: 2, num_panel: 5, gp_recruitment: 1},
  { id: 2, customer: 3, num_panel: 5, gp_recruitment: 1}
];

export const fakeGPRecruitment: GPRecruitment = { id: 0, manufacturer: 1, solar_panel: 1, min_panel: 10, discounted_price: 100000, num_requested_panel: 5};
export const fakeGPRegister: GPRegister =  { id: 0, customer: 1, num_panel: 5, gp_recruitment: 1};

