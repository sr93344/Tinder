import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMemeber, Member } from '../../type/Member';
import { Photo } from '../../type/Photos';
import { tap } from 'rxjs';

@Service()
export class MemberService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;
    public editMode = signal(false);
    member = signal<Member | null>(null);

    getMembers(){
        return this.http.get<Member[]>(this.baseUrl + 'members');
    }

    getMembersById(id: string){
        return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
            tap(member => {
                this.member.set(member);
            })
        );
    }

    getMemberPhotos(id: string){
        return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
    }

    updateMember(member : EditableMemeber){
        return this.http.put(this.baseUrl + 'members', member);
    }
}
