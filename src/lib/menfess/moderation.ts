import OpenAI, { APIError } from 'openai'

import type { MenfessPayload } from './schema'

const DEFAULT_MODERATION_MODEL = 'omni-moderation-latest'
const DEFAULT_LLM_MODERATION_MODEL = 'gpt-4.1-nano'
const MODERATION_TIMEOUT_MS = 6000

export type OpenAIModerationCategory =
  | 'sexual'
  | 'sexual/minors'
  | 'harassment'
  | 'harassment/threatening'
  | 'hate'
  | 'hate/threatening'
  | 'illicit'
  | 'illicit/violent'
  | 'self-harm'
  | 'self-harm/intent'
  | 'self-harm/instructions'
  | 'violence'
  | 'violence/graphic'

type ModerationThresholds = Record<OpenAIModerationCategory, number>

type BlockedModerationCategory = {
  category: OpenAIModerationCategory
  score: number
  threshold: number
}

type LlmModerationOutput = {
  flag?: boolean
  reason?: string
}

type MenfessModerationResult =
  | {
      allowed: true
    }
  | {
      allowed: false
      reason: string
    }

// Lower threshold = more aggressive filtering. Raise a category closer to 1 to make it more permissive.
export const MENFESS_MODERATION_THRESHOLDS: ModerationThresholds = {
  sexual: 0.7,
  'sexual/minors': 0.2,
  harassment: 0.7,
  'harassment/threatening': 0.35,
  hate: 0.6,
  'hate/threatening': 0.3,
  illicit: 0.75,
  'illicit/violent': 0.45,
  'self-harm': 0.55,
  'self-harm/intent': 0.35,
  'self-harm/instructions': 0.25,
  violence: 0.75,
  'violence/graphic': 0.5
}

const moderationCategories = Object.keys(MENFESS_MODERATION_THRESHOLDS) as OpenAIModerationCategory[]

const moderationReasonLabels: Record<OpenAIModerationCategory, string> = {
  sexual: 'seksual',
  'sexual/minors': 'seksual',
  harassment: 'pelecehan',
  'harassment/threatening': 'pelecehan',
  hate: 'kebencian',
  'hate/threatening': 'kebencian',
  illicit: 'aktivitas ilegal',
  'illicit/violent': 'aktivitas ilegal',
  'self-harm': 'menyakiti diri',
  'self-harm/intent': 'menyakiti diri',
  'self-harm/instructions': 'menyakiti diri',
  violence: 'kekerasan',
  'violence/graphic': 'kekerasan'
}

const getModerationModel = () => process.env.OPENAI_MODERATION_MODEL?.trim() || DEFAULT_MODERATION_MODEL

const getLlmModerationModel = () => process.env.OPENAI_LLM_MODERATION_MODEL?.trim() || DEFAULT_LLM_MODERATION_MODEL

const isModerationDisabled = () => process.env.OPENAI_MODERATION_ENABLED?.toLowerCase() === 'false'

const isLlmModerationEnabled = () => process.env.OPENAI_LLM_MODERATION_ENABLED?.toLowerCase() === 'true'

const getModerationInput = (payload: MenfessPayload) =>
  [`From: ${payload.from ?? 'Anonymous'}`, `To: ${payload.to ?? 'Anonymous'}`, `Message: ${payload.message}`].join('\n')

const getLlmModerationInput = (payload: MenfessPayload) =>
  [`f:${payload.from ?? ''}`, `t:${payload.to ?? ''}`, `m:${payload.message}`].join('\n')

const getOpenAIClient = (apiKey: string) =>
  new OpenAI({
    apiKey,
    maxRetries: 0,
    timeout: MODERATION_TIMEOUT_MS
  })

const getOpenAIErrorDetails = (error: unknown) => {
  if (!(error instanceof APIError)) {
    return error
  }

  const headers = error.headers

  return {
    status: error.status,
    type: error.type,
    code: error.code,
    param: error.param,
    message: error.message,
    requestId: error.requestID,
    rateLimitLimitRequests: headers?.get('x-ratelimit-limit-requests'),
    rateLimitRemainingRequests: headers?.get('x-ratelimit-remaining-requests'),
    rateLimitResetRequests: headers?.get('x-ratelimit-reset-requests'),
    rateLimitLimitTokens: headers?.get('x-ratelimit-limit-tokens'),
    rateLimitRemainingTokens: headers?.get('x-ratelimit-remaining-tokens'),
    rateLimitResetTokens: headers?.get('x-ratelimit-reset-tokens')
  }
}

