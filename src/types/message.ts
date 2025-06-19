import { type UIMessage } from 'ai'
import type { Model, Provider } from '@/types/provider'

export type Annotations = { provider: Provider; model: Model }

export type AnnotatedMessage = UIMessage & {
  annotations?: Annotations[] | undefined
}
