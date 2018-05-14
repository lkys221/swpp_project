import { NgModule } from '@angular/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ProfileService } from './profile.service';
import { PanelService } from './panel/panel.service';
import { CommunityService } from './community/community.service';
import { GroupPurchaseService } from "./group-purchase/group-purchase.service";
import { ImageService } from './image-upload/image.service';

import { ArticleCreateComponent } from './community/article-create.component';
import { ArticleDetailComponent } from './community/article-detail.component';
import { ArticleEditComponent } from './community/article-edit.component';

import { NoticeComponent } from './community/Notice/notice.component';
import { ForumComponent } from './community/Forum/forum.component';
import { FaqComponent } from './community/FAQ/faq.component';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';

import { GPRecruitmentComponent } from './group-purchase/gp-recruitment.component';
import { GPRecruitmentCreateComponent } from "./group-purchase/gp-recruitment-create.component";
import { GPRecruitmentDetailComponent } from "./group-purchase/gp-recruitment-detail.component";
import { GPRecruitmentEditComponent } from "./group-purchase/gp-recruitment-edit.component";

import { HomeComponent } from './home/home.component';

import { PanelComponent } from './panel/panel.component';
import { PanelCreateComponent } from './panel/panel-create.component';
import { PanelDetailComponent } from './panel/panel-detail.component';
import { PanelEditComponent } from './panel/panel-edit.component';

import { SimulationComponent } from './simulation/simulation.component';
import { MypageComponent } from './mypage/mypage.component';

import { ImageUploadModule } from 'angular2-image-upload';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import {GooglePlaceModule} from "angular2-google-place"


@NgModule({
  declarations: [
    AppComponent,

    ArticleCreateComponent,
    ArticleDetailComponent,
    ArticleEditComponent,

    NoticeComponent,
    ForumComponent,
    FaqComponent,

    GPRecruitmentComponent,
    GPRecruitmentCreateComponent,
    GPRecruitmentDetailComponent,
    GPRecruitmentEditComponent,

    HomeComponent,

    PanelComponent,
    PanelCreateComponent,
    PanelDetailComponent,
    PanelEditComponent,

    SimulationComponent,
    
    MypageComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    Ng2FilterPipeModule,
    ChartsModule,
    ImageUploadModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD7L6NzZTAvEsdLdH5Yf0ZaIp3-eyCfbX8'
    }),
    GooglePlaceModule
  ],
  providers: [
    ProfileService,
    PanelService,
    CommunityService,
    GroupPurchaseService,
    ImageService,
    {provide: APP_BASE_HREF, useValue: '/'}
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
