import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Subject } from 'rxjs/Subject'; 
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class AuthService {

	domain= "http://localhost:8080/";
  authToken;
  user;
  options;
  public navbarUsernameSubject = new Subject<any>();
  progress$;
  progressObserver;
  progress;

  constructor(
  	private http: Http
  	) {
    this.progress$= Observable.create(observer => {
      this.progressObserver = observer;
    }).share(); 
  }

  makeFileRequest(url: string,params: string[],files: File[]): Observable<any>{
    return Observable.create(observer => {
      let formData: FormData = new FormData();
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      for(let i =0; i<files.length;i++){
        formData.append('file',files[i],files[i].name);
      }

      xhr.onreadystatechange = ()=>{
        if(xhr.readyState === 4){
          if(xhr.status===200){
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          }
          else{
            observer.error(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = (event)=>{
        this.progress = Math.round(event.loaded / event.total *100);

        this.progressObserver.next(this.progress);
      }
      xhr.open('POST',url,true);
      xhr.setRequestHeader('authorization',this.authToken);
      xhr.send(formData);
    });
  }

  createAuthenticationHeaders(){
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type':'application/json',
        'authorization':this.authToken
      })
    });
  }

  loadToken(){
    this.authToken=localStorage.getItem('token');
  }

  registerUser(user){
  	return this.http.post(this.domain + 'authentication/register',user).map(res=>res.json());
  }

  checkEmail(email){
  	return this.http.get(this.domain + 'authentication/checkEmail/' + email).map(res=>res.json());
  }

  checkUsername(username){
  	return this.http.get(this.domain + 'authentication/checkUsername/' + username).map(res=>res.json());
  }

  // Store the JWToken in Local storage
  storeUserData(token,user){
    localStorage.setItem('token',token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken=token;
    this.user=user;
  }

  login(user){
    return this.http.post(this.domain + 'authentication/login', user).map(res=>res.json());
  }

  logout(){
    this.authToken=null;
    this.user=null;
    localStorage.clear();
  }

  loggedIn(){
    return tokenNotExpired();
  }

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/profile',this.options).map(res=>res.json());
  }

  addUsernameNavbar(username){
    this.navbarUsernameSubject.next(username);
  }

  getPublicProfile(username){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/publicProfile/' + username, this.options).map(res=>res.json());
  }
  editProfile(bio,location,gender,birthday){
    this.createAuthenticationHeaders();
    const editData = { bio:bio,location:location,gender:gender,birthday:birthday};
    return this.http.put(this.domain + 'authentication/editProfile',editData,this.options).map(res=>res.json());
  }
}
