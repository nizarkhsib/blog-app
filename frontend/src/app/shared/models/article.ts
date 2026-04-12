
export interface Article {
  _id?: string;
  title?: string;
  description?: string;
  content?: string;
  chapters?: Chapter[];
  status?: 'draft' | 'published';
  archived?: boolean;
  datePublished?: Date;
  userId?: string;
  author?: Author;
  authorName?: string;
  coverImage?: string;
  filePath?: string;
  likes?: number;
  likedBy?: string[];
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Author {
  _id?: string;
  firstname: string;
  lastname: string;
  email?: string;
  profileImage?: string;
  bio?: string;
}

