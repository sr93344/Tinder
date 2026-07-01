import { Component, inject, input, output, signal } from '@angular/core';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload {
  protected imageSrc = signal<string | ArrayBuffer | null | undefined>(null);
  protected isDragging = false;
  private fileToUpload: File | null = null;
  private toast = inject(ToastService);
  uploadFile = output<File>(); //want to notfiy member-photo component. (this is common component)
  loading = input<boolean>(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.ValidateAndPreview(file);
    }
  }

  onFileSelected(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.ValidateAndPreview(file);
      // input.value = '';
    }
  }

  onCancel() {
    this.fileToUpload = null;
    this.imageSrc.set(null);
  }

  onUpload() {
    if (this.fileToUpload) {
      this.uploadFile.emit(this.fileToUpload);
    }
  }

  private ValidateAndPreview(file: File) {
    if (file.type.startsWith('image/')) {
      this.previewImage(file);
      this.fileToUpload = file;
    } else {
      this.toast.info('Only image files are allowed!');
    }
  }

  private previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => this.imageSrc.set(e.target?.result);
    reader.readAsDataURL(file);
  }
}
