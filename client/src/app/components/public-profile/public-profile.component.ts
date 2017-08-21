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

	username; // public page user
  email;// public page email
	currentUrl;
  currentUser;// current user
	foundProfile=false;  
  messageClassPublicProfile;
  messagePublicProfile;
	messageClass;
	message;
  form;
  commentForm;
  postIdToDelete;
  deleteMessageClass;
  deleteMessage;
  publicProfilePosts;
  newComment=[];
  enabledComments=[];

  constructor(
  	private authService:AuthService,
    private postService:PostService,
  	private activatedRoute:ActivatedRoute,
    private formBuilder:FormBuilder,
    private router: Router
  	) {
      this.createPostForm();
      this.createCommentForm();
     }
/* ======
  Posts
======= */
  createPostForm(){
    this.form=this.formBuilder.group({
      body:['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(500)
        ])]
    })
  }

  enablePostForm(){
    this.form.get('body').enable();
  }
  disablePostForm(){
    this.form.get('body').disable();
  }

  onPostSubmit(){
    const post ={
      body: this.form.get('body').value,
      createdBy:this.currentUser,
      to:this.username
    }
    this.postService.newPost(post).subscribe(data=>{
      if(!data.success){
        this.message=data.message;
        this.messageClass="alert alert-danger";
      }
      else{
        this.disablePostForm();
        this.message=data.message;
        this.messageClass="alert alert-success";
        this.getPublicProfilePosts(this.currentUrl.username);
        setTimeout(()=>{
          this.form.reset();
          this.message=null;
          this.enablePostForm();
        },1500);
      }
    });
  }
  

  getPublicProfilePosts(username){
    this.postService.getPublicProfilePosts(username).subscribe(data=>{
      this.publicProfilePosts=data.posts;
    });
  }

  likePost(id){
    this.postService.likedPost(id).subscribe(data=>{
      this.getPublicProfilePosts(this.currentUrl.username);
    });
  }

  dislikePost(id){
    this.postService.dislikedPost(id).subscribe(data=>{
      this.getPublicProfilePosts(this.currentUrl.username);
    });
  }

  onClickDelete(id){
    this.postIdToDelete=null;
    this.postIdToDelete=id;
  }

  onSureDelete(){
    this.postService.deletePost(this.postIdToDelete).subscribe(data=>{
      if(!data.success){
        this.deleteMessageClass="alert alert-danger";
        this.deleteMessage=data.message;
      }
      else{
        this.deleteMessage=data.message;
        this.deleteMessageClass="alert alert-success";
        setTimeout(()=>{
          this.deleteMessage=null;
          window.location.reload();
        },1500);
      }
    });
  }

  redirectTo(username){ // if current user click on his own name
    if(username===this.currentUser){
      this.router.navigate(['/profile']);
    }
    else{
      this.router.navigate(['/user/'+username]);
    }
  }
/*=======
  Posts
=======*/

/*========
  Comments
  ========*/

  createCommentForm(){
    this.commentForm=this.formBuilder.group({
      comment: ['',Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(300)
        ])]
    });
  }
  postComment(id){
    const comment = this.commentForm.get('comment').value;
    this.postService.postComment(id,comment).subscribe(data=>{
      this.getPublicProfilePosts(this.currentUrl.username);
      const index=this.newComment.indexOf(id);
      this.newComment.splice(index,1);
      this.commentForm.reset();
      if(this.enabledComments.indexOf(id) < 0) this.expand(id);
    });
  }
  draftComment(id){
    this.newComment=[];
    this.newComment.push(id);
  }

  cancelSubmission(id){
    const index= this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
  }

  expand(id){
    this.enabledComments=[];
    this.enabledComments.push(id);
  }

  collapse(id){
    this.enabledComments=[];
    const index=this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }
/*========
  Comments
  ========*/


  ngOnInit() {
  	this.currentUrl= this.activatedRoute.snapshot.params;
  	this.authService.getPublicProfile(this.currentUrl.username).subscribe(data=>{
  		if(!data.success){
  			this.messageClassPublicProfile="alert alert-danger";
  			this.messagePublicProfile=data.message
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
    });
  }

}
