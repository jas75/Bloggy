import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControl } from '@angular/forms';

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

  constructor(
    private formBuilder: FormBuilder
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
  }

}
