<template>
  <div>
    <el-tabs v-model="tabName" type="card" @tab-click="switchTab">
      <el-tab-pane label="选择属性" :name="tabChoose"></el-tab-pane>
      <el-tab-pane label="新建属性" :name="tabNew"></el-tab-pane>
    </el-tabs>
    <el-data-table
      v-if="tabName === tabChoose"
      ref="dataTable"
      :url="url"
      :columns="columns"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :extraButtons="extraButtons"
      :searchForm="searchForm"
      hasOperation
      hasPagination
      treeParentValue="name"
      dataPath="payload.content"
      totalPath="payload.totalElements"
    />
    <new-attribute v-else></new-attribute>
  </div>
</template>
<script>
import {formatter, api} from './config.js'
import {Object2Options} from '@/const/filter'
import {inputMethods} from '@/const/config'
import NewAttribute from './new-attribute'

const required = {
  1: '是',
  0: '否'
}

const tabChoose = 'choose'
const tabNew = 'new'
export default {
  name: 'AddAttribute',
  data() {
    return {
      url: api.attributes,
      searchForm: [
        {
          $type: 'input',
          $id: 'name',
          label: '属性名称',
          $el: {placeholder: '请输入'}
        },
        {
          $type: 'select',
          $id: 'editMode',
          label: '输入方式',
          $el: {placeholder: '请选择'},
          $options: Object2Options(inputMethods)
        }
      ],
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
          formatter: ({editMode, attributeValue}) => {
            if (editMode === 'INPUT') {
              return
            }
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
      ],
      tabName: tabChoose,
      tabChoose: tabChoose,
      tabNew: tabNew
    }
  },

  methods: {
    switchTab(tab) {
      this.tabName = tab.name
    }
  },
  components: {
    NewAttribute
  }
}
</script>
