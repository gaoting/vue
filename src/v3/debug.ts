import { TrackOpTypes, TriggerOpTypes } from './reactivity/operations'

export interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

// 扩展 DebuggerEventExtraInfo
export type DebuggerEvent = {
  /**
   * @internal
   */
  effect: any
} & DebuggerEventExtraInfo

export type DebuggerEventExtraInfo = {
  target: object
  type: TrackOpTypes | TriggerOpTypes
  key?: any
  newValue?: any
  oldValue?: any
}
