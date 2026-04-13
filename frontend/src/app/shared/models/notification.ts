export interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    firstname: string;
    lastname: string;
    profileImage?: string;
  };
  type: 'like' | 'comment' | 'comment_on_commented';
  article: {
    _id: string;
    title: string;
  };
  message: string;
  read: boolean;
  createdAt: string;
}
