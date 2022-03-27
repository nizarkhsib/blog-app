
export interface CommentDto {

  content: string;
  likes?: number;
  articleId: string;
  authorId: string;

}

export interface Comment {
  content: string;
  likes?: number;
  article: string;
  author: { firstname: string; lastname: string };
}