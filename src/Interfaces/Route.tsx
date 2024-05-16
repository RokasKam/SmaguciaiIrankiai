export interface Order {
    id: string;
    price: number;
    address: string;
    date: string; // ISO date string format
  }
  
  export interface Route {
    id: string;
    orders: Order[];
    duration: string; // You can use minutes or a formatted string
    status: string; // Could be 'Pending', 'Active', 'Completed', etc.
  }
  