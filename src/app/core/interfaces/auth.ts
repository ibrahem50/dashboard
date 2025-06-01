import { UserInterface } from '../../features/users/interface/user';

export interface AuthInterface {
  username: string;
  password: string;
}

export interface AuthInterfaceResponse {
  status: string;
  message: string;
  accessToken: string;
  expiresIn: number;
  user: UserInterface;
}
