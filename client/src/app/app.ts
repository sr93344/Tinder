import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Nav } from "../layout/nav/nav";
import { Home } from "../layout/home/home";
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private http = inject(HttpClient);
  protected router = inject(Router);
  protected readonly title = signal('Tinder');
  protected members = signal<any[]>([]);

  ngOnInit(): void {
    // this.http.get('https://localhost:5001/api/members').subscribe((data) => {
    //   this.members.set(data as any[]);
    // });
  }

}
