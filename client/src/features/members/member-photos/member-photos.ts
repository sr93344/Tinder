import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../type/Member';
import { MemberService } from '../../../core/services/member-service';
import { Observable } from 'rxjs';
import { Photo } from '../../../type/Photos';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  private route = inject(ActivatedRoute);
  private memberService = inject(MemberService)
  protected member = signal<Member | undefined>(undefined);
  protected photos$?: Observable<Photo[]>;

  constructor(){
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if(memberId){
      this.photos$ = this.memberService.getMemberPhotos(memberId);
    }
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe({
      next: (data) => this.member.set(data['member'])
    })
  }

  get photoMocks(){
    return Array.from({length: 20}, (_, i) => ({
      url: '/user.png'
    }))
  }
}
