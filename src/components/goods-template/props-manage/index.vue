<template>
  <div class="props-manage">
    <base-layout
      :title="title"
      :hasEdit="!isView"
      btn-text="添加属性"
      @click="addBasicAttr"
    >

      <el-table :data="propsData" maxHeight="500">
        <el-table-column
          v-for="col in propsColumns"
          :key="col.prop"
          minWidth="130px"
          v-bind="col">
          <template slot-scope="scope">
            <props-column-item
              v-model="scope.row[col.prop]"
              :isView="isView"
              :col="col"
              :row="scope.row"
              :skuPropCodes="skuPropCodes"
              :skuGroupOptions="skuGroupOptions"
              @addColumn="addSkuCol"
              @removeColumn="delSkuCol"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="220" v-if="!isView">
          <template slot-scope="scope">
            <!--<el-button size="mini" v-show="scope.$index !== 0" @click="sortRow(scope.$index, 'up')">上移</el-button>-->
            <!--<el-button size="mini" v-show="scope.$index !== (propsData.length - 1)" @click="sortRow(scope.$index, 'down')">下移</el-button>-->
            <el-button size="mini" type="danger" @click="delRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>

    <base-layout
      title="规格属性"
      :hasEdit="!isView"
      btn-text="添加规格"
      @click="addSkuRow"
      v-loading="skuLoading"
    >
      <el-table :data="skusData">

        <!-- 规格属性列 -->
        <!-- key 不能使用index，切换规格属性会造成prop没更新 -->
        <el-table-column
          v-if="salesColumns.length > 0"
          v-for="(col, index) in salesColumns"
          :key="col.prop"
          minWidth="130px"
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

        <!-- 固定销售列 -->
        <el-table-column
          v-if="skuFixedColumns.length > 0"
          v-for="(col, index) in skuFixedColumns"
          :key="col.prop"
          minWidth="130px"
          v-bind="col">
          <template slot-scope="scope">
            <sku-column-item
              v-model="scope.row[col.prop]"
              :compType="type"
              :row="scope.row"
              :prop="col.prop"
              :disabled="isView || col.disabled"
              :type="col.type"
              :customQuery="customQuery"
            />
          </template>
        </el-table-column>

        <!-- 固定列 -->
        <el-table-column
          v-if="skuColumns.length > 0"
          v-for="(col, index) in skuColumns"
          :key="col.prop"
          minWidth="130px"
          v-bind="col">
          <template slot-scope="scope">
            <sku-column-item
              v-model="scope.row[col.prop]"
              :compType="type"
              :row="scope.row"
              :prop="col.prop"
              :disabled="isView || col.disabled"
              :type="col.type"
              :customQuery="customQuery"
              :options="skuGroupOptions[col.optionName] || col.option"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" v-if="!isView">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delSkuRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </base-layout>

    <el-dialog title="选择属性" :visible.sync="dialogVisible" width="70%">
      <add-attribute @select="addRow" />
    </el-dialog>
  </div>
</template>
<script>
import {checkSkuReference} from '@/const/api'

import Bus from '../event-bus.js'
import PropsColumnItem from './props-column-item'
import SkuColumnGroup from './sku-column-group'
import SkuColumnItem from './sku-column-item'
import InputRange from './input-range'
import BaseLayout from '../base-layout'
import FormRenderer from '@/components/el-form-renderer/index.js'
import AddAttribute from './add-attribute'

import {columns} from './config.js'
import uniq from 'lodash/uniq'

const GOODS = 'GOODS'
const SALE = 'sale'
const BASIC = 'basic'
const isRequired = 1

