export interface Auction {
    id: string;
    name: string;
    price: number;
    startDate: string;
    endDate: string;
    status: string; // Consider using enum for predefined statuses
    description: string;
  }
  