import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {


	message;
	messageClass;
	loadingPosts=false;
  form;
  commentForm;
  processing=false;
  username;
  newsPosts;
  postIdToDelete;
  newComment=[];//because there might be lot of comments, we need an array
  enabledComments=[];
  showCommentForm=false;

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private postService:PostService,
    private location: Location,
    private router: Router
    ) {
      this.createPostForm(); 
      this.createCommentForm();
    }

  createPostForm(){
    this.form=this.formBuilder.group({
      body:['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(500)
        ])]
    });
  }

  enablePostForm(){
    this.form.get('body').enable();
  }

  disablePostForm(){
    this.form.get('body').disable();
  }

  enableCommentForm(){
    this.commentForm.get('comment').enable();
  }
  disableCommentForm(){
    this.commentForm.get('comment').disable();
  }

  // When the refresh button is hit
  reloadPosts(){
  	this.loadingPosts=true;
    this.getAllPosts();
  	//Get all blogs
  	setTimeout(()=>{
  		this.loadingPosts=false;
  	},3000);
  }


  onPostSubmit(){
    this.processing=true;
    this.disablePostForm();
    
    const post = {
      body: this.form.get('body').value,
      createdBy: this.username
    }
    this.postService.newPost(post).subscribe(data=>{
      if (!data.success) {
        this.messageClass="alert alert-danger";
        this.message=data.message;
        this.processing=false;
        this.enablePostForm();
      }
      else{
        this.messageClass="alert alert-success";
        this.message= data.message; 
        setTimeout(()=>{
          this.processing=false;
          this.message=false;
          this.form.reset();
          this.enablePostForm();
          window.location.reload(); // refresh page
        },1500);
      }
    });
  }

  onClickDelete(id){ // grab the post id to delete 
    this.postIdToDelete=id;
    }

  onSureDelete(){
    this.processing=true;
    this.postService.deletePost(this.postIdToDelete).subscribe(data=>{
      if (!data.success) {
        this.message=data.message;
        this.messageClass="alert alert-danger";
      }
      else{
        this.message=data.message;
        this.messageClass="alert alert-success";
        setTimeout(()=>{
          this.processing=false;
          window.location.reload();
        },2000);
      }
    });
  }

  goBack(){
    this.location.back(); // refresh the page 
  }

  getAllPosts(){
    this.postService.getAllPosts().subscribe(data=>{
      this.newsPosts=data.posts;
    });
  }

  ngOnInit() {

    // I take the user that is currently logged in to pass his name on post form
    this.authService.getProfile().subscribe(data=>{
      this.username=data.user.username;
    });
    this.getAllPosts();
  }

  likePost(id){
    this.postService.likedPost(id).subscribe(data=>{
    this.getAllPosts();
    });
  }

  dislikePost(id){
    this.postService.dislikedPost(id).subscribe(data=>{
      this.getAllPosts();
    });
  }

  redirectTo(username){ // if current user click on his own name
    if(username===this.username){
      this.router.navigate(['/profile']);
    }
    else{
      this.router.navigate(['/user/'+username]);
    }
  }

  /*======
  Comments
  =======*/

  postComment(id){
    this.disableCommentForm();
    this.processing=true;
    const comment= this.commentForm.get('comment').value;
    this.postService.postComment(id,comment).subscribe(data=>{
      this.getAllPosts();
      const index= this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing=false;
      if(this.enabledComments.indexOf(id) < 0) this.expand(id);
    });
  }

  draftComment(id){
    this.newComment=[]; // to know the difference between posts
    this.newComment.push(id); // grabs the post id that's goin to be commented
    this.showCommentForm=true;
    this.commentForm.reset();
  }
  cancelSubmission(id){
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index);
    this.commentForm.reset();
    this.enableCommentForm();
    this.showCommentForm=false;
  }


  createCommentForm(){ // Comment form
    this.commentForm=this.formBuilder.group({
      comment: ['',Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(300)
        ])]
    });
  }

  // show the comments
  expand(id){
    this.enabledComments.push(id);
  }

  //hide the comments
  collapse(id){
    const index=this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

}
