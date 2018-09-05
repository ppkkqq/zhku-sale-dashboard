//将数据结构转为list数据结构
export function tree2List(array, result) {
  if (array && array.length > 0) {
    array.reduce((prev, curr) => {
      prev.push(curr)
      if (curr.children) {
        tree2List(curr.children, prev)
      }
      return prev
    }, result)
  }
}
export function nodeUp(arr, item) {
  const index = arr.indexOf(item)

  if (index > 0) {
    return array_move(arr, index, index - 1)
  }
  return []
}
export function nodeDown(arr, item) {
  const index = arr.indexOf(item)

  if (index < arr.length - 1 && index !== -1) {
    return array_move(arr, index, index + 1)
  }
  return []
}
export function nodeTop(arr, item) {
  const index = arr.indexOf(item)

  if (index > 0) {
    return array_move(arr, index, 0)
  }
  return []
}
export function nodeBootom(arr, item) {
  const index = arr.indexOf(item)
  if (index < arr.length - 1 && index !== -1) {
    return array_move(arr, index, arr.length - 1)
  }
  return []
}

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr
}
