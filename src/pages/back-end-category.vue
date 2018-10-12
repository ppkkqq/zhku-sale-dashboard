<template>
    <div class="back-end-category">
    </div>
</template>

<script>
// import ElCrudTree from '@/container/el-crud-tree'
// import UploadToAli from 'upload-to-ali'
// import {
//   frontendCatalogBaseUrl,
//   backendCatalogBaseUrl,
//   bindBackendUrl,
//   selectedFilterCondition,
//   AllfilterCondition
// } from '@/const/api'
// import BindBackendCategory from '@/components/category/bind-backend-category'
// import BindAttributeFilter from '@/components/category/bind-attribute-filter'

export default {
  name: 'back-end-category',
  components: {
    // ElCrudTree,
    // UploadToAli,
    // BindBackendCategory,
    // BindAttributeFilter
  },
  data() {
    return {
      pageName: 'back-end-category',
      backendTree: {}
    }
  },
  methods: {
    loadBackendTree() {
      this.$axios
        .$get('/mall-deepexi-product-center/api/v1/prdCatalogs/tree')
        .then(res => {
          this.backendTree = res.payload
          console.log(this.backendTree)
        })
        .catch(err => {
          this.$message({
            type: 'fail',
            message: '获取后台类目失败'
          })
          // this.$message.fail('获取后台类目失败')
        })
    }
  },
  computed: {},
  mounted() {
    this.loadBackendTree()
  }
}
</script>

<style lang="stylus">
  .back-end-category{

  }
</style>
