import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Nav } from "../layout/nav/nav";

@Component({
  selector: 'app-root',
  imports: [Nav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private http = inject(HttpClient);
  protected readonly title = signal('Tinder');
  protected members = signal<any[]>([]);

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/members').subscribe((data) => {
      this.members.set(data as any[]);
    });
  }

}
