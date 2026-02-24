/**
 * Contact message entity as returned from the contact API.
 * Used in admin contacts list and message modal.
 */
export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  message: string;
  status: string;
  createdAt: string;
  answer?: string;
  answeredAt?: string;
};
