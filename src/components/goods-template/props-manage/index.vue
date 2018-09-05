<template>
  <div class="props-manage">
    <base-layout
      :title="title"
      :hasEdit="!isView"
      btn-text="以下属性不满足？点我添加自定义产品属性"
      @click="dialogVisible = true"
    >
      <el-table :data="propsData" maxHeight="500">
        <el-table-column
          v-for="col in propsColumns"
          :key="col.prop"
          v-bind="col">
          <template slot-scope="scope">
            <props-column-item
              v-model="scope.row[col.prop]"
              :isView="isView"
              :col="col"
              :row="scope.row"
              :skuPropCodes="skuPropCodes"
              @addColumn="addSkuCol"
              @removeColumn="delSkuCol"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="220" v-if="!isView">
          <template slot-scope="scope">
            <el-button size="mini" v-show="scope.$index !== 0" @click="sortRow(scope.$index, 'up')">上移</el-button>
            <el-button size="mini" v-show="scope.$index !== (propsData.length - 1)" @click="sortRow(scope.$index, 'down')">下移</el-button>
            <el-button size="mini" type="danger" @click="delRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>

    <base-layout
      v-if="(skusData.length > 0 || salesColumns.lenth > 0 || skuColumns.length > 0) && !isCombo"
      title="规格组合"
      :hasEdit="!isView"
      btn-text="添加规格"
      @click="addSkuRow"
    >
      <el-table :data="skusData">

        <el-table-column
          v-if="salesColumns.length > 0"
          v-for="(col, index) in salesColumns"
          :key="index"
          v-bind="col">
          <template slot-scope="scope">
            <sku-column-group
              :prop="col.prop"
              :default="skuGroupOptions[col.optionName] || []"
              :skuPropCodes="skuPropCodes"
              :row="scope.row"
              :isView="isView"
            />
          </template>
        </el-table-column>

        <el-table-column
          v-if="skuColumns.length > 0"
          v-for="(col, index) in skuColumns"
          :key="col.prop"
          v-bind="col">
          <template slot-scope="scope">
            <sku-column-item
              v-if="col.type !== 'price-range'"
              v-model="scope.row[col.prop]"
              :isView="isView"
              :type="col.type"
              :options="skuGroupOptions[col.optionName] || []"
            />
            <input-range
              v-else
              :disabled="isView"
              :min.sync="scope.row.minPrice"
              :max.sync="scope.row.maxPrice"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" v-if="!isView">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delSkuRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>

    <el-dialog title="选择属性" :visible.sync="dialogVisible">
      <add-attribute @select="addRow" />
    </el-dialog>
  </div>
</template>
<script>
import PropsColumnItem from './props-column-item'
import SkuColumnGroup from './sku-column-group'
import SkuColumnItem from './sku-column-item'
import InputRange from './input-range'
import AddAttribute from './add-attribute'
import BaseLayout from '../base-layout'

import {columns} from './config.js'

const COMBO = 'combo'
const GOODS = 'goods'

