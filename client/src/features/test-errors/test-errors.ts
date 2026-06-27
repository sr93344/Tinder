import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css',
})
export class TestErrors {
  baseUrl = "https://localhost:5001/api/buggy/";
  private http = inject(HttpClient);
  validationErrors = signal<string[]>([]);

  getError(type: string){
    this.validationErrors.set([]);
    this.http.get(this.baseUrl + type).subscribe({
      next: response => console.log(response),
      error: err => console.log(err)
    })
  }

  get400ValidationError(){
    this.http.post('https://localhost:5001/api/account/register', {}).subscribe({
      next: response => console.log(response),
      error: err => {
        console.log(err);
        this.validationErrors.set(err);
      }
    })
  }
}
