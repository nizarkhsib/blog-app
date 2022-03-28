import { LoggedUser } from "./logged-user";

export interface ProfileDto {
  description: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Profile {
  _id: string;
  description: string;
  followersCount: number;
  followingCount: number;
  articlesCount: number;
  photoPath: string;
  user: LoggedUser;
  // followers: Partial<User[]>;
  // following: Partial<User[]>;
  // user: Partial<User>;
}