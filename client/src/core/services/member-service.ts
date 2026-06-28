import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../../type/Member';
import { Photo } from '../../type/Photos';

@Service()
export class MemberService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getMembers(){
        return this.http.get<Member[]>(this.baseUrl + 'members');
    }

    getMembersById(id: string){
        return this.http.get<Member>(this.baseUrl + 'members/' + id);
    }

    getMemberPhotos(id: string){
        return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
    }
}
