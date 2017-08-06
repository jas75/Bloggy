import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


	form: FormGroup;

  constructor(
  	private formBuilder: FormBuilder
  	) { 
  	this.createForm();
  }

  createForm(){
  	this.form= this.formBuilder.group({
  		email:'',
  		username:'',
  		password:'',
  		confirm:''
  	});
  }
  ngOnInit() {
  }

}
