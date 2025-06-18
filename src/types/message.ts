import { type Model, type Provider } from '@/lib/providers'
import { type UIMessage } from 'ai'

export type Annotations = { provider: Provider; model: Model }

export type AnnotatedMessage = UIMessage & {
  annotations?: Annotations[] | undefined
}
