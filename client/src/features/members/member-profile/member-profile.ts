import { Component, effect, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMemeber, Member } from '../../../type/Member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../type/User';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnDestroy {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

  private toast = inject(ToastService);
  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  protected editableMember: EditableMemeber = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  };


  constructor() {
    effect(() => {
      var member = this.memberService.member();
      this.editableMember = {
        displayName: member?.displayName || '',
        description: member?.description || '',
        city: member?.city || '',
        country: member?.country || '',
      }
    })

  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = { ...this.memberService.member(), ...this.editableMember };
    // console.log(updatedMember);
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser && updatedMember.displayName !== currentUser.displayName) {
          this.accountService.setCurrentUser({
            ...currentUser,
            displayName: updatedMember.displayName
          });
        }
        this.toast.success("Profile updated successfully");
        this.memberService.editMode.set(false);
        this.memberService.member.update(() => updatedMember as Member);
        this.editForm?.reset(updatedMember);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }
}
