export {customConfirm} from './custom-confirm'
export {tree2List, nodeUp, nodeDown, nodeTop, nodeBootom} from './tree'

//模拟异步
export function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
