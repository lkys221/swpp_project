import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { NoticeComponent } from './community/Notice/notice.component';

import { SimulationComponent } from './simulation/simulation.component';

import { PanelComponent } from './panel/panel.component';
import { PanelCreateComponent } from './panel/panel-create.component';
import { PanelDetailComponent } from './panel/panel-detail.component';
import { PanelEditComponent } from './panel/panel-edit.component';

import { GPRecruitmentComponent } from './group-purchase/gp-recruitment.component';
import { GPRecruitmentCreateComponent } from "./group-purchase/gp-recruitment-create.component";
import { GPRecruitmentDetailComponent } from "./group-purchase/gp-recruitment-detail.component";
import { GPRecruitmentEditComponent } from "./group-purchase/gp-recruitment-edit.component";

import { ArticleCreateComponent } from "./community/article-create.component";
import { ArticleDetailComponent } from "./community/article-detail.component";
import { ArticleEditComponent } from "./community/article-edit.component";
import { ForumComponent } from "./community/Forum/forum.component";
import { FaqComponent } from "./community/FAQ/faq.component";

import { MypageComponent } from "./mypage/mypage.component";


export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'community', component: NoticeComponent },
  { path: 'community/forum', component: ForumComponent },
  { path: 'community/faq', component: FaqComponent },
  { path: 'community/detail/:id', component: ArticleDetailComponent},
  { path: 'community/edit/:id', component: ArticleEditComponent},
  { path: 'community/create', component: ArticleCreateComponent },
  { path: 'simulation', component: SimulationComponent },
  { path: 'panel', component: PanelComponent },
  { path: 'panel/create', component: PanelCreateComponent },
  { path: 'panel/:id', component: PanelDetailComponent },
  { path: 'panel/:id/edit', component: PanelEditComponent },
  { path: 'gp/recruitment', component: GPRecruitmentComponent },
  { path: 'gp/recruitment/create', component: GPRecruitmentCreateComponent },
  { path: 'gp/recruitment/:id', component: GPRecruitmentDetailComponent },
  { path: 'gp/recruitment/:id/edit', component: GPRecruitmentEditComponent },
  { path: 'mypage', component: MypageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
