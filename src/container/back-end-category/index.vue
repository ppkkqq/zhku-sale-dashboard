<template>
  <el-cascader
    ref="cascader"
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    :options="options"
    :filterable="true"
    :show-all-levels="showAllLevels"
  ></el-cascader>
</template>

<script>
import {Cascader} from 'element-ui'
import {backendCatalogTree} from '@/const/api'

const getPathById = (cataid, catalog) => {
  let temppath = []
  try {
    const getNodePath = node => {
      temppath.push(node.id)
      if (node.id === cataid) {
        throw temppath
      }
      if (node.children && node.children.length > 0) {
        node.children.forEach(item => getNodePath(item))
      }
      temppath.pop()
    }
    catalog.forEach(item => getNodePath(item))
  } catch (e) {
    return temppath
  }
}

export default {
  name: 'back-end-category',
  props: {
    showAllLevels: {
      type: Boolean,
      default: false
    },
    catalogId: [Number, String]
  },
  components: {
    'el-cascader': Cascader
  },
  data() {
    return {
      options: [],
      value: []
    }
  },
  watch: {
    catalogId() {
      this.setValue()
    }
  },
  methods: {
    setValue() {
      this.value =
        (this.catalogId && getPathById(this.catalogId, this.catalog)) || []
    },
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
        .$get(backendCatalogTree)
        .then(resp => {
          this.loading = false
          this.options = (resp.payload && transfer(resp.payload)) || []
          this.catalog = resp.payload
          this.setValue()
        })
        .catch(e => {
          this.loading = false
        })
    },
    reset() {
      this.$refs.cascader.handlePick([], true)
    }
  },
  mounted() {
    this.getCategoryList()
  }
}
</script>
