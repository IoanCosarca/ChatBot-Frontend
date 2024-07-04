import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

import { AnswerModel } from "../model/answer.model";
import { ForGenerationModel } from "../model/for-generation.model";
import { ImageModel } from "../model/image.model";
import { QueryModel } from "../model/query.model";
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

  public getImage(request: QueryModel): Observable<ImageModel> {
    return this.httpClient.get<ImageModel>(`http://127.0.0.1:8080/ai/image`, {
      params: {
        query: request.query,
        model: request.model
      }
    });
  }

  public getConsideredImages(): Observable<ImageModel[]> {
    return this.httpClient.get<ImageModel[]>(`http://127.0.0.1:8080/ai/considered_images`);
  }

  public askQuestionV1(request: QueryModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai/v1`, request);
  }

  public askQuestionV2(request: QueryModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai/v2`, request);
  }

  public generateQuery(request: ForGenerationModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai/v3/sparql`, request);
  }

  public askBasedOnGenerated(question_n_sparql: SparqlGeneratedModel): Observable<AnswerModel> {
    return this.httpClient.post<AnswerModel>(`http://127.0.0.1:8080/ai/v3/dbpedia`, question_n_sparql);
  }
}
