import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { PanelService } from "./panel.service";
import { Panel } from './panel';


describe('PanelService (mockBackend)', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule ],
      providers: [PanelService, {provide: XHRBackend, useClass: MockBackend}]
    }).compileComponents();
  }));

  it('can instantiate service when injected',
    inject([PanelService], (service: PanelService) => {
      expect(service instanceof PanelService).toBe(true);
    }));

  it('can instantiate service with new',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new PanelService(http);
      expect(service instanceof PanelService).toBe(true, 'new service should be ok');
    }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
    }));

  describe('when getPanels', () => {
    let backend: MockBackend;
    let service: PanelService;
    let fakeData: Panel[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, back: MockBackend) => {
      backend = back;
      service = new PanelService(http);
      fakeData = fakePanels;
      response = new Response(new ResponseOptions({status: 200, body: fakeData}));
    }));

    it('should have expected panels', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getPanels()
        .then(data => {
          expect(data).toBe(fakeData);
        });
    })));

    it('can handle error', async(() => {
      expect(service.handleError).toThrow();
    }));
  });

  describe('when getPanel', () => {
    let backend: MockBackend;
    let service: PanelService;
    let fakeData: Panel;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new PanelService(http);
      fakeData = fakePanel;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have expected panel', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getPanel(0)
        .then(data => {
          expect(data).toBe(fakeData);
        });
    })));
  });

  describe('when create', () => {
    let backend: MockBackend;
    let service: PanelService;
    let fakeData: Panel;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new PanelService(http);
      fakeData = fakePanel;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have created panel', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.create(fakePanel.name, fakePanel.company, fakePanel.price, fakePanel.power, fakePanel.width, fakePanel.length)
        .then(panel => {
          service.getPanel(panel.id)
            .then(new_panel => {
              expect(new_panel.price).toBe(fakePanel.price);
            })
        })
    })));
  });

  describe('when update', () => {
    let backend: MockBackend;
    let service: PanelService;
    let fakeData: Panel;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new PanelService(http);
      fakeData = fakePanel;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have updated panel', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      fakePanel.price = 200000;
      service.update(fakePanel)
        .then(panel => {
          service.getPanel(panel.id)
            .then(updated_panel => {
              expect(updated_panel.price).toBe(200000);
            })
        })
    })));
  });

  describe('when deletePanel', () => {
    let backend: MockBackend;
    let service: PanelService;
    let fakeData: Panel[];
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http:Http, back: MockBackend) => {
      backend = back;
      service = new PanelService(http);
      fakeData = deletedFakePanels;
      response = new Response(new ResponseOptions({status:200, body: fakeData}));
    }));

    it('should have deleted panels', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.delete(0).then(() => {
        service.getPanels()
          .then(panels => {
            expect(panels.length).toBe(fakePanels.length-1);
          })
      })
    })));
  });
});

export const fakePanels: Panel[] = [
  { id: 0, manufacturer: 1, name: 'panel1', company: 'solar1', price: 100000, power: 10, width: 3, length: 4, image: null, efficiency: 40 },
  { id: 1, manufacturer: 2, name: 'panel2', company: 'solar2', price: 150000, power: 12, width: 5, length: 6, image: null, efficiency: 40 },
  { id: 2, manufacturer: 3, name: 'panel3', company: 'solar3', price: 120000, power: 8, width: 3, length: 5, image: null, efficiency: 40 }
];

export const deletedFakePanels: Panel[] = [
  { id: 1, manufacturer: 2, name: 'panel2', company: 'solar2', price: 150000, power: 12, width: 5, length: 6, image: null, efficiency: 40 },
  { id: 2, manufacturer: 3, name: 'panel3', company: 'solar3', price: 120000, power: 8, width: 3, length: 5, image: null, efficiency: 40 }
];

export const fakePanel: Panel = { id: 0, manufacturer: 1, name: 'panel1', company: 'solar1', price: 100000, power: 10, width: 3, length: 4, image: null, efficiency: 40 };


