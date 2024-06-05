import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatInput, MatLabel }  from "@angular/material/input";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AnswerModel } from "../../model/answer.model";
import { QuestionModel } from "../../model/question.model";
import { QuestionService } from "../../service/question.service";

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
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
      this.questionService.askQuestion(this.question).subscribe(
        (answer: AnswerModel) => this.handleResponse(answer),
        () => this.handleError()
      );
    }
  }

  handleResponse(answer: AnswerModel) {
    this.answer = answer.query_response;
    this.isLoading = false;
    this.typeAnswer().then(() => {
      this.fetchResources();
    });
  }

  handleError() {
    this.isLoading = false;
    this.answer = 'An error occurred while fetching the answer.';
    this.displayedAnswer = this.answer;
    this.typeAnswer().then(() => {
      this.enableInput();
    });
  }

  typeAnswer() {
    return new Promise<void>((resolve) => {
      this.displayedAnswer = '';
      let index = 0;
      const interval = setInterval(() => {
        if (index < this.answer.length) {
          this.displayedAnswer += this.answer[index];
          index++;
        }
        else {
          clearInterval(interval);
          resolve();
        }
      }, 25);
    });
  }

  resetState() {
    this.answer = '';
    this.displayedAnswer = '';
    this.showAnswer = true;
    this.isLoading = false;
    this.resources = [];
    this.showResources = false;
    this.inputDisabled = true;
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
