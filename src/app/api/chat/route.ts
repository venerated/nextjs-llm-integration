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
            // system: systemPrompt({ selectedChatModel, requestHints }),
            messages,
            // maxSteps: 5,
            // experimental_activeTools:
            //   selectedChatModel === 'chat-model-reasoning'
            //     ? []
            //     : [
            //         'getWeather',
            //         'createDocument',
            //         'updateDocument',
            //         'requestSuggestions',
            //       ],
            // experimental_transform: smoothStream({ chunking: 'word' }),
            // experimental_generateMessageId: generateUUID,
            // tools: {
            //   getWeather,
            //   createDocument: createDocument({ session, dataStream }),
            //   updateDocument: updateDocument({ session, dataStream }),
            //   requestSuggestions: requestSuggestions({
            //     session,
            //     dataStream,
            //   }),
            // },
            onChunk() {
              if (!sentMeta) {
                dataStream.writeMessageAnnotation({
                  provider,
                  model: languageModel.modelId,
                })
                sentMeta = true
              }
            },
            // onFinish: async () => {
            //   if (session.user?.id) {
            //     try {
            //       const assistantId = getTrailingMessageId({
            //         messages: response.messages.filter(
            //           (message) => message.role === 'assistant',
            //         ),
            //       });

            //       if (!assistantId) {
            //         throw new Error('No assistant message found!');
            //       }

            //       const [, assistantMessage] = appendResponseMessages({
            //         messages: [message],
            //         responseMessages: response.messages,
            //       });

            //       await saveMessages({
            //         messages: [
            //           {
            //             id: assistantId,
            //             chatId: id,
            //             role: assistantMessage.role,
            //             parts: assistantMessage.parts,
            //             attachments:
            //               assistantMessage.experimental_attachments ?? [],
            //             createdAt: new Date(),
            //           },
            //         ],
            //       });
            //     } catch (_) {
            //       console.error('Failed to save chat');
            //     }
            //   }
            // },
            // experimental_telemetry: {
            //   isEnabled: isProductionEnvironment,
            //   functionId: 'stream-text',
            // },
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
          // {
          //   cause: undefined,
          //   url: 'https://api.deepseek.com/v1/chat/completions',
          //   requestBodyValues: [Object],
          //   statusCode: 402,
          //   responseHeaders: [Object],
          //   responseBody: '{"error":{"message":"Insufficient Balance","type":"unknown_error","param":null,"code":"invalid_request_error"}}',
          //   isRetryable: false,
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
