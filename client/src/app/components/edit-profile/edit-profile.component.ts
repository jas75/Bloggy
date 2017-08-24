import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

	editForm;
  messageClass;
  message;
  user;
  birthday;
  bYear; // cut the date to fit the select tag
  bMonth;
  bDay;
  

  constructor(
  	private formBuilder:FormBuilder,
  	private authService:AuthService
  	) {
  	this.createEditForm(); 
  }

  createEditForm(){
  	this.editForm=this.formBuilder.group({
  		bio: ['',Validators.maxLength(500)],
  		location: [''],
  		gender:['',Validators.maxLength(40)],
  		YYYY:[''],
  		mm:[''],
  		dd:['']
  	})
  }

  onEditSubmit(){
  	const bio =this.editForm.get('bio').value;
  	const location=this.editForm.get('location').value;
  	const gender= this.editForm.get('gender').value;
  	const birthday = new Date(this.editForm.get('YYYY').value + "-"+this.editForm.get('mm').value+"-"+this.editForm.get('dd').value);

  	this.authService.editProfile(bio,location,gender,birthday).subscribe(data=>{
  		if (!data.success) {
  			this.messageClass= "alert alert-danger";
        this.message=data.message;
        setTimeout(()=>{
          this.message=null;
        },1500);
  		}
  		else{
  			this.messageClass= "alert alert-success";
        this.message=data.message;
        setTimeout(()=>{
          this.message=null;
        },1500);
  		}
  	});
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(data=>{
      this.user=data.user;
      this.birthday=new Date(this.user.birthday);
      this.bMonth=this.birthday.getUTCMonth() + 1;
      this.bYear=this.birthday.getUTCFullYear();
      this.bDay=this.birthday.getUTCDate();
    });
  }

}
