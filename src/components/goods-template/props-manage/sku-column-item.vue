<template>
  <!-- todo 处理价格 -->
  <div>
    <el-select
      v-if="compType === 'select'"
      placeholder="请选择"
      v-model="propValue"
      :disabled="isView">
      <el-option
        v-for="(value, index) in options"
        :key="value"
        :label="value"
        :value="value">
      </el-option>
    </el-select>
    <input-range
      v-else-if="compType === 'range'"
      v-model="propValue"
      :disabled="isView"
    />
    <!-- todo: 优化 -->
    <el-input
      v-else-if="compType === 'input' && inputType === 'string'"
      placeholder="请输入内容"
      v-model.trim="propValue"
      :disabled="isView"
    />
    <input-price
      v-else="compType === 'input' && inputType === 'number'"
      v-model.number="propValue"
      :disabled="isView"
    />
  </div>
</template>
<script>
import InputRange from './input-range'
import InputPrice from './input-price'

export default {
  name: 'SkuColumnItem',
  props: {
    value: [String, Number],
    options: Array,
    type: String,
    isView: Boolean
  },
  computed: {
    inputType() {
      if (this.type === 'price') {
        return 'number'
      }
      return 'string'
    },
    compType() {
      if (this.options.length > 0) {
        return 'select'
      } else if (
        typeof this.value === 'string' &&
        this.value.indexOf('-') > -1
      ) {
        return 'range'
      }
      return 'input'
    },
    propValue: {
      get() {
        return this.value
      },
      set(newVal) {
        if (newVal === this.value) {
          return
        }
        this.$emit('input', newVal)
      }
    }
  },
  components: {
    InputRange,
    InputPrice
  }
}
</script>
