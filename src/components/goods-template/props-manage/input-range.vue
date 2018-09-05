<template>
  <div class="input-range">
    <input-price
      v-model.number="minValue"
      @change="onMinChange"
      v-bind="$attrs"
    />
    <span>-</span>
    <input-price
      v-model.number="maxValue"
      @change="onMaxChange"
      v-bind="$attrs"
    />
  </div>
</template>
<script>
import InputPrice from './input-price'

export default {
  name: 'InputRange',
  props: {
    min: [Number, String],
    max: [Number, String]
  },
  data() {
    return {
      minValue: this.min,
      maxValue: this.max
    }
  },
  components: {
    InputPrice
  },
  methods: {
    onMinChange(value) {
      if (value > this.maxValue) {
        // this.minValue = this.maxValue
        this.maxValue = this.minValue
        this.$emit('update:max', this.maxValue)
      }
      this.$emit('update:min', this.minValue)
    },
    onMaxChange(value) {
      if (value < this.minValue) {
        this.maxValue = this.minValue
      }
      this.$emit('update:max', this.maxValue)
    }
  }
}
</script>
<style lang="stylus">
  .input-range {
    display flex
    align-items center
    > .el-input {
      flex-grow 1
    }
  }
</style>
