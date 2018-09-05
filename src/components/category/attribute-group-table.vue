<!--
/*
 * @Author: wukunpeng
 * @Date: 2018-08-02 17:33:09
 * @Last Modified by: wukunpeng
 * @Last Modified time: 2018-08-31 18:28:40
 * 用于后台类目管理页面，显示类目属性组
 */
 -->


<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary"
                 :disabled="!hasNodeSelected"
                 @click="handleAdd"
                 size="small">添加</el-button>
    </div>
    <el-table :data="tableData"
              height="350"
              border>
      <el-table-column prop="name"
                       label="属性组名称"
                       width="100px">
      </el-table-column>
      <el-table-column prop="attributeList"
                       :formatter="formatter"
                       label="属性名称">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row)"
                     type="danger"
                     size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加类目属性"
               :visible.sync="dialogVisible">
      <atrribute-group-list ref="table"
                            :selection="selection"
                            @selection-change="handleSelectionChange" />
      <div slot="footer">
        <el-button type="primary"
                   @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AtrributeGroupList from './atrribute-group-list'
import {catalogAttr} from '@/const/api.js'
import {customConfirm} from '@/utils'
export default {
  name: 'attribute-group-table-component',
  components: {
    AtrributeGroupList
  },
  props: ['hasNodeSelected', 'node'],
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      multipleSelection: []
    }
  },

  methods: {
    formatter(row, column) {
      return row['attributeList'].map(item => (item ? item.name : '')).join(',')
    },
    handleAdd() {
      this.dialogVisible = true
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    async handleSave() {
      const data = this.multipleSelection.map(item => item.id)
      const {payload} = await this.$axios.$post(
        `${catalogAttr}?catalogId=${this.catalogId}`,
        data
      )
      this.__update(payload.attributeGroups)
    },
    async removeAttr(data) {
      const {payload} = await this.$axios.$delete(`${catalogAttr}`, {data})
      this.__update(payload.attributeGroups)
    },
    __update(attributeGroups = []) {
      this.tableData = attributeGroups
      this.$emit('set-node', {
        attributeGroups
      })
      this.dialogVisible = false
      this.multipleSelection = []
    },
    handleDelete(data) {
      customConfirm({
        cb: this.removeAttr,
        payload: {
          catalogId: this.catalogId,
          attrGroupId: data.id
        }
      })
    }
  },
  computed: {
    selection() {
      return (this.tableData || []).map(item => item.id)
    },
    catalogId() {
      return this.node.id
    }
  },
  watch: {
    node(val) {
      if (val && val.attributeGroups) {
        this.tableData = val.attributeGroups.slice() || []
      }
    }
  }
}
</script>
