export type MemberRole = 'reader' | 'librarian';

export interface Member {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: MemberRole;
  readonly email: string;
  readonly cardNumber: string;
}
