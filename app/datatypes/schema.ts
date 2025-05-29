export type Satsangi = {
  id: string;
  name: string;
  age: number;
  city: string;
  state: string | null;
  birthdate: string; // ISO format date string (e.g. '2024-05-28')
  panno: string | null;
  address: string | null;
  mobile: string | null;
  email: string | null;
  gender: 'Male' | 'Female' | 'Other' | string;
  shivir_id: string | null;
  payment_id: number | null;
};

export type Shivir = {
  id: string;
  occasion: string;
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
  city: string;
  address: string;
  map_link: string | null;
};

export type RoomProperty = {
  id: string;
  shivir_id: string | null;
  name: string;
  address: string | null;
  map_link: string | null;
  city: string | null;
  state: string | null;
  pin: string | null;
};

export type RoomType = {
  id: string;
  description: string;
  base_capacity: number;
  extra_capacity: number;
  total_rooms: number;
  property_id: string;
};

export type Room = {
  id: string;
  room_type_id: string;
  room_no: string;
  floor: number;
  status: string;
};

export type Allocation = {
  id: string;
  room_id: string;
  satsangi_id: string;
};

export type CheckedIn = {
  id: string;
  satsangi_id: string;
  datetime: string; // ISO date-time string
}

export type CheckedOut = {  
  id: string;
  satsangi_id: string;
  datetime: string; // ISO date-time string
}


