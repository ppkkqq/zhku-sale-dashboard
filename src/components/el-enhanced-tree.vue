<template>
  <div class="el-enhanced-tree">
    <el-tree
      v-bind="$attrs"
      v-on="$listeners"
      @check="DefaultCheckHandler"
      ref="tree">
    </el-tree>
  </div>
</template>
<script>
const dataPath = 'payload.content'
import {Tree} from 'element-ui'

/**
 * @func methodFactory
 * @desc 产生中转函数，在实例化后，供外部组件调用内部组件ElTree的实例方法
 * @param VueComponent instance
 * @param VueComponent target
 */
function methodFactory(instance, target) {
  let unused = [
    '_c',
    '$createElement',
    'broadcast',
    'dispatch',
    'handelKeydown',
    'handleNodeExpand',
    'initTabIndex',
    'getNodeKey',
    'getNodePath'
    // 'setCheckedKeys' // 拦截行为
  ]
  //
  let keys = Object.getOwnPropertyNames(instance)
  let methods = keys.filter(name => {
    if (typeof instance[name] === 'function') return name
  })
  // console.log(methods)
  //
  Object.getOwnPropertyNames(instance).forEach(name => {
    if (unused.indexOf(name) == -1 && typeof instance[name] === 'function')
      target[name] = instance[name]
  })
}

/**
 * @func pathToName
 * @desc 将路径的节点id转换为节点name
 * @param String[] path
 * @param Object[] tree
 * @ret String[]
 */
function pathToName(path, tree) {
  let names = []
  path = path.slice(0)
  let node = tree.filter(node => {
    return node.id === path[0]
  })[0]

  if (node) {
    names.push(node.name)
    path.shift()
    if (node.children) {
      names = names.concat(pathToName(path, node.children))
    }
  }
  return names
}
/**
 * @func treeFlatten
 * @desc 将树结构拍平
 * @param Object[] data
 * @ret String[]
 */
function treeFlatten(data) {
  let tmp = []
  data.forEach(record => {
    tmp.push(record)
    const children = record['children']
    if (children && children.length > 0) {
      const childrenDate = treeFlatten(children)
      tmp = tmp.concat(childrenDate)
    }
  })
  return tmp
}

export default {
  components: {
    'el-tree': Tree
  },
  inheritAttrs: false,
  name: 'ElEnhancedTree',
  data() {
    return {
      leafUnique: true,
      tree: {}
    }
  },
  mounted() {
    this.leafUnique = this.$attrs.hasOwnProperty('leaf-unique')
    // console.log(
    //   '$attrs',
    //   this.$attrs,
    //   'leafUnique',
    //   this.leafUnique,
    //   '$listeners',
    //   this.$listeners
    // )
    methodFactory(this.$refs.tree, this)
  },
  watch: {},
  methods: {
    /**
     * @func getKeyByName
     * @desc 由节点name获取节点Key
     * @param String name
     * @ret String
     */
    getKeyByName(name) {
      let array = treeFlatten(this.$attrs.data)
      let node = array.filter(item => {
        return item.name == name
      })[0]

      return node ? node.id : ''
    },
    /**
     * @func getSelectedKeys
     * @desc 获得所有选择的节点id，包括勾选、半勾选的节点
     * @ret String[]
     */
    getSelectedKeys() {
      let tree = this.$refs.tree
      let pathChecked = tree.getCheckedKeys() // 仅checked node，不含 halfChecked node
      let inner = tree.getHalfCheckedKeys()
      return inner.concat(pathChecked)
    },
    /**
     * @func getSelectedNames
     * @desc 获得所有选择的节点name，包括勾选、半勾选的节点
     * @ret String[]
     */
    getSelectedNames() {
      let path = this.getSelectedKeys()
      return path.length > 0 ? pathToName(path, this.$attrs.data) : []
    },
    DefaultCheckHandler(checkedNode, currentCheckedNodes) {
      /**
       * 节点可勾选时，点击返回两个参数，依次为：
       *    传递给 data 属性的数组中该节点所对应的对象、
       *    树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
       * @event check
       */
      if (!this.leafUnique) {
        this.$emit('check', checkedNode, currentCheckedNodes)
        return
      }

      this.setLeafUnique(checkedNode.id)
      this.$emit('check', checkedNode, currentCheckedNodes)
    },
    /**
     * @func setLeafUnique
     * @desc 设置唯一的叶节点
     * @param String key
     */
    setLeafUnique(key) {
      let tree = this.$refs.tree
      let leaf = tree.getCheckedKeys(true)
      let isLeaf = leaf.indexOf(key) != -1
      tree.setCheckedKeys([key])
      if (isLeaf) {
        leaf = [key]
      } else {
        leaf = tree.getCheckedKeys(true)
        tree.setCheckedKeys([leaf[0]])
      }
    }
    /**
     * @func setCheckedKeys
     * @desc 根据leafUnique值判断是否限制叶节点数为一，true则设置叶节点数=1，false则调用ElTree原有的setCheckedKeys设置子节点及叶节点
     * @param Array keyArray
     */
    // setCheckedKeys(keyArray) {
    //   let tree = this.$refs.tree
    //   if (!this.leafUnique) {
    //     tree.setCheckedKeys(keyArray)
    //     return
    //   }
    //   if (keyArray.length > 1) {
    //     keyArray = keyArray.slice(0, 1)
    //   }
    // }
  }

  // props: {
  //   /**
  //    * 树型结构数据源
  //    */
  //   data: {
  //     type: Array,
  //     default: function() {
  //       return []
  //     }
  //   },
  //   /**
  //    * 配置选项
  //    * @link http://element.eleme.io/#/zh-CN/component/tree#props
  //    */
  //   props: {
  //     type: Object,
  //     default: function() {
  //       return {}
  //     }
  //   },
  //   /**
  //    * 内容为空的时候展示的文本
  //    */
  //   emptyText: {
  //     type: String,
  //     default: '暂无数据'
  //   },
  //   /**
  //    * 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
  //    */
  //   nodeKey: {
  //     type: String,
  //     default: 'id'
  //   },
  //   /**
  //    * 是否默认展开所有节点
  //    */
  //   defaultExpandAll: {
  //     type: Boolean,
  //     default: false
  //   },
  //   /**
  //    * 节点是否可被选择
  //    */
  //   showCheckbox: {
  //     type: Boolean,
  //     default: false
  //   },
  //   /**
  //    * 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
  //    */
  //   filterNodeMethod: {
  //     type: Function
  //   },
  //   /**
  //    * 勾选节点时，若该节点有多个叶节点，是否只保留一个叶节点
  //    */
  //   leafUnique: {
  //     type: Boolean,
  //     default: true
  //   },
  //   /**
  //    *
  //    */
  //   props: {
  //     type: Object,
  //     default: function() {
  //       return {}
  //     }
  //   },
  //   /**
  //    *
  //    */
  //   props: {
  //     type: Object,
  //     default: function() {
  //       return {}
  //     }
  //   }
  // },
}
</script>
<style scoped>
</style>
