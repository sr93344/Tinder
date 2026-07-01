import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css',
})
export class TextInput implements ControlValueAccessor {
  label = input<string>();
  type = input<string>('text');
  maxDate = input<string>('');

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get errorMessage(): string | null {
    const c = this.control;
    if (!c || !c.touched || !c.errors) return null;

    if (c.hasError('required')) return `${this.label()} is required.`;
    if (c.hasError('passwordMismatch')) return `${this.label()} does not match the password.`;
    if (c.hasError('email')) return 'Invalid email address.';

    if (c.hasError('minlength')) {
      return `${this.label()} must be at least ${c.errors['minlength'].requiredLength} characters long.`;
    }
    if (c.hasError('maxlength')) {
      return `${this.label()} must be at most ${c.errors['maxlength'].requiredLength} characters long.`;
    }

    return null;
  }
}
