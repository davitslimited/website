import { z } from 'zod';

// Contact form validation schema
export const insertContactInquirySchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 characters"),
  serviceType: z.string().min(1, "Please select a service type"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

// TypeScript type inferred from the schema
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;