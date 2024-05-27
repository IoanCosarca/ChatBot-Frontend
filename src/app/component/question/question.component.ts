import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardTitle } from "@angular/material/card";
import { MatFormField, MatInput, MatLabel }  from "@angular/material/input";

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
  userQuery: string = '';
  answer: string | null = null;

  getAnswer() {
    // Simulate an answer for now
    this.answer = `You asked: ${this.userQuery}. (The actual answer would be provided by the RAG model.
    mmmmmmmmmmmmmmmm mmmmmmmmmmmmmmm mmmmmmmmmmmmmmmm mmmmmmmmm mmmmmmmmmmmmm mmmmmmmmmmmm mmmmmmmmm m
     mmmmmmmmmmmmm mmmmmmmmmmmmmm mmmmmmmmmmmmmm mmmmmmmmmmmm mmmmmmmmmmmm mmmmmmmmmmmm m
      mmmmmmmmmmmm mmmmmmmmmmmmmm mmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmm mmmmmmmmmmmmmm mmmmmmmmmmmmm m
       mmmmmmmmmmmmmmm mmmmmmmmmmmmmm mmmmmmmmmmmmmmm mmmmmmmmmmmmmm mmmmmmmmmmmmmmmmmm m
        mmmmmmmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmm mmmmmmmmmmmmmm m
         mmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmmmm mmmmmmmmmmmmmmm m)`;
  }
}
