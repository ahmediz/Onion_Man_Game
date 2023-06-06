export interface IUser {
  id: string;
  name: string;
  image: string;
  email: string;
  latestScore?: number;
  highScore?: number;
}