const getModerationThresholds = (): ModerationThresholds => {
  const rawOverrides = process.env.OPENAI_MODERATION_THRESHOLDS

  if (!rawOverrides) {
    return MENFESS_MODERATION_THRESHOLDS
  }

  try {
    const overrides = JSON.parse(rawOverrides) as Partial<Record<OpenAIModerationCategory, unknown>>

    return moderationCategories.reduce<ModerationThresholds>((thresholds, category) => {
      const override = overrides[category]

      if (typeof override !== 'number' || !Number.isFinite(override)) {
        return thresholds
      }

      return {
        ...thresholds,
        [category]: Math.min(1, Math.max(0, override))
      }
    }, MENFESS_MODERATION_THRESHOLDS)
  } catch (error) {
    console.warn('Invalid OPENAI_MODERATION_THRESHOLDS value. Using defaults.', error)
    return MENFESS_MODERATION_THRESHOLDS
  }
}

const getBlockedCategories = (
  scores: Partial<Record<OpenAIModerationCategory, number>>,
  thresholds: ModerationThresholds
) =>
  moderationCategories.reduce<BlockedModerationCategory[]>((blockedCategories, category) => {
    const score = scores[category]

    if (typeof score !== 'number' || !Number.isFinite(score)) {
      return blockedCategories
    }

    if (score >= thresholds[category]) {
      blockedCategories.push({
        category,
        score,
        threshold: thresholds[category]
      })
    }

    return blockedCategories
  }, [])

const getBlockedReason = (blockedCategories: BlockedModerationCategory[]) => {
  const reasons = Array.from(new Set(blockedCategories.map(({ category }) => moderationReasonLabels[category])))

  if (reasons.length === 0) {
    return 'konten yang tidak sesuai'
  }

  if (reasons.length === 1) {
    return reasons[0]
  }

  return `${reasons.slice(0, -1).join(', ')} atau ${reasons[reasons.length - 1]}`
}

const normalizeLlmModerationReason = (reason?: string) => {
  const normalizedReason = reason?.trim().replace(/\s+/g, ' ')

  if (!normalizedReason) {
    return 'konten yang tidak sesuai'
  }

  return normalizedReason.slice(0, 80)
}

export const getModerationBlockMessage = (reason: string) => `Menfess ditolak karena pesan mengandung unsur ${reason}.`

const moderateMenfessWithLlm = async (openai: OpenAI, payload: MenfessPayload): Promise<MenfessModerationResult> => {
  if (!isLlmModerationEnabled()) {
    return { allowed: true }
  }

  try {
    const response = await openai.responses.create(
      {
        model: getLlmModerationModel(),
        instructions:
          'Moderasi menfess ID/EN. JSON saja. flag=true hanya untuk hate, harassment, sexual, self-harm, violence, pelecehan, atau illegal, pahami juga kata seperti susu yang bisa saja merujuk ke payudara. reason singkat Bahasa Indonesia.',
        input: getLlmModerationInput(payload),
        max_output_tokens: 40,
        store: false,
        temperature: 0,
        text: {
          format: {
            type: 'json_schema',
            name: 'menfess_moderation',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                flag: {
                  type: 'boolean'
                },
                reason: {
                  type: 'string'
                }
              },
              required: ['flag', 'reason']
            }
          },
          verbosity: 'medium'
        }
      },
      {
        maxRetries: 0,
        timeout: MODERATION_TIMEOUT_MS
      }
    )

    const output = JSON.parse(response.output_text || '{}') as LlmModerationOutput

    console.log('LLM Moderation output:', output)

    if (output.flag) {
      return {
        allowed: false,
        reason: normalizeLlmModerationReason(output.reason)
      }
    }
  } catch (error) {
    console.warn('OpenAI LLM moderation failed. Skipping LLM moderation.', getOpenAIErrorDetails(error))
  }

  return { allowed: true }
}

export const moderateMenfessPayload = async (payload: MenfessPayload): Promise<MenfessModerationResult> => {
  if (isModerationDisabled()) {
    return { allowed: true }
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn('OPENAI_API_KEY is missing. Skipping menfess moderation.')
    return { allowed: true }
  }

  try {
    const openai = getOpenAIClient(apiKey)
    const response = await openai.moderations.create(
      {
        model: getModerationModel(),
        input: getModerationInput(payload)
      },
      {
        maxRetries: 0,
        timeout: MODERATION_TIMEOUT_MS
      }
    )

    const scores = response.results?.[0]?.category_scores as
      | Partial<Record<OpenAIModerationCategory, number>>
      | undefined

    if (!scores) {
      console.warn('OpenAI moderation response did not include category_scores. Skipping menfess moderation.')
      return { allowed: true }
    }

    const blockedCategories = getBlockedCategories(scores, getModerationThresholds())

    if (blockedCategories.length > 0) {
      return {
        allowed: false,
        reason: getBlockedReason(blockedCategories)
      }
    }

    return moderateMenfessWithLlm(openai, payload)
  } catch (error) {
    console.warn('OpenAI moderation failed. Skipping menfess moderation.', getOpenAIErrorDetails(error))

    if (!apiKey) {
      return { allowed: true }
    }

    return moderateMenfessWithLlm(getOpenAIClient(apiKey), payload)
  }
}
