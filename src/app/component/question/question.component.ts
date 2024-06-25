import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCard, MatCardContent, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatInput, MatLabel }  from "@angular/material/input";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AnswerModel } from "../../model/answer.model";
import { QuestionModel } from "../../model/question.model";
import { SparqlGeneratedModel } from "../../model/sparql-generated.model";
import { QuestionService } from "../../service/question.service";

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatButtonToggleModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressSpinnerModule,
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
  animations: [
    trigger('listStagger', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(
              '500ms',
              animate(
                '550ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
              )
            )
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class QuestionComponent {
  question: QuestionModel = {
    query: ""
  };
  answer = '';
  displayedAnswer = '';
  showAnswer = false;
  isLoading = false;
  resources: string[] = [];
  showResources = false;
  inputDisabled = false;
  @ViewChild('textarea') textarea!: ElementRef;
  selectedVersion = 'version1';
  question_n_sparql: SparqlGeneratedModel = {
    generated_sparql: "",
    query: ""
  };
  showGeneratedQuery = false;
  displayedGeneratedQuery = '';

  constructor(private questionService: QuestionService) { }

  adjustTextareaHeight() {
    const textarea = this.textarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  getAnswer() {
    if (this.question.query !== '') {
      this.resetState();
      this.isLoading = true;

      if (this.selectedVersion === 'version1') {
        this.showAnswer = true;
        this.questionService.askQuestionV1(this.question).subscribe(
          (answer: AnswerModel) => this.handleResponse(answer),
          () => this.handleError("")
        );
      }
      else if (this.selectedVersion === 'version2') {
        this.showAnswer = true;
        this.questionService.askQuestionV2(this.question).subscribe(
          (answer: AnswerModel) => this.handleResponse(answer),
          () => this.handleError("")
        );
      }
      else if (this.selectedVersion === 'version3') {
        this.showGeneratedQuery = true;
        this.questionService.generateQuery(this.question).subscribe(
          (answer: AnswerModel) => {
            this.displayGeneratedQuery(answer.query_response);
          },
          () => {
            this.showGeneratedQuery = false;
            this.showAnswer = true;
            this.handleError("")
          }
        );
      }
    }
  }

  handleResponse(answer: AnswerModel) {
    this.answer = answer.query_response;
    this.isLoading = false;
    this.typeAnswer(this.answer, "answer").then(() => {
      if (answer.status == 200) {
        this.fetchResources();
      }
    });
  }

  handleError(error_message: string) {
    this.isLoading = false;
    if (error_message == "") {
      this.answer = 'An error occurred while fetching the answer. Try sending your request again.';
    }
    else {
      this.answer = error_message;
    }
    this.typeAnswer(this.answer, "answer").then(() => {
      this.enableInput();
    });
  }

  displayGeneratedQuery(sparqlQuery: string) {
    this.displayedGeneratedQuery = '';

    this.typeAnswer(sparqlQuery, "generated query").then(() => {
      this.handleGeneratedQuery(sparqlQuery);
    });
  }

  handleGeneratedQuery(sparqlQuery: string) {
    this.showAnswer = true;
    this.question_n_sparql.generated_sparql = sparqlQuery;
    this.question_n_sparql.query = this.question.query;
    this.questionService.askBasedOnGenerated(this.question_n_sparql).subscribe(
      (response: any) => {
        if (JSON.parse(response.status) == 200) {
          this.handleResponse(response);
        }
        else if (JSON.parse(response.status) == 500) {
          this.handleError(response.query_response);
        }
      },
      () => {
        this.handleError("")
      }
    );
  }

  typeAnswer(text: string, section: string): Promise<void> {
    return new Promise<void>((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          if (section == "answer") {
            this.displayedAnswer += text[index];
          }
          else if (section == "generated query") {
            this.displayedGeneratedQuery += text[index];
          }
          index++;
        }
        else {
          clearInterval(interval);
          resolve();
        }
      }, 15);
    });
  }

  resetState() {
    this.answer = '';
    this.displayedAnswer = '';
    this.showAnswer = false;
    this.isLoading = false;
    this.resources = [];
    this.showResources = false;
    this.inputDisabled = true;
    this.showGeneratedQuery = false;
    this.displayedGeneratedQuery = '';
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        const target = event.target as HTMLTextAreaElement;
        const value = target.value;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        target.value = value.substring(0, start) + '\n' + value.substring(end);
        target.selectionStart = target.selectionEnd = start + 1;

        event.preventDefault();
      }
      else {
        this.getAnswer();
        event.preventDefault();
      }
    }
  }

  fetchResources() {
    this.questionService.getResources().subscribe(
      (resources: string[]) => this.displayResources(resources),
      (error) => {
        console.error('Error fetching resources:', error)
        this.enableInput();
      }
    );
  }

  formatResource(resource: string): string {
    return resource.replace(/\n/g, '<br>');
  }

  displayResources(resources: string[]) {
    this.resources = resources;
    this.showResources = true;
    this.isLoading = false;
    setTimeout(() => {
      this.enableInput();
    }, this.resources.length * 200);
  }

  enableInput() {
    this.inputDisabled = false;
    setTimeout(() => {
      const textarea = this.textarea.nativeElement;
      textarea.focus();
    }, 100);
  }
}
