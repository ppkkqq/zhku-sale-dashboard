<template>
  <el-data-table
    ref="dataTable"
    :url="url"
    :columns="columns"
    :hasNew="false"
    :hasEdit="false"
    :hasDelete="false"
    :extraButtons="extraButtons"
    hasOperation
    hasPagination
    treeParentValue="name"
    dataPath="payload.content"
    totalPath="payload.totalElements"
  />
</template>
<script>
import {formatter, api} from './config.js'

const required = {
  1: '是',
  0: '否'
}

export default {
  name: 'AddAttribute',
  data() {
    return {
      url: api.attributes,
      columns: [
        {prop: 'name', label: '属性名称', minWidth: '90px'},
        {prop: 'description', label: '属性描述', minWidth: '120px'},
        {
          prop: 'editMode',
          label: '输入方式',
          minWidth: '120px',
          formatter: ({editMode}) => {
            return formatter.inputMethods[editMode]
          }
        },
        {
          prop: 'attributeValue',
          label: '属性值',
          minWidth: '120px',
          'show-overflow-tooltip': true,
          formatter: ({attributeValue}) => {
            if (!!attributeValue) {
              return attributeValue.reduce((str, it, i) => {
                let suffix = i === attributeValue.length - 1 ? '' : '，'
                return (str += it.value + suffix)
              }, '')
            }
          }
        }
      ],
      extraButtons: [
        {
          text: '选择',
          type: 'primary',
          show: row => !row.attributeList,
          atClick: (row, a) => {
            this.$emit('select', row)
          }
        }
      ]
    }
  }
}
</script>
