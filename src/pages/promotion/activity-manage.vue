<template>
  <div :class="pageName">
    <el-data-table
      ref="dataTable"
      :url="url"
      :columns="columns"
      :hasNew="true"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="true"
      :isTree="false"
      :hasPagination="true"
      data-path="payload.list"
      totalPath="payload.total"
      :searchForm="searchForm"
      :operationAttrs="operationAttrs"
      :extraButtons="extraButtons"
      :customQuery="customQuery"
      @reset="handleReset"
      :onNew="onNew"
    >
      <template slot="search">
        <el-form-item label="活动时间">
          <el-date-picker
            @change="setTime"
            value-format="yyyy-MM-dd"
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="活动开始日期"
            end-placeholder="活动结束日期"
          ></el-date-picker>
        </el-form-item>
      </template>
    </el-data-table>
    <!-- <el-dialog
      title="审核退款"
      :visible.sync="dialogVisible"
      class="verify-dialog"
      :before-close="beforeClose"
    >
      <el-form ref="comboForm" :model="reviewForm" label-width="120px" :rules="rules">
        <el-form-item label="申请单号">{{dialogRow.id}}</el-form-item>
        <el-form-item label="会员账号">{{dialogRow.memberName}}</el-form-item>
        <el-form-item label="审核" prop="approve">
          <el-radio-group v-model="reviewForm.approve">
            <el-radio label="true">通过</el-radio>
            <el-radio label="false">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          v-loading="loading"
          @click="handleAuditConfirm"
          :disabled="loading"
        >确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- <el-dialog
      :title="dialogType==RECEIVING? '确认收货': '退款确认'"
      :visible.sync="confirmDialogVisible"
      class="verify-dialog"
      :before-close="beforeClose"
    >
      <el-form label-width="120px" v-if="dialogType==RECEIVING">
        <el-form-item label="申请单号">{{dialogRow.id}}</el-form-item>
        <el-form-item label="会员账号">{{dialogRow.memberName}}</el-form-item>
      </el-form>
      <p
        v-if="dialogType==REFUND"
        style="text-align:center"
      >确定对会员{{dialogRow.memberName}}进行{{dialogRow.refundMoney}}元退款吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="confirmDialogVisible = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          v-loading="loading"
          :disabled="loading"
          @click="handleConfirm"
        >确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {} from '@/const/config'
import {columns, searchForm} from '@/const/marketing'
import {activityList} from '@/const/api'
import {} from '@/const/path'

export default {
  name: 'activity-manage',
  components: {},
  data() {
    return {
      pageName: 'activity-manage',
      url: activityList, //aftList + `?shopId=${this.$store.state.shopId}`,
      dateRange: '',
      customQuery: {
        startDate: '',
        endDate: ''
      },
      operationAttrs: {
        width: 380,
        fixed: 'right'
      },
      loading: false,
      dialogVisible: false,
      confirmDialogVisible: false,
      dialogType: '',
      reviewForm: {
        approve: 'true',
        rejectRemark: ''
      },
      columns,
      extraButtons: [
        {
          text: '详情',
          type: 'primary',
          atClick: this.go2Detail
        }
        //     {
        //       text: '退款确认',
        //       type: '',
        //       show: row => {
        //         // 退款
        //         if (row.refundTypeCode == 1) return row.status === '退款中'
        //         // 退货退款
        //       },
        //       atClick: row => this.confirmDialog(row, REFUND)
        //     },
        //     {
        //       text: '确认收货',
        //       type: '',
        //       show: row => row.refundTypeCode != '1',
        //       atClick: row => this.confirmDialog(row, RECEIVING)
        //     },
        //     {
        //       text: '审核',
        //       show: row => {
        //         // 退款
        //         if (row.refundTypeCode == 1)
        //           return row.status === '审核中' || row.status === 'WAIT_AUDIT'
        //         // 退货退款
        //       },
        //       atClick: row => this.confirmDialog(row, AUDIT)
        //     },
        //     {
        //       text: '取消',
        //       type: 'danger',
        //       show: row => {
        //         // 退款
        //         if (row.refundTypeCode == 1)
        //           return (
        //             row.status === '审核中' ||
        //             row.status === '待发货' ||
        //             row.status === '待收货'
        //           )
        //         // 退货退款
        //       },
        //       atClick: row => {
        //         this.dialogType = CANCEL
        //         this.handleConfirm(row)
        //       }
        //     }
      ],
      searchForm,
      dialogRow: {}
    }
  },
  computed: {
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
  methods: {
    onNew() {
      this.$router.push('/promotion/activity-publish')
    },
    handleReset() {
      this.customQuery.startDate = ''
      this.customQuery.endDate = ''
      this.dateRange = []
    },
    setTime() {
      this.customQuery.startDate = this.dateRange[0]
      this.customQuery.endDate = this.dateRange[1]
    }
    // confirmDialog(row, type) {
    //   this.dialogRow = row
    //   this.dialogType = type
    //   switch (type) {
    //     case AUDIT:
    //       this.dialogVisible = true
    //       break
    //     case RECEIVING:
    //       this.confirmDialogVisible = true
    //       break
    //     case REFUND:
    //       this.confirmDialogVisible = true
    //       break
    //   }
    // },
    // go2Detail(row) {
    //   //查看
    //   this.$router.push(`${aftDetail}?refundId=${row.id}`)
    // },
    // go2Review(row) {},
    // handleAuditConfirm() {
    //   this.$refs.comboForm.validate(valid => {
    //     if (valid) {
    //       this.submit()
    //     } else {
    //       return false
    //     }
    //   })
    // },
    // handleConfirm(row) {
    //   let promise, url
    //   switch (this.dialogType) {
    //     case RECEIVING:
    //       url = `${confirmReceive}?id=${this.dialogRow.id}`
    //       break
    //     case REFUND:
    //       url = `${confirmRefund}?id=${this.dialogRow.id}`
    //       break
    //     case CANCEL:
    //       url = `${channelCancel}?id=${row.id}`
    //       break
    //   }
    //   this.loading = true
    //   this.$axios
    //     .$post(url)
    //     .then(res => {
    //       this.confirmDialogVisible = false
    //       this.loading = false
    //       this.$message({
    //         type: 'success',
    //         message: '操作成功'
    //       })
    //       this.$refs.dataTable.getList()
    //     })
    //     .catch(err => {
    //       this.loading = false
    //       this.confirmDialogVisible = false
    //     })
    // },
    // submit() {
    //   let data = {
    //     id: this.dialogRow.id,
    //     ...this.reviewForm
    //   }
    //   this.$axios
    //     .$post(aftAudit, data)
    //     .then(resp => {
    //       this.beforeClose()
    //       this.$refs.dataTable.getList()
    //     })
    //     .catch(err => {
    //       this.beforeClose()
    //     })
    // },
    // beforeClose(done) {
    //   this.$refs.comboForm.resetFields()
    //   done ? done() : (this.dialogVisible = false)
    // }
  }
}
</script>
