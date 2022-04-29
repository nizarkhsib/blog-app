
export interface Article {
  _id?: string;
  title?: string;
  description?: string;
  content?: string;
  datePublished?: number;
  userId?: string;
  filePath?: string;
  createdAt?: string;
  author?: Author;
  tags?: string[];
}

export interface Author {
  firstname: string;
  lastname: string;
}
