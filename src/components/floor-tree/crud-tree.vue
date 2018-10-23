<template>
  <el-card class="curd-tree">
    <div class="header">
      <el-input placeholder="输入关键字进行过滤"
                v-model="filterText">
      </el-input>
      <div class="button-group">
        <el-button-group size="small">
          <el-button type="primary"
                     size="small"
                     @click="() => append(true)"
                     icon="el-icon-edit">新建根</el-button>
          <el-button type="primary"
                     size="small"
                     :disabled="!hasNodeSelected"
                     @click="handleSort('up')"
                     icon="el-icon-caret-top">上移</el-button>
          <el-button type="primary"
                     size="small"
                     @click="handleSort('down')"
                     :disabled="!hasNodeSelected"
                     icon="el-icon-caret-bottom">下移</el-button>
          <el-button type="primary"
                     size="small"
                     @click="handleSort('top')"
                     :disabled="!hasNodeSelected"
                     icon="el-icon-upload2">置顶</el-button>
          <el-button type="primary"
                     size="small"
                     @click="handleSort('bottom')"
                     :disabled="!hasNodeSelected"
                     icon="el-icon-download">置底</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="main">
      <el-tree ref="tree"
               class="filter-tree"
               :expand-on-click-node="false"
               :data="data"
               v-on="$listeners"
               v-bind="$attrs"
               node-key='id'
               :filter-node-method="filterNode">
        <span class="custom-tree-node"
              slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text"
                       size="mini"
                       :disabled="addNodeButtonFilter?addNodeButtonFilter(node,data):false"
                       @click="() => append(false)">
              {{createNodeTitle}}
            </el-button>
            <el-button type="text"
                       size="mini"
                       :disabled="deleteNodeButtonFilter?deleteNodeButtonFilter(node,data):false"
                       @click.stop="() => remove(node, data)">
              {{deleteNodeTitle}}
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>

    <el-dialog :title="createNodeTitle"
               :visible.sync="dialogFormVisible">
      <slot></slot>
    </el-dialog>

  </el-card>

</template>

<script>
import {Tree} from 'element-ui'

import config from './config'

export default {
  name: 'curd-tree',
  props: {
    createNodeTitle: {
      type: String,
      default: config.createNodeTitle
    },
    hasNodeSelected: {
      type: Boolean,
      default: false
    },
    deleteNodeTitle: {
      type: String,
      default: config.deleteNodeTitle
    },
    data: {
      type: Array
    },
    addNodeButtonFilter: {
      type: Function
    },
    deleteNodeButtonFilter: {
      type: Function
    }
  },
  components: {
    'el-tree': Tree
  },
  data() {
    return {
      filterText: '',
      createType: '',
      dialogFormVisible: false
    }
  },
  methods: {
    handleSort(type) {
      this.$emit(`node-sort`, {
        sortType: type,
        node: this.$refs.tree.getCurrentNode()
      })
    },
    append(type) {
      this.$emit('setAddType', type)
      return false
    },
    remove(node, data) {
      this.$emit('remove-node', {
        id: data.id,
        parentId: node.parent.data.id
      })
      return false
    },
    updateNode(data) {
      const node = this.$refs.tree.getCurrentNode()
      if (node) {
        for (let key in data) {
          node[key] = data[key]
        }
      }
    },
    hideDialogForm() {
      //隐藏dialog
      this.dialogFormVisible = false
    },

    clearTreeSelected() {
      this.$refs.tree.setCurrentKey(null)
    },
    filterNode(value, data) {
      if (!value) return true
      const key = this.$attrs.props ? this.$attrs.props.label : 'label'
      return data[key].indexOf(value) !== -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    dialogFormVisible(val) {
      this.$emit('change-visible', val)
    }
  }
}
</script>

<style lang="stylus" scoped>
.curd-tree {
  min-width: 430px;
  overflow-y: auto;
  height: 100%;

  .header {
    margin-bottom: 20px;

    .button-group {
      margin-top: 15px;
    }

    .el-button-group {
      display: flex;
    }
  }

  .main {
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      overflow: auto;
    }
  }
}
</style>
