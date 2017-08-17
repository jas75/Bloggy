import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	username;
  email;
  form;
  messageClass;
  message;
  profilePosts;

  constructor(
  	private authService:AuthService,
    private postService:PostService,
    private formBuilder:FormBuilder
  	) { 
    this.createPostForm();
  }

  createPostForm(){
    this.form=this.formBuilder.group({
      body:['',Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(500)
        ])]
    });
  }

  onPostSubmit(){
    const post = {
      body: this.form.get('body').value,
      createdBy: this.username
    }
    this.postService.newPost(post).subscribe(data=>{
      if(!data.success){
        this.message=data.message;
        this.messageClass= "alert alert-danger";
      }
      else{
        this.message=data.message;
        this.messageClass="alert alert-success";
        setTimeout(()=>{
          this.getCurrentUserPosts();
          this.message=null;
          this.messageClass=null;
        },1500);
      }
    });
  }

  getCurrentUserPosts(){
    this.postService.getCurrentUserPosts().subscribe(data=>{
      this.profilePosts=data.posts;
    });
  }

  ngOnInit() {
  	this.authService.getProfile().subscribe(data=>{
    	this.username=data.user.username;
      this.email=data.user.email;
  	});
    this.getCurrentUserPosts();
  }

}
