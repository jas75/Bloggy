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
  commentForm;
  messageClass;
  message;
  profilePosts;
  newComment=[];
  enabledComments=[];

  constructor(
  	private authService:AuthService,
    private postService:PostService,
    private formBuilder:FormBuilder
  	) { 
    this.createPostForm();
    this.createCommentForm();
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

  createCommentForm(){
    this.commentForm=this.formBuilder.group({
      comment:['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(300)
        ])]
    });
  }

  onPostSubmit(){
    const post = {
      body: this.form.get('body').value,
      createdBy: this.username // grab every data
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
          this.form.reset();
        },1500);
      }
    });
  }

  getCurrentUserPosts(){
    this.postService.getCurrentUserPosts().subscribe(data=>{
      this.profilePosts=data.posts;
    });
  }

  // postComment(id){

  // }

  likePost(id){
    this.postService.likedPost(id).subscribe(data=>{
      this.getCurrentUserPosts();
    });
  }

  dislikePost(id){
    this.postService.dislikedPost(id).subscribe(data=>{
      this.getCurrentUserPosts();
    });
  }

  draftComment(id){
    this.newComment=[]; // reset the array so there's no confusion
    this.newComment.push(id); // put the id of the current post so we know that it is activated
    this.commentForm.reset();// reset the form
  }

  cancelSubmission(id){
    const index=this.newComment.indexOf(id); // search for the id of the post
    this.newComment.splice(index);// remove the id from the array
    this.commentForm.reset();
  }

//hide comments
  collapse(id){
    this.enabledComments=[];
    const index=this.enabledComments.indexOf(id);
    this.enabledComments.splice(index,1);
  }

// show comments
  expand(id){
    this.enabledComments.push(id);
  }

  ngOnInit() {
  	this.authService.getProfile().subscribe(data=>{
    	this.username=data.user.username;
      this.email=data.user.email;
  	});
    this.getCurrentUserPosts();
  }

}
