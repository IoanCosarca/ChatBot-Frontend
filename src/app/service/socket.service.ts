import { Injectable } from '@angular/core';

import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://127.0.0.1:8080');
  }

  public requestInitialData(callback: (data: any) => void) {
    this.socket.on('connect', () => {});

    this.socket.on('initial_data', (data) => {
      callback(data);
    });
  }

  requestArticleCount(callback: (data: any) => void) {
    this.socket.on('article_count_update', (data) => {
      callback(data);
    });
  }

  requestSearchStage(callback: (data: any) => void) {
    this.socket.on('search_stage', (data) => {
      console.log(data)
      callback(data);
    })
  }
}
