import { Injectable } from '@angular/core';
import { CanActivate, Router,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  // Url that users going to be redirected to
  redirectUrl;

  constructor(
    private authService:AuthService,
    private router:Router
    ){

  }

  // This function is used in the app-routing.module file
  canActivate(
    router:ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ) {
    if (this.authService.loggedIn()){
      return true;
    }
    else{
      this.redirectUrl= state.url;  // Snapshot of the  url that the user initially comes 
      this.router.navigate(['/login']);
      return false;
    }
  }
}