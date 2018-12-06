<template>
  <div>
    <goods-template
      v-loading="loading"
      :url="url"
      :title="title"
      :editStatus="editStatus"
      :content="templateDetail"
      :isTemp="false"
      templateId="ITEM"
    />
  </div>
</template>
<script>
import goodsTemplate from '@/components/goods-template'
import {backendCatalogDetail, shopItems, goodsListsFromSkuId} from '@/const/api'

export default {
  name: 'GoodsTemplateDetail',
  data() {
    return {
      loading: false,

      url: shopItems,
      templateDetail: {},
      // editStatus: this.$route.query.isEdit > 0 ? ' isEdit' : 'isNew',
      editStatus: 'isView', // 总部端只能查看
      title: '查看商品'
    }
  },
  components: {
    goodsTemplate
  },
  methods: {},
  created() {
    // if (this.$route.query.isView > 0) {
    //   this.title = '查看商品'
    //   this.editStatus = 'isView'
    // }

    // if (this.editStatus === 'isNew') {
    //   this.title = '新增商品'
    //   return
    // }

    this.loading = true

    let promise
    if (this.$route.query.skuId) {
      promise = this.$axios.$get(goodsListsFromSkuId, {
        params: {skuId: this.$route.query.skuId}
      })
    } else {
      promise = this.$axios.$get(`${shopItems}/${this.$route.query.productId}`)
    }
    promise
      .then(resp => {
        this.templateDetail = resp.payload
        this.loading = false
      })
      .catch(e => {
        this.loading = false
      })
  }
}
</script>
