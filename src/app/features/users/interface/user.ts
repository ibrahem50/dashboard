export interface UserInterface {
  id: number;
  fname: string;
  lname: string;
  username: string;
  avatar: string;
  email?: string;
}

export interface UserResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UserInterface[];
}
