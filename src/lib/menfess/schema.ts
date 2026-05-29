import { z } from 'zod'

const optionalTextSchema = z.preprocess((value) => {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value !== 'string') {
    return value
  }

  const trimmedValue = value.trim()

  return trimmedValue.length > 0 ? trimmedValue : undefined
}, z.string().optional())

export const menfessPayloadSchema = z.object({
  message: z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value
    }

    return value.trim()
  }, z.string().min(1, 'Message is required')),
  from: optionalTextSchema,
  to: optionalTextSchema
})

export type MenfessPayload = z.infer<typeof menfessPayloadSchema>

export type MenfessPayloadInput =
  | FormData
  | Record<string, FormDataEntryValue | null | undefined>

export const normalizeMenfessPayload = (input: MenfessPayloadInput) => {
  if (input instanceof FormData) {
    return {
      message: input.get('message'),
      from: input.get('from'),
      to: input.get('to')
    }
  }

  return input
}