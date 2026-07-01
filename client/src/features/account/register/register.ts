import { Component, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from '../../../shared/text-input/text-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  cancelRegisterEvent = output<boolean>();
  accountService = inject(AccountService);
  toastService = inject(ToastService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);

  constructor() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    });

    this.profileForm = this.formBuilder.group({
      gender: ['male', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null
        : { passwordMismatch: true };
    };
  }

  nextStep() {
    if (this.currentStep() === 1 && this.credentialsForm.valid) {
      this.currentStep.update(prev => prev + 1);
    } else if (this.currentStep() === 2 && this.profileForm.valid) {
      this.register();
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(prev => prev - 1);
    }
  }

  register() {
    if (this.credentialsForm.valid && this.profileForm.valid) {
      const registerValues = {
        ...this.credentialsForm.value,
        ...this.profileForm.value
      };
      this.accountService.register(registerValues).subscribe({
        next: () => {
          this.router.navigateByUrl("/");
          this.toastService.success("User registered successfully");
        },
        error: (error) => {
          this.validationErrors.set(error);
        }
      });
    }
    console.log('Register values:', {
      ...this.credentialsForm.value,
      ...this.profileForm.value
    });
  }

  getMaxDate(): string {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  }

  cancel() {
    this.cancelRegisterEvent.emit(false);
  }
}
