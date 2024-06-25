import { z } from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Doit contenir 2 caractères minimum'})
    .trim(),
  email: z.string().email({ message: "S'il vous plaît, rentrez un email valide" }).trim(),
  password: z
    .string()
    .min(8, { message: 'Doit contenir 8 caractères minimum' })
    .regex(/[a-zA-Z]/, { message: 'Doit contenir au moins une lettre' })
    .regex(/[0-9]/, { message: 'Doit contenir au moins un nombre' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Doit contenir au moins un caractère spécial',
    })
    .trim(),
})

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "S'il vous plaît, rentrez un email valide"}),
  password: z.string().min(1, { message: 'Ne doit pas être vide'}),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string | number
  device: string
  role: string
  name: string
  surname: string
  expiresAt: Date
}

export type User = {
  partitionKey: string
  rowKey: string
  name: string
  surname: string
  email: string
  password: string
  role: string
  createdAt: string
  expireDate: string
  device: string
}
