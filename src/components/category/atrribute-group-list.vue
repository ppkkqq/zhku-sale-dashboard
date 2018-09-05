
<template>
  <el-data-table ref="dataTable"
                 :url="url"
                 :columns="columns"
                 :hasNew="false"
                 :hasEdit="false"
                 :hasDelete="false"
                 :hasOperation="false"
                 :isTree="false"
                 :single="false"
                 :hasPagination="true"
                 v-on="$listeners"
                 :searchForm="searchForm"
                 :dataPath="dataPath"
                 :totalPath="totalPath">
  </el-data-table>
</template>

<script>
import {attributeGroups} from '@/const/api'

export default {
  name: 'atrribute-group-list-component',
  props: ['selection'],
  data() {
    return {
      url: attributeGroups,
      multipleSelection: [],
      columns: [
        {
          type: 'selection',
          width: '55',
          selectable: this.handleSelectable
        },
        {
          prop: 'name',
          label: '分组名称',
          'show-overflow-tooltip': true,
          minWidth: '120px'
        },
        {
          prop: 'attributeList',
          label: '属性名称',
          'show-overflow-tooltip': true,
          minWidth: '220px',
          formatter: ({attributeList}) => {
            if (!!attributeList) {
              return attributeList.reduce((str, it, i) => {
                let suffix = i === attributeList.length - 1 ? '' : '，'
                return (str += it.name + suffix)
              }, '')
            }
          }
        }
      ],
      totalPath: 'payload.totalElements',
      dataPath: 'payload.content',
      form: [],
      searchForm: [
        {
          $type: 'input',
          $id: 'name',
          label: '分组名称',
          $el: {placeholder: '请输入'}
        },
        {
          $type: 'input',
          $id: 'attributeName',
          label: '属性名称',
          $el: {placeholder: '请输入'}
        }
      ]
    }
  },
  methods: {
    handleSelectable(row, index) {
      return !(this.selection || []).includes(row.id)
    }
  },
  watch: {
    selection(val) {
      if (this.$refs.dataTable) {
        //清除选中状态
        this.$refs.dataTable.$refs.table.clearSelection()
      }
    }
  }
}
</script>
<style scoped>
</style>
