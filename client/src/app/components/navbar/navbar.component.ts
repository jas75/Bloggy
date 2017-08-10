import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usernameNavbar;

  constructor(
  	private authService:AuthService,
  	private router:Router,
  	private flashMessagesService:FlashMessagesService
  	) {
      
     }  

  

  onLogoutClick(){
  	this.authService.logout();
  	this.flashMessagesService.show('You are logged out',{cssClass: 'alert-info'});
  	this.router.navigate(['/']);
  }

  usernameNav(){
      this.authService.getProfile().subscribe(data=>{
        this.usernameNavbar=data.user.username;
      }); 
  }

  ngOnInit() {
      this.usernameNav();
      this.authService.navbarUsernameSubject.subscribe(data=> this.usernameNavbar=data);
  }

}
