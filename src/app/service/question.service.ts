import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { AnswerModel } from "../model/answer.model";
import { ImageModel } from "../model/image.model";
import { QuestionModel } from "../model/question.model";
import { SparqlGeneratedModel } from "../model/sparql-generated.model";

import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private httpClient: HttpClient) { }

  public getResources(): Observable<string[]> {
    return this.httpClient.get<string[]>(`http://127.0.0.1:8080/ai`);
  }

  public getImage(retrieved_response: string): Observable<ImageModel> {
    return this.httpClient.get<ImageModel>(`http://127.0.0.1:8080/ai/image?retrieved_response=${encodeURIComponent(retrieved_response)}`);
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

  public askBasedOnGenerated(question_n_sparql: SparqlGeneratedModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai/v3/dbpedia`, question_n_sparql);
  }
}
