import Watcher from 'core/observer/watcher'
import { noop } from 'shared/util'
import { currentInstance } from '../currentInstance'

// export type EffectScheduler = (...args: any[]) => any

/**
 * @internal since we are not exposing this in Vue 2, it's used only for
 * internal testing.
 */

/**
 * 对函数更改做出反应
 * fn(): 不带参数，返回值为any类型。定义可观察的效果
 * scheduler()：可选参数，用于安排任务。  cb：any 是回调函数
 */
export function effect(fn: () => any, scheduler?: (cb: any) => void) {
  // 
  const watcher = new Watcher(currentInstance, fn, noop, {
    sync: true
  })
  if (scheduler) {
    watcher.update = () => {
      scheduler(() => watcher.run())
    }
  }
}
