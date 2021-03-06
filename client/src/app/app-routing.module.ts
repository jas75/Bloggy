import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { NewsComponent } from './components/news/news.component';
import { EditPostComponent } from './components/news/edit-post/edit-post.component';
import { SamplesComponent } from './components/samples/samples.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

// Our Array of Angular 2 Routes
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // The Default Route
  },
  {
    path:'register',
    component: RegisterComponent,
    canActivate:[NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate:[NotAuthGuard]
  },
  {
    path: 'stream',
    component: NewsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'edit-post/:id',
    component: EditPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'user/:username',
    component: PublicProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"samples",
    component: SamplesComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'edit-profile',
    component: EditProfileComponent,
    canActivate:[AuthGuard]
  },
  { path: '**', component: HomeComponent } // The "Catch-All" Route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }