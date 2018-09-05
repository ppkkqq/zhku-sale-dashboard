<template>
    <el-cascader
      ref="cascader"
      v-bind="$attrs"
      v-on="$listeners"
      :options="options"
      :filterable="true"
      :show-all-levels="false"
    ></el-cascader>
</template>

<script>
import {Cascader} from 'element-ui'
import {prdCatalogs} from '@/const/api'
export default {
  name: 'cascader-base-category',
  props: {},
  components: {
    'el-cascader': Cascader
  },
  data() {
    return {
      options: []
    }
  },
  methods: {
    getCategoryList() {
      if (this.loading) return //loading中，不再请求
      this.loading = true

      const transfer = (data = []) => {
        return data.map(it => {
          return {
            label: it.name,
            value: it.id,
            children:
              it.children && it.children.length ? transfer(it.children) : null
          }
        })
      }

      this.$axios
        .$get(prdCatalogs)
        .then(resp => {
          this.loading = false
          this.options = resp.payload && transfer(resp.payload)
        })
        .catch(e => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.getCategoryList()
  }
}
</script>
