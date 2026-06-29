export type Member = {
  id: string
  dateOfBirth: string
  imageUrl?: string
  displayName: string
  created: string
  lastActive: string
  gender: string
  description?: string
  city: string
  country: string
}

export type EditableMemeber = {
  displayName: string;
  description?: string;
  city: string;
  country: string;
}