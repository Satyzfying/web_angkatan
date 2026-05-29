'use server'

import { ZodError } from 'zod'

import { menfessPayloadSchema, normalizeMenfessPayload, type MenfessPayloadInput } from '@/lib/menfess/schema'
import { createSupabaseAnonymousClient } from '@/lib/supabase/server'
import type { ActionResult, MenfessListData, MenfessRecord } from '@/types/menfess'

const MENFESS_SELECT_FIELDS = 'id,message,from,to,created_at' as const
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

type GetMenfessListActionParams = {
  page?: number
  limit?: number
}

const sanitizePage = (value?: number) => {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_PAGE
  }

  return Math.max(1, Math.floor(value))
}

const sanitizeLimit = (value?: number) => {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_LIMIT
  }

  return Math.min(MAX_LIMIT, Math.max(1, Math.floor(value)))
}

const getValidationErrorMessage = (error: ZodError) =>
  error.issues.map((issue) => issue.message).join(', ')

export async function createMenfessAction(
  input: MenfessPayloadInput
): Promise<ActionResult<MenfessRecord>> {
  try {
    const payload = menfessPayloadSchema.parse(normalizeMenfessPayload(input))
    const supabase = createSupabaseAnonymousClient()

    const { data, error } = await supabase
      .from('menfess')
      .insert({
        message: payload.message,
        from: payload.from ?? null,
        to: payload.to ?? null
      })
      .select(MENFESS_SELECT_FIELDS)
      .single()

    if (error) {
      return {
        success: false,
        message: 'Failed to save menfess message.',
        error: error.message
      }
    }

    if (!data) {
      return {
        success: false,
        message: 'Menfess message was not returned after insert.',
        error: 'No row was returned from Supabase.'
      }
    }

    return {
      success: true,
      message: 'Menfess message saved successfully.',
      data
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Validation failed.',
        error: getValidationErrorMessage(error)
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while creating menfess.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getMenfessListAction(
  params: GetMenfessListActionParams = {}
): Promise<ActionResult<MenfessListData>> {
  try {
    const page = sanitizePage(params.page)
    const limit = sanitizeLimit(params.limit)
    const from = (page - 1) * limit
    const to = from + limit - 1
    const supabase = createSupabaseAnonymousClient()

    const { data, error, count } = await supabase
      .from('menfess')
      .select(MENFESS_SELECT_FIELDS, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      return {
        success: false,
        message: 'Failed to fetch menfess messages.',
        error: error.message
      }
    }

    const total = count ?? 0

    return {
      success: true,
      message: 'Menfess messages fetched successfully.',
      data: {
        items: data ?? [],
        page,
        limit,
        total,
        hasMore: page * limit < total
      }
    }
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred while fetching menfess.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
