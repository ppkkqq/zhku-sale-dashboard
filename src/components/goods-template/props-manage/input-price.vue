<template>
  <el-input
    placeholder="请输入"
    type="number"
    v-model.number="price"
    v-bind="$attrs"
    @change="onChange"
    min="0"
  />
</template>
<script>
const convert = val => {
  let num = Number(val)
  if (val === null) {
    return null
  }
  if (num === 0 || isNaN(num)) {
    return 0
  }
  if (num < 0) {
    num = -num
  }
  return num.toFixed(2)
}

export default {
  name: 'InputPrice',
  props: {
    value: [Number, String]
  },
  data() {
    return {
      price: convert(this.value)
    }
  },
  watch: {
    value() {
      this.price = convert(this.value)
    }
  },
  methods: {
    onChange(val) {
      const price = convert(val) || 0
      this.price = price
      this.$emit('input', price)
      this.$emit('change', price)
    }
  }
}
</script>
