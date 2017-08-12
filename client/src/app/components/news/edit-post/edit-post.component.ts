import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; 
import { Router } from '@angular/router';
import { PostService } from '../../../services/post.service';


@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

	processing=false;
	message;
	messageClass;
	post;
	currentUrl;
	loading=true;
	

  constructor(
  	private location: Location,
  	private postService: PostService,
  	private activatedRoute:ActivatedRoute,
  	private router: Router
  	) { }

  updatePostSubmit(){
  	this.processing=true;
  	this.postService.editPost(this.post).subscribe(data=>{
  		if(!data.success){
  			this.messageClass="alert alert-danger";
  			this.message=data.message;
  			this.processing=false;
  		}
  		else{
  			this.messageClass="alert alert-success";
  			this.message=data.message;
  			setTimeout(()=>{
  				this.router.navigate(['/news']);
  			},2000);
  		}
  	});
  }

  goBack(){
  	this.location.back(); // go to the previous page
  }
  ngOnInit() {
  	this.currentUrl=this.activatedRoute.snapshot.params; // allows me to grab the params in url
  	this.postService.getSinglePost(this.currentUrl.id).subscribe(data=>{
  		if(!data.success){
  			this.messageClass="alert alert-danger";
  			this.message=data.message;
  		}
  		else{
  			this.post=data.post;
  			this.loading=false;
  		}
  		
  	});
  }


}
