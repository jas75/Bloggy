import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

	username;
  email;
	currentUrl;
  currentUser;
	foundProfile=false;
	messageClass;
	message;
  form;
  publicProfilePosts;

  constructor(
  	private authService:AuthService,
    private postService:PostService,
  	private activatedRoute:ActivatedRoute,
    private formBuilder:FormBuilder,
    private router: Router
  	) {
      this.createPostForm();
     }

  createPostForm(){
    this.form=this.formBuilder.group({
      body:['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(500)
        ])]
    })
  }

  getPublicProfilePosts(username){
    this.postService.getPublicProfilePosts(username).subscribe(data=>{
      this.publicProfilePosts=data.posts;
    });
  }

  ngOnInit() {
  	this.currentUrl= this.activatedRoute.snapshot.params;
  	this.authService.getPublicProfile(this.currentUrl.username).subscribe(data=>{
  		if(!data.success){
  			this.messageClass="alert alert-danger";
  			this.message=data.message
  		}
  		else{
  			this.username=data.user.username;
        this.email=data.user.email
  			this.foundProfile=true;
  		}
  	});
    this.getPublicProfilePosts(this.currentUrl.username);
    this.authService.getProfile().subscribe(data=>{
      this.currentUser=data.user.username;
      if(this.currentUser===this.username){ // if the public profile is the current user's redirect to profile
      this.router.navigate(['/profile']);
    }
    });
    
  }

}
