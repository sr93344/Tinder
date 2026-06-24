// models/user.model.ts
export interface User {
  id: string;
  displayName: string;
  email: string;
  imageUrl?: string;    // nullable, null for email users
  token: string;
}