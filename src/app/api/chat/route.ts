import { createDataStream, streamText, UIMessage } from 'ai'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import createRegistry from '@/lib/registry'
import { PROVIDERS } from '@/lib/provider'

import type { AnnotatedMessage } from '@/types/message'
import type { Provider, ProviderWithKey } from '@/types/provider'

const ProviderSchema = z.enum([...PROVIDERS] as [Provider, ...Provider[]])

const TextUIPartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
})

const StepStartUIPart = z.object({
  type: z.literal('step-start'),
})

const UIPartSchema = z.union([TextUIPartSchema, StepStartUIPart])

const ChatRequestSchema = z.object({
  id: z.string(),
  messages: z.array(
    z.object({
      content: z.string(),
      createdAt: z.preprocess((val) => new Date(val as string), z.date()),
      id: z.string(),
      parts: z.array(UIPartSchema),
      role: z.enum(['user', 'assistant']),
    })
  ),
  provider: ProviderSchema,
  model: z.string(),
  apiKeys: z.array(
    z.object({
      provider: ProviderSchema,
      apiKey: z.string().optional(),
    })
  ),
})

export async function POST(req: Request) {
  const body = await req.json()

  console.log(body?.messages?.map((message: AnnotatedMessage) => message.parts))

  const result = ChatRequestSchema.safeParse(body)
  if (!result.success) {
    return new Response(JSON.stringify({ error: 'Invalid request payload' }), {
      status: 400,
    })
  }

  const {
    apiKeys,
    messages,
    model,
    provider,
  }: {
    apiKeys: ProviderWithKey[]
    messages: UIMessage[]
    model: string
    provider: Provider
  } = result.data

  const providerApiKey = apiKeys.find(
    (apiKey) => apiKey.provider == provider
  )?.apiKey

  const registry = createRegistry({ [provider]: providerApiKey })
  const languageModel = registry.languageModel(`${provider}:${model}`)

  const canUseStreamText =
    provider === 'anthropic' || provider === 'deepseek' || provider === 'openai'

  let sentMeta = false

  if (canUseStreamText) {
    try {
      const stream = createDataStream({
        execute: (dataStream) => {
          const result = streamText({
            model: languageModel,
            messages,
            onChunk() {
              if (!sentMeta) {
                dataStream.writeMessageAnnotation({
                  provider,
                  model: languageModel.modelId,
                })
                sentMeta = true
              }
            },
          })

          result.mergeIntoDataStream(dataStream, {
            sendReasoning: true,
          })
        },
        onError: (e) => {
          console.error('Error from /api/chat', e)

          if (
            typeof e === 'object' &&
            e !== null &&
            'statusCode' in e &&
            'responseBody' in e
          ) {
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            const status = (e as any).statusCode ?? 500
            const body = (e as any).responseBody ?? 'Unknown response body'
            return `${status} — ${body}`
          }

          if (e instanceof Error) {
            return e.message
          }

          if (typeof e === 'string') {
            return e
          }

          return JSON.stringify(e)
        },
      })

      return new Response(stream)
    } catch (e: unknown) {
      console.error('Caught error:', e)

      if (
        typeof e === 'object' &&
        e !== null &&
        'statusCode' in e &&
        'responseBody' in e
      ) {
        const status = (e as any).statusCode ?? 500
        const body = (e as any).responseBody ?? 'Unknown response body'

        return NextResponse.json({ error: body }, { status })
      }

      if (e instanceof Error) {
        console.error('Error.message:', e.message)
        console.error('Error.name:', e.name)
        console.error('Error.stack:', e.stack)
      }

      return NextResponse.json(
        { error: 'Unexpected server error' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: `"${provider}" is not a supported type` },
    { status: 400 }
  )
}
