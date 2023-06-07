import { createElement } from '../core/vdom/create-element'
import { currentInstance } from './currentInstance'
import { warn } from 'core/util'

// createElement 函数用于创建虚拟 DOM 对象
/**
 * - `context`：当前组件实例对象，或者为 `null`。
    - `type`：标签名或者组件对象。
    - `props`：元素的属性对象。
    - `children`：元素的子节点，可以是文本节点、虚拟 DOM 对象的数组或者单个虚拟 DOM 对象。
    - `patchFlag`：用于标记节点的动态特性，比如 class、style 属性是否需要更新等。
    - `dynamicProps`：用于标记节点哪些属性需要动态更新。
 */

/**
 * @internal this function needs manual public type declaration because it relies
 * on previously manually authored types from Vue 2
 */
export function h(type: any, props?: any, children?: any) {
  if (!currentInstance) {
    __DEV__ &&
      warn(
        `globally imported h() can only be invoked when there is an active ` +
          `component instance, e.g. synchronously in a component's render or setup function.`
      )
  }
  return createElement(currentInstance!, type, props, children, 2, true)
}
