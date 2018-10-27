
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
    <div style="margin-bottom: 20px">
      <el-button type="primary"
                 @click="handleAdd"
                 size="small">添加</el-button>
      <el-button @click="handleClear"
                 size="small">清空</el-button>
    </div>
    <div class="selection border">
      <el-tag closable
              :key="tag.id"
              v-for="tag in node.goodsInfos"
              :disable-transitions="false"
              @close="handleClose(tag.id)"
      >
        {{tag.name}}
      </el-tag>
    </div>

    <el-dialog title="后台类目"
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
          <el-tree class="filter-tree"
                   show-checkbox
                   v-bind="$attrs"
                   @check="hanldeCheck"
                   :props="props"
                   node-key="id"
                   :default-checked-keys="checkedKeys"
                   :filter-node-method="filterNode"
                   ref="tree">
          </el-tree>

        </div>
        <div class="content">
          <div class="up">
            <slot>
              <el-table
                width="auto"
                ref="multipleTable"
                :data="tableData3"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="id"
                  label="商品编号"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="商品名称"
                >
                </el-table-column>
              </el-table>
            </slot>
          </div>
          <div class="down">
            <slot name='detail'></slot>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" v-loading="isSaving" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {Tree} from 'element-ui'

export default {
  name: 'backend-category-goods-list',
  props: ['baseUrl', 'node', 'rootId'],
  components: {
    'el-tree': Tree
  },
  data() {
    return {
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
      addItems: []
    }
  },
  methods: {
    handleCancel() {
      console.log(this.node)
    },
    // handleConfirm(){},
    handleConfirm() {
      this.isSaving = true
      this.$axios
        .$post('/mall-deepexi-mall-config-api/api/v1/floor/addItem', {
          floorId: this.rootId,
          itemIds: this.addItems
        })
        .then(res => {
          console.log(res)
          this.dialogVisible = false
          this.$emit('refresh')
        })
        .catch(err => {
          console.log(err)
          this.dialogVisible = false
        })
      this.isSaving = false
      // const ids = this.nodes.map(node => node.id)
      // this.__doSave(ids)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (!this.multipleSelection.length) {
        // this.tableData3=[]
        return
      }
      this.multipleSelection.forEach(item => {
        this.addItems.push(item.id)
      })
    },
    handleClose(id) {
      this.$axios
        .$delete('/mall-deepexi-mall-config-api/api/v1/floor/deleteItem', {
          floorId: this.rootId,
          itemIdList: [id]
        })
        .then(result => {})
        .catch(err => {})
      // const ids = this.tags.map(tag => tag.id)
      // ids.splice(ids.indexOf(id), 1)
      // this.__doSave(ids)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleClear() {
      this.$axios
        .$delete(
          `/mall-deepexi-mall-config-api/api/v1/floor/clearItem?floorId=${
            this.rootId
          }`
        )
        .then(result => {
          console.log(result)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleAdd() {
      this.dialogVisible = true
    },
    handleOpen() {
      this.$nextTick(() => {
        this.checkedNodes = this.$refs.tree.getCheckedNodes()
      })
    },

    __doSave(ids) {
      this.$axios
        .$post(`${this.baseUrl}?preCategory=${this.node.id}`, ids)
        .then(data => {
          const {catalogs, precategory} = data.payload
          this.tags = catalogs || []
          this.$emit('save', Object.assign({}, precategory, {catalogs}))
          this.dialogVisible = false
          this.isSaving = false
          this.node.catalogs = !!this.tags.length
        })
        .catch(error => {
          this.isSaving = false
          this.dialogVisible = false
        })
    },

    hanldeCheck(data, props) {
      console.log(props)
      if (!props.checkedNodes.length) {
        this.tableData3 = []
        return
      }
      this.checkedNodes = props.checkedNodes
      let temp = []
      this.checkedNodes.forEach(item => {
        if (!item.children) {
          temp.push(item.id)
        }
      })
      console.log(temp)
      this.$axios
        .$put('/mall-deepexi-mall-config-api/api/v1/floor/getItem', {
          catalogIds: temp
        })
        .then(result => {
          console.log(result.payload)
          this.tableData3 = result.payload
        })
        .catch(err => {
          console.log(err)
        })
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
