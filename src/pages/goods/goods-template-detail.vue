<template>
  <div>
    <goods-template
      v-loading="loading"
      :url="url"
      :title="title"
      :editStatus="editStatus"
      :content="templateDetail"
    />
  </div>
</template>
<script>
import goodsTemplate from '@/components/goods-template'
import {adminTemplateList} from '@/const/api'
export default {
  name: 'GoodsTemplateDetail',
  data() {
    return {
      loading: false,

      url: adminTemplateList,
      templateDetail: {},
      editStatus: this.$route.query.isEdit > 0 ? 'isEdit' : 'isNew',
      title: '编辑商品模板'
    }
  },
  components: {
    goodsTemplate
  },
  created() {
    if (this.$route.query.isView > 0) {
      this.editStatus = 'isView'
      this.title = '商品详情'
    }
    if (this.editStatus === 'isNew') {
      this.title = '新增商品模板'
      return
    }
    this.loading = true

    this.$axios
      .$get(`${adminTemplateList}/${this.$route.query.templateId}`)
      .then(resp => {
        this.loading = false
        this.templateDetail = resp.payload
      })
      .catch(e => {
        this.loading = false
      })
  }
}
</script>
