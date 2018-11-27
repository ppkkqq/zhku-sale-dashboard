//模拟异步
export function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export function isNull(o) {
  return o === null || o === void 0
}
