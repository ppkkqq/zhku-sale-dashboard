<template>
  <div class="update-car-type-table">
    <div style="margin-bottom: 20px">
      <el-button type="primary"
                 :disabled="!hasNodeSelected"
                 @click="handleAdd"
                 size="small">添加</el-button>
    </div>
    <div class="table-container">
      <el-table :data="tableData"
                height="350"
                border>
        <el-table-column prop="name"
                         label="车型名称">
        </el-table-column>
        <el-table-column prop="applyBussiness"
                         :filters="applyBussinessFilters"
                         :filter-method="filterHandler"
                         width="100"
                         label="适用业务">
        </el-table-column>
        <el-table-column prop="salability"
                         :filters="salabilityFilters"
                         :filter-method="filterHandler"
                         width="80"
                         label="可售性">
        </el-table-column>
        <el-table-column prop="yearStyle"
                         :filters="yearFilters"
                         :filter-method="filterHandler"
                         width="100"
                         label="年款">
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         width="160">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)"
                       type="primary"
                       size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)"
                       type="danger"
                       size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加车型"
               :visible.sync="dialogVisible">
      <update-car-type-form :data="editForm"
                            @submit="handleSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import UpdateCarTypeForm from './update-car-type-form'
import Vue from 'vue'
import {carModels} from '@/const/api.js'
import remove from 'lodash/remove'
import findIndex from 'lodash/findIndex'
import {yearOptions} from '@/const/config.js'
const yearFilters = yearOptions.map(item => {
  const {label, value} = item
  return {
    text: label,
    value
  }
})
const salabilityFilters = ['停售', '在售'].map(item => {
  return {
    text: item,
    value: item
  }
})
const applyBussinessFilters = ['销售', '售后', '售后,销售'].map(item => {
  return {
    text: item,
    value: item
  }
})
export default {
  name: 'update-car-type-table',
  components: {
    UpdateCarTypeForm
  },
  props: ['tableData', 'hasNodeSelected', 'node'],
  data() {
    return {
      searchForm: {},
      editForm: {},
      dialogVisible: false,
      yearFilters,
      salabilityFilters,
      applyBussinessFilters
    }
  },

  methods: {
    onSearch() {},
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleAdd() {
      this.dialogVisible = true
      this.editForm = {}
    },
    handleEdit(row) {
      const applyBussiness = row.applyBussiness.split(',')
      this.editForm = {...row, applyBussiness}
      this.$nextTick(() => {
        this.dialogVisible = true
      })
    },
    handleSave() {
      this.dialogVisible = false
    },
    async handleSubmit(data) {
      data.carSeriesId = this.node.id
      data.applyBussiness = data.applyBussiness.join(',')

      let table = []

      if (this.editForm.id) {
        const {name, applyBussiness, salability, yearStyle} = data
        const {payload} = await this.$axios.$put(
          `${carModels}/${this.editForm.id}`,
          {
            name,
            applyBussiness,
            salability,
            yearStyle
          }
        )
        const index = findIndex(this.tableData, ['id', this.editForm.id])
        table = [...this.tableData]
        table[index] = payload
      } else {
        const {payload} = await this.$axios.$post(carModels, data)
        table = [...this.tableData, payload]
      }
      this.$emit('update-table', table)
      this.dialogVisible = false
    },
    handleDelete(data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.$delete(`${carModels}/${data.id}`).then(result => {
          this.$emit(
            'update-table',
            remove(this.tableData, item => item.id !== data.id)
          )
        })
      })
    }
  }
}
</script>

<style lang="stylus">
.update-car-type-table {
  .table-container {
    height: 400px;
    overflow: auto;
  }

  .search-form {
    .el-form-item__content {
      width: 100px;
    }
  }
}
</style>
