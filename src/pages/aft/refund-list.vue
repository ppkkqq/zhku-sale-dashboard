<template>
  <div :class="pageName">
    <el-data-table ref="dataTable"
                   :url="url"
                   :columns="columns"
                   :hasNew="false"
                   :hasEdit="false"
                   :hasDelete="false"
                   :hasOperation="true"
                   :isTree="false"
                   :hasPagination="true"
                   :extraButtons="extraButtons"
                   :operationAttrs="operationAttrs"
                   dataPath="payload.list"
                   totalPath="payload.total"
                   :searchForm="searchForm">
    </el-data-table>
    <el-dialog title="审核退款"
               :visible.sync="dialogVisible"
               class="verify-dialog"
               :before-close="beforeClose">
      <el-form ref="comboForm" :model="reviewForm" label-width="120px" :rules="reviewRules">
        <el-form-item label="审核" prop="approve">
          <el-radio-group v-model="reviewForm.approve">
            <el-radio label="true">通过</el-radio>
            <el-radio label="false">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="rejectRemark">
          <el-input v-model="reviewForm.rejectRemark" placeholder="请输入" type="textarea" :rows="2" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" v-loading="comboLoading" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {orderStatusOptions, orderTypeOptions} from '@/const/config'
import {refundList, refundAudit} from '@/const/api'
import {statusOpts, searchForm, columns} from '@/const/aft'
import {refundDetail} from '@/const/path'

export default {
  name: 'refund-list',
  components: {},
  data() {
    return {
      pageName: 'refund-list',
      url: refundList + `?shopId=${this.$store.state.shopId}`,
      operationAttrs: {
        width: 160,
        fixed: 'right'
      },
      dialogVisible: false,
      comboLoading: false,
      reviewForm: {
        approve: 'true',
        rejectRemark: ''
      },
      columns,
      extraButtons: [
        {
          text: '查看',
          type: 'primary',
          atClick: this.go2Detail
        },
        {
          text: '审核',
          show: row => row.status === 'WAIT_AUDIT',
          atClick: row => {
            this.go2Review(row)
          }
        }
      ],
      searchForm,
      reviewRow: {}
    }
  },
  computed: {
    reviewRules() {
      let rules = {
        approve: [
          {
            required: true,
            message: '请输入审核结果',
            trigger: 'change'
          }
        ],
        rejectRemark: [
          {
            required: this.reviewForm.approve !== 'true',
            message: '请输入备注信息'
          }
        ]
      }
      return rules
    }
  },
  methods: {
    go2Detail(row) {
      //查看
      this.$router.push(`${refundDetail}?refundId=${row.id}`)
    },
    go2Review(row) {
      //审核
      this.dialogVisible = true
      this.reviewRow = row
    },
    handleConfirm() {
      this.$refs.comboForm.validate(valid => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },
    submit() {
      let data = {
        id: this.reviewRow.id,
        ...this.reviewForm
      }
      this.$axios
        .$post(refundAudit, data)
        .then(resp => {
          this.beforeClose()
          this.$refs.dataTable.getList()
        })
        .catch(err => {
          this.beforeClose()
        })
    },
    beforeClose(done) {
      this.$refs.comboForm.resetFields()
      done ? done() : (this.dialogVisible = false)
    }
  }
}
</script>
