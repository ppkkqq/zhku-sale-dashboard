<template>
  <el-input
    placeholder="请输入"
    type="number"
    :value="price"
    v-bind="$attrs"
    @blur="handleBlur"
    @change="onChange"
    @input="onInput"
    min="0"
  />
</template>
<script>
export default {
  name: 'InputPrice',
  props: {
    value: [Number, String]
  },
  data() {
    return {
      price: this.convert(this.value)
    }
  },
  watch: {
    value(val) {
      this.price = val
    }
  },
  methods: {
    onInput(val) {
      if (val < 0) {
        val = -val
      }
      this.price = val
      this.$emit('input', val)
    },
    handleBlur() {
      this.emitChange(this.price)
    },
    onChange(val) {
      this.emitChange(val)
    },
    emitChange(val) {
      const price = this.convert(val)
      this.price = price
      this.$emit('input', price)
      this.$emit('change', price)
    },
    convert(val) {
      let num = Number(val)
      if (val === null || isNaN(num)) {
        return null
      }
      if (num === 0) {
        return 0
      }
      if (num < 0) {
        num = -num
      }
      return num.toFixed(2)
    }
  }
}
</script>