export default {
  name: 'PropsManage',
  props: {
    title: String,

    propsData: {
      type: Array,
      default: () => []
    },
    skusData: {
      type: Array,
      default: () => []
    },

    type: {
      type: String,
      required: true
    },
    isCombo: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      skuGroupOptions: {}, // 用于保存属性类型为销售属性的属性值

      skuPropCodes: {},

      salesColumns: [],

      dialogVisible: false
    }
  },
  computed: {
    skuColumns() {
      return columns.skuColumns[this.type] || {}
    },
    propsColumns() {
      if (this.isCombo) {
        return columns.fixedColumns[COMBO]
      }
      return columns.fixedColumns[GOODS]
    }
  },
  components: {
    PropsColumnItem,
    SkuColumnItem,
    SkuColumnGroup,
    InputRange,
    AddAttribute,
    BaseLayout
  },
  created() {
    this.updateSkuCol()
  },
  methods: {
    // 模板属性
    sortRow(index, type) {
      const row = this.propsData.splice(index, 1)[0]
      const newIndex = index + (type === 'up' ? -1 : 1)
      this.propsData.splice(newIndex, 0, row)
    },
    delRow(index, row) {
      this.$confirm('确定删除该属性吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.propsData.splice(index, 1)
        this.delSkuCol(row)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    addRow(row) {
      this.propsData.push({
        groupName: '自定义',
        initValue:
          (row.attributeValue &&
            row.attributeValue.map(attrValue => attrValue.value).join(',')) ||
          '',
        initCode:
          (row.attributeValue &&
            row.attributeValue.map(attrValue => attrValue.code).join(',')) ||
          '',
        editMode: row.editMode,
        propCode: row.code,
        propName: row.name,
        propValue: '',
        sort: null,
        type: 'base'
      })
      this.dialogVisible = false
    },

    // 规格组合行
    addSkuRow() {
      this.skusData.push({
        propNames: '',
        propValues: '',
        propCodes: '',
        guidePrice: null, // 指导价
        preferentialPrice: null, // 优惠价
        materialCode: '', // 物料编码
        packagePrice: null, // 套餐价
        minPrice: null, // 价格区间最小值
        maxPrice: null // 价格区间最大值
      })
    },
    delSkuRow(index, row) {
      this.$confirm('确定删除该属性吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.skusData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },

    // 规格组合列（销售属性）
    updateSkuCol() {
      this.propsData.forEach(item => {
        if (item.type === 'sale') {
          this.addSkuCol(item)
        }
      })
    },
    addSkuCol({groupName, propName, propValue, editMode, propCode}) {
      // 添加的是多选销售属性，添加到skuGroupOptions供规格组合使用
      // 预留名字，怕后期会修改支持同名
      // const optionName = `${groupName}-${propName}`
      const optionName = propName
      this.skuGroupOptions[optionName] =
        editMode === 'SELECT' ? propValue && propValue.split(',') : propValue
      this.skuPropCodes[optionName] = propCode

      this.salesColumns.push({
        label: propName,
        prop: propName,
        optionName: optionName
      })
    },
    delSkuCol({propName}) {
      const index = this.salesColumns.findIndex(item => item.prop === propName)
      if (index > -1) {
        this.clearSkuCol({propName})
        this.salesColumns.splice(index, 1)
      }
    },
    clearSkuCol({propName}) {
      // this.skuPropCodes[propName] = ''
      const skusData = this.skusData

      if (skusData.length < 1) {
        return
      }
      // this.skusData = this.skusData.map(item => {
      this.skusData.forEach(item => {
        if (!item.propNames) {
          item.propValues = ''
          item.propCodes = ''
          return
        }
        const index = item.propNames
          .split(',')
          .findIndex(name => name === propName)

        if (index > -1) {
          const propNames = item.propNames.split(',')
          const propValues = item.propValues.split(',')
          const propCodes = (item.propCodes && item.propCodes.split(',')) || []
          propNames.splice(index, 1)
          propValues.splice(index, 1)
          propCodes.splice(index, 1)

          item.propNames = propNames.join(',')
          item.propValues = propValues.join(',')
          item.propCodes = propCodes.join(',')
          return
        }
      })
    },

    getValue() {
      return {
        skus: this.skusData,
        itemAttributes: this.propsData.map((item, index) => {
          return {
            ...item,
            sort: index
          }
        })
      }
    },
    validate() {
      const itemAttributes = this.propsData
      const skus = this.skusData

      if (!itemAttributes || itemAttributes.length < 1) {
        this.$message.warning('请先添加属性！')
        return false
      }

      if (itemAttributes.some(item => !item.propValue)) {
        this.$message.warning('属性值不能为空!')
        return false
      }

      if (!this.isCombo && (!skus || skus.length < 1)) {
        this.$message.warning('规格组合必须有一项!')
        return false
      }

      if (
        !this.isCombo &&
        skus.some(item => {
          // 固定列值判断
          if (
            this.skuColumns.some(col => {
              if (col.prop === 'priceRange') {
                // 价格区间判断
                return item.maxPrice < 0 || item.minPrice < 0
              }
              return item[col.prop] === '' || item[col.prop] === null
            })
          ) {
            return true
          }

          // 销售属性判断
          if (this.salesColumns.length > 0) {
            const propValues = item.propValues
            if (!propValues) {
              return true
            }
            if (propValues.split(',').length !== this.salesColumns.length) {
              return true
            }
            return false
          }

          return false
        })
      ) {
        this.$message.warning('规格组合属性值不能为空!')
        return false
      }

      return true
    }
  }
}
</script>
