import merge from 'lodash/merge'
import keys from 'lodash/mapValues'
import Vue from 'vue'

import {tree2List, nodeUp, nodeDown, nodeTop, nodeBootom} from '@/utils'

const NODE_TYPE = {
  id: '',
  name: '',
  description: '',
  loaded: false,
  displayUrl: '',
  parentId: '',
  children: [],
  attributeGroups: [],
  catalogs: [],
  isLeaf: null
}
const KEYS = keys(NODE_TYPE)
export const state = url => () => ({
  data: [],
  url,
  loading: false,
  defaultProps: {
    children: 'children',
    label: 'name'
  },
  editForm: {...NODE_TYPE},
  nodeKey: 'id',
  createType: '',
  currentKey: null
})

export const getters = {
  nodesMap(state, getters) {
    return getters.list.reduce((prev, curr) => {
      prev[curr.id] = curr
      return prev
    }, {})
  },
  hasNodeSelected(state) {
    return !!state.currentKey
  },
  hasLeafNodeSelected(state, getters) {
    const node = getters.currentNode
    return node ? node.isLeaf === '1' : false
  },

  currentNode(state, getters) {
    return getters.nodesMap[state.currentKey] || {}
  },

  names(state, getters) {
    let list = []
    if (state.createType === 'addRoot') {
      list = state.data
    } else if (getters.currentNode) {
      list = getters.currentNode.children || []
    }
    return list.map(node => node.name)
  },
  list(state) {
    let result = []
    tree2List(state.data, result)
    return result
  },
  loaded(state) {
    return state.data.length > 0
  }
}
export const mutations = {
  loading(state) {
    state.loading = true
  },
  hideLoading() {
    state.loading = false
  },
  initTree(state, tree) {
    state.data = tree || []
    state.loading = false
  },
  setCreateType(state, type) {
    state.createType = type
  },
  updateSort(state, {parent, sorted}) {
    if (parent.children) {
      parent.children = sorted
    } else {
      state.data = sorted
    }
    state.loading = false
  },
  addRoot(state, {data}) {
    if (!data.children) {
      data.children = []
    }
    state.data.push(data)
    state.loading = false
  },
  updateEditForm(state, payload) {
    merge(state.editForm, payload)
  },
  addChild(state, {data, parent}) {
    if (!data.children) {
      data.children = []
    }
    if (!parent.children) {
      parent.children = []
    }
    parent.children.push(data)
    state.loading = false
  },
  remove(state, {id, parent}) {
    const children = parent.children || state.data
    const index = children.findIndex(d => d.id === id)
    children.splice(index, 1)
    state.loading = false
  },
  updateNode(state, {node, data}) {
    ;[
      'name',
      'description',
      'isLeaf',
      'displayUrl',
      'catalogs',
      'attributeGroups'
    ].forEach(key => {
      if (data[key]) {
        Vue.set(node, key, data[key])
      }
    })
    state.loading = false
  },
  clearNode(state) {
    //清除选择节点
    state.currentKey = null
    state.editForm = {...NODE_TYPE}
  },
  setCurrent(state, {node, data}) {
    //重置修改表单
    const {id, attributeGroups = [], loaded, catalogs = []} = data
    data.children = node.children
    state.editForm = data

    merge(node, {
      attributeGroups,
      catalogs,
      loaded
    })
    state.currentKey = id
    state.loading = false
  }
}

export const actions = {
  async addNode({commit, state, getters}, node) {
    //检查
    const {node: data, nodeType} = node
    if (nodeType === 'addChild') {
      data.parentId = state.currentKey
    }
    const {payload} = await this.$axios.$post(state.url, data)
    commit(nodeType, {
      data: payload,
      parent: getters.nodesMap[state.currentKey]
    })
  },

  async setCurrent({commit, state, getters}, {id}) {
    if (getters.nodesMap[id].loaded) {
      commit('setCurrent', {
        node: getters.nodesMap[id],
        data: {...getters.nodesMap[id]}
      })
    } else {
      commit('loading')

      const {payload} = await this.$axios.$get(`${state.url}/${id}`)
      const {catalog, attributeGroups, precategory, catalogs} = payload

      const data = catalog || precategory
      if (attributeGroups) {
        data.attributeGroups = attributeGroups
      }

      if (catalogs) {
        data.catalogs = catalogs
      }
      data.loaded = true
      //详情不返会子节点
      delete data.children

      commit('setCurrent', {
        node: getters.nodesMap[id],
        data: data
      })
    }
  },
  async loadTree({commit, state, getters}, url) {
    if (getters.loaded) return //已经加载了则不进行加载
    commit('loading')
    const {payload} = await this.$axios.$get(state.url + '/tree')
    commit('initTree', payload)
  },
  async removeNode({commit, state, getters}, node) {
    const {id, parentId} = node
    commit('loading')

    const {payload} = await this.$axios.$delete(`${state.url}/${id}`)
    commit('remove', {
      id,
      parent: parentId ? getters.nodesMap[parentId] : {}
    })
    commit('clearNode')
  },
  setNode({commit, state, getters}, payload) {
    commit('updateNode', {
      node: getters.nodesMap[state.currentKey],
      data: payload
    })
  },
  async updateNode({commit, state, getters}, node) {
    const {name, description, isLeaf, displayUrl} = state.editForm
    commit('loading')

    const {payload} = await this.$axios.$put(
      `${state.url}/${state.editForm.id}`,
      {
        name,
        description,
        isLeaf,
        displayUrl
      }
    )

    commit('updateNode', {
      node: getters.nodesMap[state.editForm.id],
      data: payload
    })
    commit('clearNode')
  },
  async sortNode({commit, state, getters}, {node, sortType}) {
    const {parentId, id} = node
    const parent = getters.nodesMap[parentId] || state.data
    const children = parent && parent.children ? parent.children : state.data
    if (children.length === 1) {
      //只有一个不需要调整顺序
      commit('clearNode')
      return false
    } else {
      let keys = []
      switch (sortType) {
        case 'up':
          keys = nodeUp(children.map(node => node.id), id)
          break
        case 'down':
          keys = nodeDown(children.map(node => node.id), id)
          break
        case 'top':
          keys = nodeTop(children.map(node => node.id), id)
          break
        case 'bottom':
          keys = nodeBootom(children.map(node => node.id), id)
          break
      }
      const sorted = keysFormatter(keys)
      let result = false

      if (sorted.length > 0) {
        commit('loading')
        const {payload} = await this.$axios.$put(state.url, sorted)
        result = {
          sorted: keys.map(key => {
            return {
              ...getters.nodesMap[key]
            }
          }),
          parent
        }
        commit('updateSort', result)
      }
      commit('clearNode')

      return result
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

function keysFormatter(arr) {
  return arr.map((item, index) => {
    return {
      id: item,
      sort: index + 1
    }
  })
}
