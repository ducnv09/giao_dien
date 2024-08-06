import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { TodoItem } from './todo-Item.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  todoList: TodoItem[] = [];
  newTask: string = '';
  @ViewChild('todoText') todoInputRef: ElementRef<HTMLInputElement> = null!;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      const storedTodoList = localStorage.getItem('todoList');
      if (storedTodoList) {
        this.todoList = JSON.parse(storedTodoList);
      }
    } else {
      console.error('localStorage is not available');
    }
  }

  addTask(text: String): void {
    if (text.trim() !== '') {
      const newTodoItem: TodoItem = {
        id: Date.now(),
        task: text.trim(),
        completed: false
      };
      this.todoList.push(newTodoItem);
      this.todoInputRef.nativeElement.value = '';
      this.saveTodoList();
    }
  }

  deleteTask(id: number): void {
    this.todoList = this.todoList.filter(item => item.id !== id);
    this.saveTodoList();
  }

  saveTodoList(): void {
    localStorage.setItem('todoList', JSON.stringify(this.todoList));
  }

  toggleCompleted(id: number): void {
    const todoItem = this.todoList.find(item => item.id === id);
    if (todoItem) {
      todoItem.completed = !todoItem.completed;
      this.saveTodoList();
    }
  }
}
