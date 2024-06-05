import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { AnswerModel } from "../model/answer.model";
import { QuestionModel } from "../model/question.model";

import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private httpClient: HttpClient) { }

  public getResources(): Observable<string[]> {
    return this.httpClient.get<string[]>(`http://127.0.0.1:8080/ai`);
  }

  public askQuestion(question: QuestionModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai`, question);
  }
}
