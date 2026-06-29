import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Member } from '../../../type/Member';
import { AgePipe } from "../../../core/pipes/age-pipe";
import { AccountService } from '../../../core/services/account-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MemberService } from '../../../core/services/member-service';

@Component({
  selector: 'app-members-details',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './members-details.html',
  styleUrl: './members-details.css',
})
export class MembersDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private routeId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));

  protected memberService = inject(MemberService);
  protected title = signal<string | undefined>('Profile');
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.routeId();
  });

  ngOnInit(){
    this.title.set(this.route.firstChild?.snapshot?.title);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => this.title.set(this.route.firstChild?.snapshot?.title)
    });
  }
}
