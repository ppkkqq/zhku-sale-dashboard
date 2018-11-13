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
    <base-layout title="审核信息" v-if="!isView">
      <el-form label-width="120px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditStatus">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="拒接原因" v-if="!auditStatus">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="rejectReason"></el-input>
        </el-form-item>
        <div class="text-right margin-top">
          <el-button @click="$router.back()">取消</el-button>
          <el-button type="primary" @click="onSubmit" v-loading="loading">提交</el-button>
        </div>
      </el-form>
    </base-layout>
  </div>
</template>

<script>
import goodsTemplate from '@/components/goods-template'
import {
  backendCatalogDetail,
  shopItems,
  getNeedCheckPcById,
  goodsAudit
} from '@/const/api'
import BaseLayout from '@/components/goods-template/base-layout'

export default {
  name: 'GoodsTemplateDetail',
  data() {
    return {
      loading: false,
      url: shopItems,
      templateDetail: {},
      auditStatus: false,
      rejectReason: '',

      // editStatus: this.$route.query.isEdit > 0 ? ' isEdit' : 'isNew',
      editStatus: 'isView', // 总部端只能查看
      title: '查看商品'
    }
  },
  components: {
    goodsTemplate,
    BaseLayout
  },
  computed: {
    isView() {
      return this.$route.query.isView > 0
    }
  },
  methods: {
    onSubmit() {
      let url = goodsAudit(this.$route.query.productId)
      this.$axios
        .$put(url, {
          agree: this.auditStatus,
          rejectReason: this.rejectReason
        })
        .then(result => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.$router.back()
        })
        .catch()
    }
  },
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

    this.$axios
      .$get(getNeedCheckPcById, {params: {id: this.$route.query.productId}})
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
