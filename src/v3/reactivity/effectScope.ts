import Watcher from 'core/observer/watcher'
import { warn } from 'core/util'

export let activeEffectScope: EffectScope | undefined

/**
 * # 代码分析

该代码是一个TypeScript模块，定义了一个 `EffectScope` 类和几个辅助函数。

`EffectScope` 类具有以下属性：

- `active`：一个布尔值，指示该作用域是否处于活动状态
- `effects`：与该作用域相关联的 `Watcher` 实例的数组
- `cleanups`：在停止作用域时将被调用的清理函数的数组
- `parent`：指向父 `EffectScope` 实例的引用
- `scopes`：子 `EffectScope` 实例的数组
- `_vm`：一个布尔值，指示该作用域是否是组件根作用域
- `index`：跟踪当前作用域在其父作用域的 `scopes` 数组中的索引

`EffectScope` 类具有以下方法：

- `constructor`：使用给定的 `detached` 标志初始化 `EffectScope` 实例，并在实例未分离且存在活动作用域时设置 `parent` 和 `index` 属性
- `run`：在作用域中运行给定的函数
- `on`：将当前作用域设置为活动作用域
- `off`：将父作用域设置为活动作用域
- `stop`：停止作用域并调用所有相关 `Watcher` 实例和清理函数的拆卸方法。它还停止所有子级作用域，并从其父作用域的 `scopes` 数组中删除当前作用域以避免内存泄漏。

辅助函数包括：

- `effectScope`：返回具有给定 `detached` 标志的新 `EffectScope` 实例的函数
- `recordEffectScope`：如果实例处于活动状态，则将给定的 `Watcher` 实例添加到给定的 `EffectScope` 实例的 `effects` 数组中的函数
- `getCurrentScope`：返回当前活动的 `EffectScope` 实例的函数
- `onScopeDispose`：如果存在当前活动的 `EffectScope` 实例，则将给定的清理函数添加到其 `cleanups` 数组中的函数
 */

export class EffectScope {
  /**
   * @internal
   */
  active = true
  /**
   * @internal
   */
  effects: Watcher[] = []
  /**
   * @internal
   */
  cleanups: (() => void)[] = []
  /**
   * @internal
   */
  parent: EffectScope | undefined
  /**
   * record undetached scopes
   * @internal
   */
  scopes: EffectScope[] | undefined
  /**
   * indicates this being a component root scope
   * @internal
   */
  _vm?: boolean
  /**
   * track a child scope's index in its parent's scopes array for optimized
   * removal
   */
  private index: number | undefined

  constructor(public detached = false) {
    this.parent = activeEffectScope
    if (!detached && activeEffectScope) {
      this.index =
        (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1
    }
  }

  run<T>(fn: () => T): T | undefined {
    if (this.active) {
      const currentEffectScope = activeEffectScope
      try {
        activeEffectScope = this
        return fn()
      } finally {
        activeEffectScope = currentEffectScope
      }
    } else if (__DEV__) {
      warn(`cannot run an inactive effect scope.`)
    }
  }

  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this
  }

  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent
  }

  stop(fromParent?: boolean) {
    if (this.active) {
      let i, l
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].teardown()
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]()
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true)
        }
      }
      // nested scope, dereference from parent to avoid memory leaks
      if (!this.detached && this.parent && !fromParent) {
        // optimized O(1) removal
        const last = this.parent.scopes!.pop()
        if (last && last !== this) {
          this.parent.scopes![this.index!] = last
          last.index = this.index!
        }
      }
      this.parent = undefined
      this.active = false
    }
  }
}

export function effectScope(detached?: boolean) {
  return new EffectScope(detached)
}

/**
 * @internal
 */
export function recordEffectScope(
  effect: Watcher,
  scope: EffectScope | undefined = activeEffectScope
) {
  if (scope && scope.active) {
    scope.effects.push(effect)
  }
}

export function getCurrentScope() {
  return activeEffectScope
}

export function onScopeDispose(fn: () => void) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn)
  } else if (__DEV__) {
    warn(
      `onScopeDispose() is called when there is no active effect scope` +
        ` to be associated with.`
    )
  }
}
