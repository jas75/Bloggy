import { Injectable }       from '@angular/core';
import {
  CanActivate, Router
}                           from '@angular/router';
import { AuthService }      from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

  constructor(
    private authService:AuthService,
    private router:Router
    ){

  }

  // This function is used in the app-routing.module file
  canActivate() {
    if (this.authService.loggedIn()){
      this.router.navigate(['/']);
      return false;
    }
    else{
      return true;
    }
  }
}