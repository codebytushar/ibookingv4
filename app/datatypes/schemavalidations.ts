import { z } from 'zod';

export const satsangiSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number().int().nonnegative().max(120),
  city: z.string().min(1, "City is required"),
  state: z.string().optional().nullable(),
  birthdate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" }
  ),
  panno: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  gender: z.enum(['Male', 'Female', 'Other']).or(z.string()),
  shivir_id: z.string().uuid().optional().nullable(),
  payment_id: z.coerce.number().int().optional().nullable(),
});

// Optional: Partial schema (e.g., for forms)
export const satsangiFormSchema = satsangiSchema.partial().extend({
  name: z.string().min(1),
  age: z.coerce.number().int().nonnegative(),
  city: z.string().min(1),
});


// Validate data:
// const parsed = satsangiSchema.safeParse(data);
// if (!parsed.success) {
//   console.error(parsed.error.flatten());
// }

//Type Inference:
// type Satsangi = z.infer<typeof satsangiSchema>;


export const shivirSchema = z.object({
  id: z.string().uuid(),
  occasion: z.string().min(1, "Occasion is required"),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid start date",
  }),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid end date",
  }),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  map_link: z.string().url("Must be a valid URL").optional().nullable(),
});

export const roomPropertySchema = z.object({
  id: z.string().uuid(),
  shivir_id: z.string().uuid().optional().nullable(),
  name: z.string().min(1, "Name is required"),
  address: z.string().optional().nullable(),
  map_link: z.string().url("Must be a valid URL").optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pin: z.string().optional().nullable(),
});

export const roomTypeSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1, "Description is required"),
  base_capacity: z.coerce.number().int().nonnegative(),
  extra_capacity: z.coerce.number().int().nonnegative(),
  total_rooms: z.coerce.number().int().nonnegative(),
  property_id: z.string().uuid(),
});

export const roomSchema = z.object({
  id: z.string().uuid(),
  room_type_id: z.string().uuid(),
  room_no: z.string().min(1, "Room number is required"),
  floor: z.coerce.number().int().nonnegative(),
  status: z.string().min(1, "Status is required"),
});



