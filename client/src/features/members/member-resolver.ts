import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../core/services/member-service';
import { Member } from '../../type/Member';

export const memberResolver: ResolveFn<Member | null> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const id = route?.paramMap?.get("id");
  if(id){
    return memberService.getMembersById(id);
  } 
  router.navigateByUrl('/not-found');
  return null;
};
