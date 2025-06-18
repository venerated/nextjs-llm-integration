import { createDataStream, streamText, UIMessage } from 'ai'
import createRegistry from '@/lib/registry'

import { ProviderWithKey, type Provider } from '@/lib/providers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
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
  } = await req.json()

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
          console.log('Error from /api/chat', e)
          if (e == null) {
            return 'unknown error'
          }

          if (typeof e === 'string') {
            return e
          }

          if (e instanceof Error) {
            return e.message
          }

          return JSON.stringify(e)
        },
      })

      return new Response(stream)
    } catch (e) {
      return NextResponse.json({ error: e }, { status: 400 })
    }
  }

  return NextResponse.json(
    { error: `"${provider}" is not a supported type` },
    { status: 400 }
  )
}
