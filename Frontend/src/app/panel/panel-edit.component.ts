import { isUndefined } from 'util';

import 'rxjs/add/operator/switchMap';

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Profile } from '../profile';
import { Panel } from './panel'

import { ProfileService } from '../profile.service';
import { PanelService } from './panel.service';
import { ImageService } from '../image-upload/image.service'

import { backendIp } from '../../assets/backend-ip';


@Component({
  selector: 'app-panel-edit',
  templateUrl: './panel-edit.component.html',
  styleUrls: ['./panel-edit.component.css']
})
export class PanelEditComponent implements OnInit {
  profile: Profile;
  manufacturer: Profile;
  panel: Panel = new Panel();
  image: File;
  withCredentials = false;
  backendIp: string;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private panelService: PanelService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('logged in user')) {
      this.profile = JSON.parse(sessionStorage.getItem('logged in user'));
      this.backendIp = backendIp;
      this.getPanel();
    }
  }

  getPanel(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.panelService.getPanel(+params.get('id')))
      .subscribe(panel => {
        this.panel = panel;

        this.profileService
          .getProfile(this.panel.manufacturer)
          .then(profile => {
            this.manufacturer = profile;
            const saveButton: HTMLInputElement = <HTMLInputElement> document.getElementById('save_button');

            if(this.manufacturer.id === this.profile.id) {
              saveButton.disabled = false;
            } else {
              saveButton.disabled = true;
            }
          });
      });
  }

  save(editPanel: Panel): void {
    let alertMessage = '';
    let isCorrect = true;

    if(editPanel.name === '') {
      alertMessage += 'Please enter a name of Panel.';
      isCorrect = false;
    } else if(editPanel.name.length >= 100) {
      alertMessage += 'Panel name should be less than 100 characters.';
      isCorrect = false;
    }

    if(editPanel.company === '') {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a company of Panel.';
      isCorrect = false;
    } else if(editPanel.company.length >= 100) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Company name should be less than 100 characters.';
      isCorrect = false;
    }

    if(editPanel.price === null || String(editPanel.price).length == 0) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a price of Panel.';
      isCorrect = false;
    } else if(!(new RegExp('^[0-9]+$', 'gm').test(String(editPanel.price))) ||
      editPanel.price < 0 || editPanel.price >= Math.pow(10, 12)) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += `Panel's price should be non negative integer and less than 1 trillion wons.`;
      isCorrect = false;
    }

    if(editPanel.power === null || String(editPanel.power).length == 0) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a power of Panel.';
      isCorrect = false;
    } else if(!(new RegExp('^[0-9]+$', 'gm').test(String(editPanel.power))) ||
      editPanel.power <= 0 || editPanel.power >= Math.pow(10, 6)) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += `Panel's power should be positive integer and less than 1 million watts.`;
      isCorrect = false;
    }

    if(editPanel.width === null || String(editPanel.width).length == 0) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a correct width of Panel.';
      isCorrect = false;
    } else if(!(new RegExp('^[0-9]{0,3}\\.?([0-9]{1,2})(?=\\.)?$', 'gm').test(String(editPanel.length))) ||
      !(editPanel.length > 0 && editPanel.length < 20)) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += `Panel's width should be between 0 to 20 exclusively and have at most 2 decimal digits.`;
      isCorrect = false;
    }

    if(editPanel.length === null || String(editPanel.length).length == 0) {
      if(alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += 'Please enter a correct length of Panel.';
      isCorrect = false;
    } else if(!(new RegExp('^[0-9]{0,3}\\.?([0-9]{1,2})(?=\\.)?$', 'gm').test(String(editPanel.length))) ||
      !(editPanel.length > 0 && editPanel.length < 20)) {
      if (alertMessage !== '') {
        alertMessage += '\n';
      }
      alertMessage += `Panel's length should be between 0 to 20 exclusively and have at most 2 decimal digits.`;
      isCorrect = false;
    }

    if(isCorrect) {
      this.panelService.update(editPanel)
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
    let url = 'http://' + this.backendIp + '/api/panel/' + this.panel.id + '/image/';
    this.imageService.postImage(url, image, CSRF_token(), partName, customForm, this.withCredentials).subscribe(() => {});
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/panel/' + this.panel.id]).then();
    // setTimeout(() => {
    //   this.router.navigate(['/panel/' + this.panel.id]).then(() => {
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
