import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatInput, MatLabel }  from "@angular/material/input";

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
    MatLabel
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent {
  question: QuestionModel = {
    query: ""
  };
  answer: string | null = null;

  constructor(private questionService: QuestionService) { }

  getAnswer() {
    this.questionService.askQuestion(this.question).subscribe(
      (answer: AnswerModel) => {
        this.answer = answer.query_response;
      }
    )
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Insert a newline character at the cursor position
        const target = event.target as HTMLTextAreaElement;
        const value = target.value;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        target.value = value.substring(0, start) + '\n' + value.substring(end);
        target.selectionStart = target.selectionEnd = start + 1;

        event.preventDefault();
      } else {
        // Call the getAnswer function
        this.getAnswer();
        event.preventDefault();
      }
    }
  }
}
