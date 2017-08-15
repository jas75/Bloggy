import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { Http, Headers, RequestOptions} from '@angular/http';

@Injectable()
export class PostService {

	options;
	domain=this.authService.domain;

  constructor(
  	private authService:AuthService,
  	private http: Http
  	) { }

  createAuthenticationHeaders(){
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type':'application/json',
        'authorization':this.authService.authToken
      })
    });
  }

  newPost(post){
  	this.createAuthenticationHeaders();
  	return this.http.post(this.domain + 'posts/newPost', post,this.options).map(res=>res.json());
  }

  getAllPosts(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'posts/allPosts',this.options).map(res=>res.json());
  }

  getSinglePost(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'posts/singlePost/'+ id, this.options).map(res=>res.json());
  }

  editPost(post){
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'posts/updatePost', post, this.options).map(res=>res.json());
  }

  deletePost(id){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'posts/deletePost/' + id, this.options).map(res=>res.json());
  }

  likedPost(id){
    this.createAuthenticationHeaders();
    const blogData={id:id};
    return this.http.put(this.domain + 'posts/likePost',blogData,this.options).map(res=>res.json());
  }

  dislikedPost(id){
    this.createAuthenticationHeaders();
    const blogData={id:id};
    return this.http.put(this.domain + 'posts/dislikePost',blogData,this.options).map(res=>res.json());
  }

}
