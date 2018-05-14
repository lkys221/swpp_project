import { isUndefined } from 'util';

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { Profile } from '../profile';
import { Panel} from './panel';

import { PanelService } from './panel.service'
import { ImageService } from  '../image-upload/image.service'

import { backendIp } from '../../assets/backend-ip';


@Component({
  selector: 'app-panel-create',
  templateUrl: './panel-create.component.html',
  styleUrls: ['./panel-create.component.css']
})
export class PanelCreateComponent implements OnInit {
  profile: Profile;
  createPanel: Panel = {
    id: -1,
    manufacturer: -1,
    name: '',
    company: '',
    price: null,
    power: null,
    width: null,
    length: null,
    image: null,
    efficiency: null
  };
  image: File;
  backendIp: string;

  constructor(
    private router: Router,
    private location: Location,
    private panelService: PanelService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    const createButton: HTMLInputElement = <HTMLInputElement> document.getElementById('create_button');

    if (sessionStorage.getItem('logged in user')) {
      this.profile = JSON.parse(sessionStorage.getItem('logged in user'));
      this.backendIp = backendIp;
    }

    if(this.profile.type === '1') {
      createButton.disabled = false;
    } else {
      createButton.disabled = true;
      }
  }

  create(createPanel: Panel): void {
    let alertMessage = '';
    let isCorrect = true;

    if(createPanel.name === '') {
      alertMessage += 'Please enter a name of Panel.';
      isCorrect = false;
    } else if(createPanel.name.length >= 100) {
      alertMessage += 'Panel name should be less than 100 characters.';
      isCorrect = false;
    }

    if(createPanel.company === '') {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a company of Panel.';
      isCorrect = false;
    } else if(createPanel.company.length >= 100) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Company name should be less than 100 characters.';
      isCorrect = false;
    }

    if(createPanel.price === null || String(createPanel.price).length == 0) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a price of Panel.';
      isCorrect = false;
    } else if(!(new RegExp('^[0-9]+$', 'gm').test(String(createPanel.price))) ||
      createPanel.price < 0 || createPanel.price >= Math.pow(10, 12)) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += `Panel's price should be non negative integer and less than 1 trillion wons.`;
      isCorrect = false;
    }

    if(createPanel.power === null || String(createPanel.power).length == 0) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a power of Panel.';
      isCorrect = false;
    } else if(!(new RegExp('^[0-9]+$', 'gm').test(String(createPanel.power))) ||
      createPanel.power <= 0 || createPanel.power >= Math.pow(10, 6)) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += `Panel's power should be positive integer and less than 1 million watts.`;
      isCorrect = false;
    }

    if(createPanel.width === null || String(createPanel.width).length == 0) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a correct width of Panel.';
      isCorrect = false;
    } else if(!(new RegExp('^[0-9]{0,3}\\.?([0-9]{1,2})(?=\\.)?$', 'gm').test(String(createPanel.width))) ||
      !(createPanel.width > 0 && createPanel.width < 20)) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += `Panel's width should be between 0 to 20 exclusively and have at most 2 decimal digits.`;
      isCorrect = false;
    }

    if(createPanel.length === null || String(createPanel.length).length == 0) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a correct length of Panel.';
      isCorrect = false;
    } else if(!(new RegExp('^[0-9]{0,3}\\.?([0-9]{1,2})(?=\\.)?$', 'gm').test(String(createPanel.length))) ||
      !(createPanel.length > 0 && createPanel.length < 20)) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += `Panel's length should be between 0 to 20 exclusively and have at most 2 decimal digits.`;
      isCorrect = false;
    }

    if(isCorrect) {
      this.panelService.create(
        createPanel.name,
        createPanel.company,
        createPanel.price,
        createPanel.power,
        createPanel.width,
        createPanel.length
      )
      .then(() => {
        if(!isUndefined(this.image)) {
          this.uploadImage(this.image, 'image');
        } else {
          this.goBack();
        }
      });
    } else {
      alert(alertMessage);
    }
  }

  onFileUpload(event: any): void {
    this.image = event.file;
  }

  uploadImage(image: File, partName: string = 'image', customForm?: { [name: string]: any }): void {
    this.panelService
      .getPanels()
      .then(panels => {
        let url = 'http://' + this.backendIp + '/api/panel/' + panels[panels.length - 1].id + '/image/';
        this.imageService.postImage(url, image, CSRF_token(), partName, customForm, false).subscribe(() => {});
        this.goBack();
      });
  }

  goBack(): void {
    this.router.navigate(['/panel']).then();
    // setTimeout(() => {
    //   this.router.navigate(['/panel']).then(() => {
    //     location.reload();
    //   });
    // }, 100);
  }
}

function CSRF_token(): Headers {
  const cookie = document.cookie.split('=')[1];
  return new Headers({
    'Content-Type': 'application/json',
    'X-CSRFTOKEN': cookie
  });
}
