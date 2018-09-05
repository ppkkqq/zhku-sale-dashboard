<!--
/*
 * @Author: wukunpeng 
 * @Date: 2018-08-02 17:33:09 
 * @Last Modified by: wukunpeng
 * @Last Modified time: 2018-09-03 17:34:07
 * 用于后台类目管理页面，显示类目属性组
 */
 -->

 
<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary"
                 @click="handleAdd"
                 :disabled="!hasNodeSelected"
                 size="small">添加</el-button>
      <el-button @click="handleClear"
                 :disabled="!hasNodeSelected"
                 size="small">清空</el-button>
    </div>
    <div class="selection border">
      <el-tag closable
              :key="tag.id"
              v-for="tag in tags"
              :disable-transitions="false"
              @close="handleClose(tag.id)">
        {{tag.name}}
      </el-tag>
    </div>

    <el-dialog title="后台类目"
               :visible.sync="dialogVisible">
      <div class="header">
        <el-input placeholder="输入关键字进行过滤"
                  v-model="filterText">
        </el-input>
      </div>
      <el-tree class="filter-tree"
               show-checkbox
               v-bind="$attrs"
               @check="hanldeCheck"
               node-key="id"
               :default-checked-keys="checkedKeys"
               :filter-node-method="filterNode"
               ref="tree">
      </el-tree>

      <div slot="footer">
        <el-button type="primary"
                   @click="handleSave">保存</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {Tree} from 'element-ui'

export default {
  name: 'bind-backend-category',
  props: ['hasNodeSelected', 'baseUrl', 'node'],
  components: {
    'el-tree': Tree
  },
  data() {
    return {
      dialogVisible: false,
      filterText: '',
      checkedNodes: [],
      tags: []
    }
  },
  methods: {
    handleClose(id) {
      const ids = this.tags.map(tag => tag.id)
      ids.splice(ids.indexOf(id), 1)
      this.__doSave(ids)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleClear() {
      this.__doSave([])
    },
    handleAdd() {
      this.dialogVisible = true
    },

    __doSave(ids) {
      this.$axios
        .$post(`${this.baseUrl}?preCategory=${this.node.id}`, ids)
        .then(data => {
          const {catalogs, precategory} = data.payload
          this.tags = catalogs || []
          this.$emit('save', Object.assign({}, precategory, {catalogs}))
          this.dialogVisible = false
          this.checkedNodes = []
        })
        .catch(error => {})
    },
    handleSave() {
      const ids = this.nodes.map(node => node.id)
      this.__doSave(ids)
    },
    hanldeCheck(data, props) {
      this.checkedNodes = props.checkedNodes
    }
  },
  computed: {
    tree() {
      return this.$refs.tree
    },
    checkedKeys() {
      return this.tags.map(item => item.id)
    },
    label() {
      const {props = {}} = this.$attrs
      return props.label || 'name'
    },
    nodes() {
      return this.checkedNodes.filter(node => {
        return node.isLeaf === '1'
      })
    }
  },
  watch: {
    filterText(val) {
      this.tree.filter(val)
    },
    node(val) {
      if (val && val.catalogs) {
        this.tags = val.catalogs.slice() || []
      } else {
        this.tags = []
      }
    },
    tags(val) {
      if (val && this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(val.map(node => node.id))
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.header {
  margin-bottom: 10px;
}

.selection {
  height: 100px;
  padding: 10px 10px;
  overflow: auto;
}

.el-tag {
  margin-left: 10px;
}

.el-tag + .el-tag {
  margin-top: 10px;
}
</style>
