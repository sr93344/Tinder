import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../type/Member';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../type/Photos';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { ToastService } from '../../../core/services/toast-service';
import { CacheService } from '../../../core/services/cache-service';
import { environment } from '../../../environments/environment';
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../type/User';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private cache = inject(CacheService);

  protected accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  protected member = signal<Member | undefined>(undefined);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit(): void {
    this.route.parent?.data.subscribe({
      next: (data) => this.member.set(data['member']),
    });

    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: (photos) => this.photos.set(photos),
      });
    }
  }

  uploadPhoto(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.photos.update(() => [...this.photos(), photo]);
        this.cache.delete(environment.apiUrl + 'members/' + this.member()?.id + '/photos');
        this.memberService.editMode.set(false);
        if(!this.memberService.member()?.imageUrl){
          this.setMainLocalPhoto(photo);
        }
        this.toast.success('Image Uploaded Succesfully');
      },
      error: (err) => {
        this.toast.error(err[0]);
      },
      complete: () => this.loading.set(false),
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo);
      },
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((photo) => photo.id !== photoId));
        this.cache.delete(environment.apiUrl + 'members/' + this.member()?.id + '/photos');
        this.toast.success('Photo deleted successfully');
      },
      error: (err) => {
        this.toast.error(err[0]);
      },
    });
  }

  private setMainLocalPhoto(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser as User);
    this.memberService.member.update(
      (member) =>
        ({
          ...member,
          imageUrl: photo.url,
        }) as Member,
    );
    //deleting stale members list && deleting stale member cache
    this.cache.delete(environment.apiUrl + 'members');
    this.cache.delete(environment.apiUrl + 'members/' + this.member()?.id);
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }

  get photoMocks() {
    return Array.from({ length: 20 }, (_, i) => ({
      url: '/user.png',
    }));
  }
}
