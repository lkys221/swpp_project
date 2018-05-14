import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    private router: Router
  ) { }

  gotoSimulationPage(): void {
    this.router.navigate(['/simulation']).then();
  }

  gotoCommunityPage(): void {
    this.router.navigate(['/community']).then();
  }


}
