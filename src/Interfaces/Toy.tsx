enum Gender {
  Male = 'Male',
  Female = 'Female',
  Unisex = 'Unisex',
}

type CategoryId = string; // Adjust the type based on the actual type in your application
export interface Toy {
  id: string;
  name: string;
  price: number;
  creationDate: string; // You might want to use a Date type or a formatted string based on your needs
  color: string;
  amount: number;
  ratingAverage: number;
  ratingAmount: number;
  description: string;
  gender: Gender;
  categoryId: CategoryId;
  photos: Photo[];
}
export interface Photo {
  url: string;
  alterText: string;
  productId: string;
}
export type Feedback = {
  id: number;
  text: string;
  rating: number;
  author: string;
  date: string;
};
