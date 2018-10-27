<template>
  <div class="sku-column-item">
    <el-select
      v-if="formType === 'select'"
      placeholder="请选择"
      v-model="propValue"
      :disabled="disabled">
      <el-option
        v-for="(value, index) in options"
        :key="value.value || value"
        :label="value.label || value"
        :value="value.value || value">
      </el-option>
    </el-select>
    <input-range
      v-else-if="formType === 'range'"
      v-model="propValue"
      :disabled="disabled"
    />
    <!-- todo: 优化 -->
    <el-input
      v-else-if="formType === 'input' && inputType === 'string'"
      placeholder="请输入内容"
      v-model.trim="propValue"
      @focus="handleClick"
      :readonly="isReadonly"
      :disabled="disabled"
    />
    <input-price
      v-else-if="formType === 'input' && inputType === 'price'"
      v-model.number="propValue"
      :disabled="disabled"
    />
    <el-input
      v-else-if="formType === 'input' && inputType === 'number'"
      placeholder="请输入"
      v-model.number="propValue"
      :disabled="disabled"
      :readonly="isReadonly"
      type="number"
      min="0"
    />
    <!-- <span>{{ propValue }}</span> -->

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="70%" @open="handleOpen">
      <el-data-table ref="dataTable" v-bind="dataTableConfig" @update="handleUpdate" />
    </el-dialog>
  </div>
</template>
<script>
import InputRange from './input-range'
import InputPrice from './input-price'
import {columnItemConfig, api} from './config.js'
import Bus from '../event-bus.js'

const dialogTitles = {
  interiorExterior: ''
}

const DIALOG = 'dialog'
const FIXED = 'fixed'

// key/value格式数据修改
const setRow = (row, prop, newVal) => {
  const index = row.key && row.key.indexOf(prop)
  if (index > -1) {
    row.value && row.value.splice(index, 1, newVal)
  } else {
    row.key && row.key.push(prop)
    row.value && row.value.push(newVal)
  }
}

export default {
  name: 'SkuColumnItem',
  props: {
    compType: String,
    value: [String, Number],
    options: [Array, String],
    row: Object,
    prop: String,
    type: String,
    disabled: {
      type: Boolean,
      default: false
    },
    customQuery: Object
  },
  data() {
    return {
      dialogVisible: false,
      dataTableConfig: {}
    }
  },
  computed: {
    isReadonly() {
      return this.isType(DIALOG) || this.isType('readOnly')
    },
    inputType() {
      if (this.isType('price')) {
        return 'price'
      }
      // 考虑统一判断规格
      // 希望有number类型的表单直接使用
      if (this.type === 'number') {
        return 'number'
      }
      return 'string'
    },
    formType() {
      if (this.options && Array.isArray(this.options)) {
        return 'select'
      }
      return 'input'
    },
    propValue: {
      get() {
        if (this.isType(FIXED)) {
          const index = this.row.key && this.row.key.indexOf(this.prop)
          if (index > -1) {
            return this.row.value && this.row.value[index]
          }
          return ''
        }
        return this.value
      },
      set(newVal) {
        if (newVal === this.value) {
          return
        }
        if (this.isType(FIXED)) {
          setRow(this.row, this.prop, newVal)
          return
        }
        this.$emit('input', newVal)
      }
    },
    dialogTitle() {
      return dialogTitles[this.prop] || ''
    }
  },
  created() {
    if (!this.isType(DIALOG)) {
      return
    }
  },
  components: {
    InputRange,
    InputPrice
  },
  watch: {},
  methods: {
    // 暂时不处理空格
    isType(type) {
      return this.type && this.type.split(',').indexOf(type) > -1
    },
    handleClick() {
      if (this.isType(DIALOG)) {
        this.dialogVisible = true
      }
    },
    select(row) {
      if (this.isType(FIXED) && this.isType(DIALOG)) {
        this.propValue = row.code
      }
      this.dialogVisible = false
    },
    handleOpen() {
      if (this.tempType === this.compType) {
        return
      }
      this.tempType = this.compType
    },
    handleUpdate(data) {}
  }
}
</script>
<style lang="stylus">
  .sku-column-item {
    .el-input {
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
         -webkit-appearance: none !important;
         margin: 0
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
    }
  }
</style>
