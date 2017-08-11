import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {


	isDisabled:boolean=true;
	message;
	messageClass;
	loadingPosts=false;

  constructor() { }

  reloadPosts(){
  	this.loadingPosts=true;
  	//Get all blogs
  	setTimeout(()=>{
  		this.loadingPosts=false;
  	},3000);
  }

  ngOnInit() {
  }

}
