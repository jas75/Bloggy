import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { PostService } from './services/post.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { NewsComponent } from './components/news/news.component';
import { EditPostComponent } from './components/news/edit-post/edit-post.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { SamplesComponent } from './components/samples/samples.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    NewsComponent,
    EditPostComponent,
    PublicProfileComponent,
    SamplesComponent,
    EditProfileComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlashMessagesModule
  ],
  providers: [
  AuthService,
  AuthGuard,
  NotAuthGuard,
  PostService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