// 能够上架卖的类型
const hasSaleProps = ['GOODS']

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
    const formatPropName = (cell, value, callback) => {
      value = value ? value.trim() : value
      if (!value) {
        callback('属性名不能为空')
      } else {
        callback()
      }
    }
    return {
      skuGroupOptions: {}, // 用于保存属性类型为规格属性的属性值

      skuPropCodes: {},

      salesColumns: [],

      customQuery: {},

      skuLoading: false,

      attrType: SALE,

      // 添加属性弹窗
      dialogVisible: false
    }
  },
  computed: {
    skuColumns() {
      return columns.skuColumns[this.type] || []
    },
    skuFixedColumns() {
      return columns.skuFixedColumns[this.type] || []
    },
    propsColumns() {
      return columns.fixedColumns[GOODS]
    },
    shopCode() {
      return this.$store.state.shopCode
    }
  },
  watch: {
    dialogVisible: function(val) {}
  },
  components: {
    PropsColumnItem,
    SkuColumnItem,
    SkuColumnGroup,
    InputRange,
    BaseLayout,
    FormRenderer,
    AddAttribute
  },
  created() {
    this.updateSkuCol()

    Bus.$on('modelChange', this.handleModelChange)
  },
  beforeDestroy() {
    Bus.$off('modelChange', this.handleModelChange)
  },
  methods: {
    // 基础属性
    addBasicAttr() {
      this.attrType = BASIC
      this.dialogVisible = true
    },

    handleModelChange(model) {
      if (model === this.customQuery.modelCode) {
        return
      }
      this.customQuery = {
        modelCode: model
      }
    },

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
        if (row.attrType === SALE) {
          this.skuPropCodes[row.propName] = ''
          this.delSkuCol(row)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    addRow(row) {
      this.propsData.push({
        // require: row.require,
        // groupName: '自定义',
        // sort: null,
        editMode: row.editMode,
        initValue:
          (row.attributeValue &&
            row.attributeValue.map(attrValue => attrValue.value).join(',')) ||
          '',
        // initCode:
        //   (row.attributeValue &&
        //     row.attributeValue.map(attrValue => attrValue.code).join(',')) ||
        //   '',
        propValue: '',
        // propCode: row.code,
        propName: row.name,
        attrType: 'base'
      })
      this.dialogVisible = false
    },

    // 规格组合行
    addSkuRow() {
      this.attrType = SALE
      // this.dialogVisible = true
      this.skusData.push({
        // key: [],
        // value: [],
        propNames: '',
        propValues: ''
        // propCodes: ''
      })
    },
    delSkuRow(index, row) {
      this.$confirm('确定删除该属性吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const del = () => {
          this.skusData.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        del()
      })
    },

    // 规格组合列（规格属性）
    updateSkuCol() {
      this.propsData.forEach(item => {
        if (item.attrType === SALE) {
          this.addSkuCol(item, false)
        }
      })
    },
    addSkuCol(
      {groupName, propName, propValue, editMode, propCode},
      isReverse = true
    ) {
      // 添加的是多选规格属性，添加到skuGroupOptions供规格组合使用
      // 预留名字，怕后期会修改支持同名
      // const optionName = `${groupName}-${propName}`
      const optionName = propName

      // this.skuGroupOptions[optionName] =
      // editMode === 'SELECT' ? propValue && propValue.split(',') : propValue
      // 响应式更新，为了属性改变，规格组合跟着变
      this.$set(
        this.skuGroupOptions,
        optionName,
        editMode === 'SELECT' ? propValue && propValue.split(',') : propValue
      )

      // this.$set(this.skuPropCodes, optionName, propCode)
      // this.skuPropCodes[optionName] = propCode

      const column = {
        label: propName,
        prop: propName,
        optionName: optionName
      }

      // 排序需要顺序插入
      isReverse
        ? this.salesColumns.unshift(column)
        : this.salesColumns.push(column)
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
          // item.propCodes = ''
          return
        }
        const index = item.propNames
          .split(',')
          .findIndex(name => name === propName)

        if (index > -1) {
          const propNames = item.propNames.split(',')
          const propValues = item.propValues.split(',')
          // const propCodes = (item.propCodes && item.propCodes.split(',')) || []
          propNames.splice(index, 1)
          propValues.splice(index, 1)
          // propCodes.splice(index, 1)

          item.propNames = propNames.join(',')
          item.propValues = propValues.join(',')
          // item.propCodes = propCodes.join(',')
          return
        }
      })
    },

    clear() {
      this.salesColumns = []
      this.skuGroupOptions = {}
      this.skuPropCodes = {}
    },
    getValue() {
      return {
        skuDtos: this.skusData.map((item, index) => {
          return {
            ...item,
            shopCode: this.shopCode
            // sort: index
          }
        }),
        attributes: this.propsData.map((item, index) => {
          return {
            ...item
            // sort: index
          }
        })
      }
    },
    validate() {
      const attributes = this.propsData
      const skus = this.skusData
      const isSaleStatus = hasSaleProps.indexOf(this.type) > -1

      if (
        attributes.some(item => item.require === isRequired && !item.propValue)
      ) {
        this.$message.warning('必填属性不能为空!')
        return false
      }

      // 可以上架商品验证
      if (isSaleStatus) {
        if (!attributes || attributes.length < 1) {
          this.$message.warning('请先添加属性！')
          return false
        }

        // 上架商品必须有规格属性
        if (this.salesColumns.length < 1) {
          this.$message.warning('至少有一个规格属性!')
          return false
        }
      }

      if (!skus || skus.length < 1) {
        this.$message.warning('规格组合必须有一项!')
        return false
      }

      if (
        skus.some(item => {
          // 固定列值判断
          if (
            this.skuColumns.length > 0 &&
            this.skuColumns.some(col => {
              return item[col.prop] === null || item[col.prop] === ''
            })
          ) {
            return true
          }

          // 固定销售列判断
          // todo 确认是否需要
          // if (this.skuFixedColumns.length > 0) {
          //   if (
          //     !item.value ||
          //     this.skuFixedColumns.length !== item.value.length ||
          //     item.value.some(val => val === null || val === '')
          //   ) {
          //     return true
          //   }
          // }

          // 规格属性判断
          if (this.salesColumns.length > 0) {
            const propValues = item.propValues
            if (!propValues) {
              return true
            }
            if (
              propValues.split(',').filter(v => v !== '').length !==
              this.salesColumns.length
            ) {
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

      if (this.salesColumns.length > 0) {
        // 属性值的添加顺序不同，会造成出错，先排序
        const values = this.skusData.map(
          item =>
            item.propValues &&
            item.propValues
              .split(',')
              .sort()
              .join(',')
        )
        const filterValues = uniq(values)

        // 去重后length相等，表示有重复的sku
        if (filterValues.length !== values.length) {
          this.$message.warning('请勿添加规格属性值完全相同的规格组合！')
          return false
        }
      }

      return true
    },

    // 添加属性弹窗
    saveAttribute() {
      this.$refs.formRender.validate(valid => {
        if (valid) {
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>
