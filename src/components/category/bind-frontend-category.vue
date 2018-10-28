
<!--
/*
 * @Author: wukunpeng
 * @Date: 2018-08-02 17:33:09
 * @Last Modified by: wukunpeng
 * @Last Modified time: 2018-09-12 22:36:13
 * 用于后台类目管理页面，显示类目属性组
 */
 -->
<!--
/mall-deepexi-mall-config-api/api/v1/floor/addItem
/mall-deepexi-mall-config-api/api/v1/floor/deleteItem
/mall-deepexi-mall-config-api/api/v1/floor/clearItem
-->
<!--
/*
 * @Author: wukunpeng
 * @Date: 2018-08-02 17:33:09
 * @Last Modified by: wukunpeng
 * @Last Modified time: 2018-09-12 22:36:13
 * 用于后台类目管理页面，显示类目属性组
 */
 -->


<template>
  <div>
    <span v-if="!disabled">{{name||categoryName}}</span>
    <el-button
      @click="dialogVisible=true"
    >选择关联类目</el-button>

    <el-dialog :title="title"
               @open="handleOpen"
               width="70%"
               append-to-body
               :visible.sync="dialogVisible">
      <div class="card">
        <div class="aside">
          <div class="header">
            <el-input placeholder="输入关键字进行过滤"
                      v-model="filterText">
            </el-input>
          </div>
          <el-tree
            class="filter-tree"
            v-bind="$attrs"
            :props="props"
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree">
            <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="showButton(node,data)"
            type="text"
            size="mini"
            @click="() => append(data)">
            选择
          </el-button>
        </span>
      </span>
          </el-tree>

        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {Tree} from 'element-ui'

export default {
  name: 'bind-frontend-category',
  props: ['isRoot', 'disabled', 'categoryName'],
  components: {
    'el-tree': Tree
  },
  data() {
    return {
      name: '',
      title: this.isRoot
        ? '选择关联类目 (当前为主楼层)'
        : '选择关联类目 (当前为二级楼层)',
      dialogVisible: false,
      isSaving: false,
      filterText: '',
      checkedNodes: [],
      tags: [],
      tableData3: [],
      multipleSelection: [],
      props: {
        label: 'name',
        children: 'children',
        disabled: function(data, node) {
          // 禁用为父节点没有子节点的后台类目
          return (
            data.isLeaf === '0' &&
            (!data.children || (data.children && data.children.length === 0))
          )
        }
      },
      addItems: [],
      catalogIds: []
    }
  },
  methods: {
    showButton(node, data) {
      if (!node.parent.parent) {
        if (this.isRoot) {
          return true
        } else {
          return false
        }
      } else {
        if (this.isRoot) {
          return false
        } else {
          console.log(node)
          if (!node.childNodes.length) {
            return false
          }
          return true
        }
      }
    },
    append(data) {
      console.log(data)
      let temp
      if (this.isRoot) {
        temp = data.id
      } else {
        temp = []
        data.children.forEach(item => {
          temp.push = item.id
        })
      }
      this.$emit('catalogIds', this.isRoot, temp)
      this.name = data.name
      this.dialogVisible = false
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleOpen() {
      this.$nextTick(() => {
        this.checkedNodes = this.$refs.tree.getCheckedNodes()
      })
    },
    resetName() {
      this.name = ''
    }
  },
  computed: {
    tree() {
      return this.$refs.tree
    }
  },
  watch: {
    filterText(val) {
      this.tree.filter(val)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }


  .card{
    display flex
    overflow auto
  }
  .header {
    margin-bottom: 10px;
  }
  .aside {
    flex: 0 0 35%;
    min-width: 430px;
    /*height: 700px;*/
    margin-right: 30px;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .up {
      margin-bottom: 20px;
      margin-right: 20px
    }

    .down {
      flex: 1;
    }
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
