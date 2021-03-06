<template>
  <div class="el-crud-tree"
       v-loading="loading">
    <div class="aside">
      <crud-tree ref="tree"
                 :data="tree"
                 :props="defaultProps"
                 :hasNodeSelected="hasNodeSelected"
                 highlight-current
                 @node-click="setCurrent"
                 @change-visible="changeVisible"
                 :addNodeButtonFilter="addNodeButtonFilter"
                 :deleteNodeButtonFilter="deleteNodeButtonFilter"
                 @create-type="setStatus"
                 @node-sort="handleSortNode"
                 @createData="createData"
                 @remove-node="handleRemoveNode">
        <slot name='create'></slot>
      </crud-tree>
    </div>
    <div class="content">
      <div class="up">
        <slot></slot>
      </div>
      <div class="down">
        <slot name='detail'></slot>
      </div>
    </div>
  </div>
</template>

<script>
import CrudTree from '@/components/floor-tree/crud-tree'
import property from 'lodash/property'
import {
  customConfirm,
  tree2List,
  nodeUp,
  nodeDown,
  nodeTop,
  nodeBootom
} from '@/utils'

import merge from 'lodash/merge'

export default {
  name: 'el-crud-tree',
  components: {
    CrudTree
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    dataPath: {
      type: String,
      default: 'payload'
    },
    parentKey: {
      type: String,
      default: 'parentId'
    },
    disabledLoadNodeDetail: {
      type: Boolean,
      default: false
    },
    addNodeButtonFilter: {
      type: Function,
      default: data => true
    },
    deleteNodeButtonFilter: {
      type: Function,
      default: data => true
    },
    changeVisible: {
      type: Function,
      default: data => true
    }
  },
  data() {
    return {
      //页面配置
      loading: false,
      tree: [],
      //树配置
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentKey: null,
      currentData: {},
      //表单配置
      status: ''
    }
  },
  methods: {
    createData(id, name) {
      this.$emit('createData', id, name)
    },
    async loadTree() {
      this.loading = true
      try {
        const data = await this.$axios.$get(`${this.url}/allFloor`)
        this.tree = property(this.dataPath)(data)
        console.log(this.tree)
      } catch (error) {
      } finally {
        this.loading = false
      }
    },
    async loadNodeDetail(id) {
      // if (this.idMap[id]._loaded) return

      this.loading = true

      // const {payload} = await this.$axios.$get(`${this.url}/${id}`)
      // payload._loaded = true
      // this.mergeNode(id, payload)
      this.loading = false
    },
    setStatus(type) {
      this.status = type
      this.$emit('create-type', type)
    },

    addChild(node) {
      node.pcCarModelList = node.pcCarModelList || []
      if (!this.currentData.children) {
        this.$set(this.currentData, 'children', [])
      }
      this.currentData.children.push(node)
    },
    addRoot(node) {
      this.tree.push(node)
    },

    //新增
    async addNode(isAddRoot, data, url) {
      //新增节点发送相关相求
      this.loading = true
      try {
        if (this.status === 'addChild') {
          data.parentId = this.currentKey
        }
        const {payload} = await this.$axios.$post(url, data)
        this.loadTree()

        // this[this.status](payload)
        if (isAddRoot) {
          console.log('isAddRoot', isAddRoot)
          console.log(payload.id)
          this.$emit('addItems', payload.id)

          this.loading = false
          this.clearCurrent()
        } else {
          this.$refs.tree.hideDialogForm()
        }
      } catch (error) {
        this.$message.error(error.message)
        this.loading = false
        this.clearCurrent()
      }
    },

    async removeNode(id) {
      this.loading = true
      const url = `/mall-deepexi-mall-config-api/api/v1/floor/deleteFloor?id=${id}`

      try {
        const {payload} = await this.$axios.$delete(url)
        //删除树形节点
        this.loadTree()
        this.loading = false
        this.clearCurrent()
      } catch (error) {
        this.loading = false
        this.clearCurrent()
      }
    },

    //删除
    async handleRemoveNode(id) {
      customConfirm({
        cb: this.removeNode,
        payload: id
      })
    },

    //排序
    async handleSortNode({sortType, node}) {
      const id = node.id
      const pid = node[this.parentKey]

      const parent = this.idMap[pid]
      const children = parent ? parent.children : this.tree
      if (children.length === 1) {
        //只有一个不需要调整顺序
        this.clearCurrent()

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
        const sorted = keys.map((id, index) => ({
          id,
          parentId: pid,
          sort: index + 1
        }))
        let result = false

        if (sorted.length > 0) {
          this.loading = true

          try {
            const {payload} = await this.$axios.$post(
              `/mall-deepexi-mall-config-api/api/v1/floor/moveFloor?operation=${sortType}&id=${
                node.id
              }`
            )
            const nodes = keys.map(id => {
              const data = {...this.idMap[id]}
              //树形节点不会根据数据响应，导致需要先删除节点，然后再生成，性能低
              this._remove(this.idMap[id])
              delete data.$treeNodeId
              return data
            })

            if (parent && parent.children) {
              this.$set(parent, 'children', nodes)
            } else {
              this.tree = nodes
            }
          } catch (error) {
          } finally {
            this.loading = false
            this.clearCurrent()
          }
        }
        this.clearCurrent()

        return result
      }
    },
    //根据data删除node
    _remove(data) {
      this.$refs.tree.$refs.tree.remove(data)
    },
    //设置节点选中
    setCurrent(data, node) {
      this.currentKey = data ? data.id : ''
      this.currentData = data
      if (this.currentKey && !this.disabledLoadNodeDetail) {
        this.loadNodeDetail(this.currentKey).then(() => {
          this.$emit('node-click', {data, node})
        })
      } else {
        this.$emit('node-click', {data, node})
      }
    },
    clearCurrent() {
      this.currentKey = ''
      this.loading = false
      this.currentData = {}
      this.$refs.tree.clearTreeSelected()
      this.$emit('clear-node')
    },
    //更新节点数据
    mergeNode(id, data) {
      const pre = this.idMap[id]
      Object.keys(data).forEach(key => {
        this.$set(pre, key, data[key])
      })
    },
    //todo 验证
    //更新节点
    async updateNode(data, url) {
      //新增节点发送相关相求
      this.loading = true
      try {
        const {payload} = await this.$axios.$post(url, data)
        this.loadTree()
        // this[this.status](payload)
        this.$refs.tree.hideDialogForm()
        this.loading = false
        this.clearCurrent()
      } catch (error) {
        this.$message.error(error.message)
        this.loading = false
        this.clearCurrent()
      }
    }
  },
  mounted: function() {
    this.loadTree()
  },
  beforeDestroy: function() {
    this.clearCurrent()
  },
  computed: {
    list(state) {
      let result = []
      tree2List(this.tree, result)
      return result
    },

    idMap() {
      return this.list.reduce((prev, curr) => {
        prev[curr.id] = curr
        return prev
      }, {})
    },
    hasNodeSelected(state) {
      return !!this.currentKey
    },
    formKeys() {
      return this.form.map(item => item.$id)
    },
    hasLeafNodeSelected() {
      return this.currentData ? !!this.currentData.carBrandId : false
    },
    names(state, getters) {
      let list = []
      if (this.status === 'addRoot') {
        list = this.tree
      } else if (this.currentData) {
        list = this.currentData.children || []
      }
      return list.map(node => node.name)
    }
  }
}
</script>

<style lang="stylus" >
.el-crud-tree {
  display: flex;

  .box-card {
    height: 100%;
  }

  .aside {
    flex: 0 0 35%;
    min-width: 430px;
    height: 700px;
    margin-right: 30px;

    .header {
      margin-bottom: 20px;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .up {
      margin-bottom: 20px;
    }

    .down {
      flex: 1;
    }
  }
}
</style>
