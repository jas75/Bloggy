import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthGuard } from '../../guards/auth.guard';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  form : FormGroup;
	forgot=false;
  message;
  messageClass;
  processing=false;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private router: Router,
    private flashMessagesService:FlashMessagesService,
    private authGuard:AuthGuard
    ) { 
    this.createForm();
  }


  createForm(){
    this.form=this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required]
    })
  }

  onLoginSubmit(){
    this.disableForm();
    this.processing=true;

    const user={
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.login(user).subscribe(data=>{
      if(!data.success){
        this.messageClass="alert alert-danger";
        this.message=data.message;
        this.processing=false;
        this.enableForm();
      }
      else{
        this.messageClass="alert alert-success";
        this.message=data.message;
        this.authService.storeUserData(data.token,data.user);
        setTimeout(()=>{
          if (this.previousUrl) { // then we know that the user was redirected
            this.router.navigate([this.previousUrl]); // redirect to the initial url
          }else{
            this.router.navigate(['/stream']);
          }
        },1500);
        this.disableForm();
        this.flashMessagesService.show('Welcome to bloggy, '+ this.form.get('username').value +' !',{cssClass: 'alert-info'});
        this.authService.addUsernameNavbar(data.user.username);
      }
    });
  }


  disableForm(){
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }
  enableForm(){
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }
  /* =========
  Display a forgot field
  ============ */

  onForgotClick(){
  	this.forgot=true;
  }
  accountAccess(){
    this.forgot=false;
  }
  ngOnInit() {

    if(this.authGuard.redirectUrl){  // if this exists, then the AuthGuard was activated
      this.messageClass="alert alert-danger";
      this.message="You must be logged in to view that page";
      this.previousUrl=this.authGuard.redirectUrl;
      this.authGuard.redirectUrl=undefined;
    }
  }

}
