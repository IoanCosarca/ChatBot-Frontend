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

  public askQuestionV1(question: QuestionModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai/v1`, question);
  }

  public askQuestionV2(question: QuestionModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai/v2`, question);
  }

  public generateQuery(question: QuestionModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai/v3/sparql`, question);
  }

  public askBasedOnGenerated(question: QuestionModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai/v3/dbpedia`, question);
  }
}
