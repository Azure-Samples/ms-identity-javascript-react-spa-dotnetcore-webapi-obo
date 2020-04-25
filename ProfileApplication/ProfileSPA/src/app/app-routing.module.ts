import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileRegisterComponent } from './profile-register/profile-register.component';

const routes: Routes = [
  {
    path: 'profile-edit/:id',
    component: ProfileEditComponent,
    canActivate: [
      MsalGuard
    ]
  },
  {
    path: 'profile-view',
    component: ProfileViewComponent,
    canActivate: [
      MsalGuard
    ]
  },
  {
    path: 'profile-register',
    component: ProfileRegisterComponent,
    canActivate: [
      MsalGuard
    ]
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
