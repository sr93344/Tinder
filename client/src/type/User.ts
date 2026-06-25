// models/user.model.ts
export type User = {
  id: string;
  displayName: string;
  email: string;
  imageUrl?: string;    // nullable, null for email users
  token: string;
}

export type LoginCreds = {
  email: string,
  password: string
}


export type RegisterCreds = {
  email: string,
  displayName: string,
  password: string
}