
export interface ProfileDto {
  description: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Profile {
  description: string;
  followersCount: number;
  followingCount: number;
  articlesCount: number;
  photoPath: string;
  // followers: Partial<User[]>;
  // following: Partial<User[]>;
  // user: Partial<User>;
}