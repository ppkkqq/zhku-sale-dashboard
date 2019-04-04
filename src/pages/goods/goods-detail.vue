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
import {
  backendCatalogDetail,
  shopItems,
  goodsListsFromSkuId,
  getDetailById
} from '@/const/api'

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

    let promise = this.$axios.$get(
      `${getDetailById}?id=${this.$route.query.goodid}`
    )
    promise
      .then(resp => {
        this.templateDetail = resp
        this.loading = false
      })
      .catch(e => {
        this.loading = false
      })
  }
}
</script>
