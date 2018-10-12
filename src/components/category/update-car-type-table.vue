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
                v-loading="isLoading"
                border>
        <el-table-column prop="name"
                         label="车型名称">
        </el-table-column>
        <el-table-column prop="code"
                         label="编码">
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
                @open="handleOpen"
               :visible.sync="dialogVisible">
      <update-car-type-form :data="editForm"
                            ref="editForm"
                            @submit="handleSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import UpdateCarTypeForm from './update-car-type-form'
import {carModels} from '@/const/api.js'
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
  props: ['hasNodeSelected', 'node'],
  data() {
    return {
      tableData: [],
      searchForm: {},
      editForm: {},
      dialogVisible: false,
      yearFilters,
      salabilityFilters,
      applyBussinessFilters,
      isLoading: false
    }
  },

  methods: {
    getCarModel(id) {
      let data = {
        carSeriesId: id
      }

      this.isLoading = true
      this.$axios
        .$put(carModels, data)
        .then(resp => {
          this.isLoading = false
          this.tableData = (resp.payload && resp.payload.content) || []
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    onSearch() {},
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    handleAdd() {
      this.editForm = {}
      this.dialogVisible = true
    },
    handleEdit(row) {
      const applyBussiness =
        (row.applyBussiness && row.applyBussiness.split(',')) || []
      this.editForm = {...row, applyBussiness}
      this.dialogVisible = true
    },
    handleSave() {
      this.dialogVisible = false
    },
    handleOpen() {
      //弹窗打开时，将当前的表单数据填充表单
      this.$nextTick(() => {
        this.$refs.editForm.setFormData(this.editForm)
      })
    },
    async handleSubmit(data) {
      data.carSeriesId = this.node.id
      data.applyBussiness = data.applyBussiness.join(',')

      let table = []

      if (this.editForm.id) {
        const {name, applyBussiness, salability, yearStyle, logoUrl} = data
        try {
          const {payload} = await this.$axios.$put(
            `${carModels}/${this.editForm.id}`,
            {
              name,
              applyBussiness,
              salability,
              yearStyle,
              logoUrl
            }
          )

          const index = findIndex(this.tableData, ['id', this.editForm.id])
          table = [...this.tableData]
          table[index] = payload
        } catch (e) {}
      } else {
        try {
          const {payload} = await this.$axios.$post(carModels, data)
          table = [...this.tableData, payload]
        } catch (e) {}
      }

      this.tableData = table
      this.dialogVisible = false
    },
    handleDelete(data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.$delete(`${carModels}/${data.id}`).then(result => {
            this.tableData = this.tableData.filter(it => it.id !== data.id)
          })
        })
        .catch(e => {})
    },

    clearTableData() {
      this.tableData = []
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
