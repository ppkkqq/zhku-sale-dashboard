<template>
  <el-select
    ref="store"
    v-model="value"
    v-on="$listeners"
    v-bind="$attrs"
    :loading="isLoading"
    :filterable="filterable"
    placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import {shopList} from '@/const/api'
export default {
  name: 'store-select',
  props: {
    filterable: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: false,
      value: '',
      options: []
    }
  },
  methods: {
    getStoreList() {
      if (this.isLoading) return //loading中，不再请求
      this.isLoading = true

      const transfer = (data = []) => {
        return data.map(it => {
          return {
            label: it.name,
            value: it.id
          }
        })
      }

      this.$axios
        .$get(`${shopList}?size=999`)
        .then(resp => {
          this.isLoading = false
          this.options =
            (resp.payload &&
              resp.payload.content &&
              transfer(resp.payload.content)) ||
            []
        })
        .catch(e => {
          this.isLoading = false
        })
    }
  },
  created() {
    this.getStoreList()
  }
}
</script>
