import { Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private serverUrl = 'http://localhost:8080/websocket'
  private title = 'WebSockets chat';
  private stompClient;
  someText:string;
  messageStore=[];

  constructor(){
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/test/queue", (message) => {
        if(message.body) {
          that.messageStore.push(JSON.parse(message.body).content);
        }
      });
    });
  }
  sendMessage(){
    this.stompClient.send("/app/chat" , {}, JSON.stringify({'name':this.someText}));
    this.someText="";
  }

  disconnect(){
    this.stompClient.disconnect();
  }
  



}
