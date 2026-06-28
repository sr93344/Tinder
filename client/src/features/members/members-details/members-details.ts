import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../type/Member';
import { AgePipe } from "../../../core/pipes/age-pipe";

@Component({
  selector: 'app-members-details',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './members-details.html',
  styleUrl: './members-details.css',
})
export class MembersDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected title = signal<string | undefined>('Profile');
  protected member = signal<Member | undefined>(undefined);

  ngOnInit(){
    this.route.data.subscribe({
      next: (data) => this.member.set(data['member'])
    })
    this.title.set(this.route.firstChild?.snapshot?.title);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => this.title.set(this.route.firstChild?.snapshot?.title)
    });
  }
}
