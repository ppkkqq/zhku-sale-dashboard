<template>
  <div :class="pageName">
    <go-back></go-back>
    <el-form ref="form" :model="form" label-width="100px" :disabled="isView">
      <el-form-item label="活动类型">限时抢购
        <el-select v-model="form.name"></el-select>，预售
        <el-select v-model="form.name"></el-select>
      </el-form-item>
      <el-form-item label="活动标题">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动标题">{{form.name}}</el-form-item>
      <el-form-item label="活动链接地址">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="推广平台">
        <el-checkbox-group v-model="form.name">
          <el-checkbox label="APP"></el-checkbox>
          <el-checkbox label="PC网页"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="活动展示图片">
        <viewer :src="form.photoUrl"/>
      </el-form-item>
      <el-form-item label="活动描述">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="活动优先级">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="禁用启用">
        <el-radio-group v-model="form.name">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <card-table header="活动数据统计">
      <table-info :table="deliveryInfoTable"></table-info>
    </card-table>
  </div>
</template>

<script>
import {} from '@/const/config'
import {columns, searchForm} from '@/const/marketing'
import {} from '@/const/api'
import {} from '@/const/path'
import Viewer from 'viewer'
import GoBack from '@/components/GoBack'
import CardTable from '@/components/card-table'
import TableInfo from '@/components/table-info'
import {formatDate, Object2Options, toOptionsLabel, price} from '@/const/filter'

export default {
  name: 'activity-detail',
  components: {
    Viewer,
    'go-back': GoBack,
    CardTable,
    TableInfo
  },
  data() {
    return {
      pageName: 'activity-detail',

      form: {
        name: '',
        photoUrl:
          'https://tse3.mm.bing.net/th?id=OIP.bJTVUv9Z3A68Eq-uYZAUWQHaEK&pid=Api&w=660&h=371&rs=1&p=0',
        description: ''
      }
    }
  },
  computed: {
    isView() {
      return this.$route.query.isView > 0
    },
    deliveryInfoTable() {
      //订单信息
      // const {
      //   orderCode,
      //   itemMoney,
      //   source, // 0 我买网 1自营
      //   orderDateStr,
      //   status,
      //   payDateStr,
      //   user,
      //   remark
      // } = this.detail
      const data = {
        订单编号: 'orderCode',
        订单总金额: 'price(itemMoney)',
        商品来源: 'itemSource[source]',
        下单时间: 'orderDateStr',
        支付状态: 'status',
        支付时间: 'payDateStr',
        下单账号: 'user',
        下单备注: 'remark'
      }
      return Object2Options(data, 'value')
    }
    // rules() {
    //   let rules = {
    //     approve: [
    //       {
    //         required: true,
    //         message: '请输入审核结果',
    //         trigger: 'change'
    //       }
    //     ]
    //     // rejectRemark: [
    //     //   {
    //     //     required: this.reviewForm.approve !== 'true',
    //     //     message: '请输入备注信息'
    //     //   }
    //     // ]
    //   }
    //   return rules
    // }
  },
  methods: {},
  mounted() {}
}
</script>
<style lang="stylus">
.activity-detail {
  .el-date-editor {
    width: 100%
  }

  .el-range-separator {
    width: 20px
  }

  .el-form {
    width: 800px
  }
}
</style>
