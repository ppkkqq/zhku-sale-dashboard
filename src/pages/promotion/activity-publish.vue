<template>
  <div :class="pageName">
    <go-back></go-back>
    <div class="is-flex">
      <el-card class="box-card" header="选择活动类型">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="限时抢购" name="1">
            <el-radio-group v-model="radio2">
              <el-radio :label="3">过界面样式和交互动效让用户可以</el-radio>
              <el-radio :label="6">过界面样式和交互动效让用户可以</el-radio>
              <el-radio :label="9">过界面样式和交互动效让用户可以</el-radio>
            </el-radio-group>
          </el-collapse-item>
          <el-collapse-item title="预售" name="2">
            <el-radio-group v-model="radio2">
              <el-radio :label="3">过界面样式和交互动效让用户可以</el-radio>
              <el-radio :label="6">过界面样式和交互动效让用户可以</el-radio>
              <el-radio :label="9">过界面样式和交互动效让用户可以</el-radio>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card class="box-card" header="活动基础信息">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px" :disabled="isView">
          <el-form-item label="活动标题" prop="tmaTitle">
            <el-input v-model.trim="form.tmaTitle"></el-input>
          </el-form-item>
          <el-form-item label="活动有效时间" prop="tmaStmartTime">
            <el-date-picker
              @change="setTime"
              value-format="yyyy-MM-dd HH:mm"
              v-model="dateRange"
              type="datetimerange"
              range-separator="-"
              start-placeholder="活动开始时间"
              end-placeholder="活动结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="活动链接地址">
            <el-input class="link" v-model="form.tmaLinkAddress"></el-input>
            <el-button class="href-btn" @click="onTest" type="primary" size="small">
              <a :href="form.tmaLinkAddress" target="_blank">测试</a>
            </el-button>
          </el-form-item>
          <el-form-item label="推广平台">
            <el-checkbox-group v-model="form.name">
              <el-checkbox label="APP"></el-checkbox>
              <el-checkbox label="PC网页"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="活动展示图片">
            <upload-to-ali
              v-if="!form.tmaPicture"
              accept="image/png, image/jpeg, image/jpg"
              v-model="form.tmaPicture"
              :compressOptions="{}"
            ></upload-to-ali>
            <viewer v-if="form.tmaPicture" :src="form.tmaPicture"/>
          </el-form-item>
          <el-form-item label="活动描述" prop="description">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.tmaDescribe"></el-input>
          </el-form-item>
          <el-form-item label="活动优先级">
            <el-input v-model.trim.number="form.tmaPriority" type="number"></el-input>
          </el-form-item>
          <el-form-item label="活动状态">
            <el-radio-group v-model="form.tmaStatus">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="small">发布</el-button>
            <el-button @click="onCancel" size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {} from '@/const/config'
import {columns, searchForm} from '@/const/marketing'
import {} from '@/const/api'
import {} from '@/const/path'
import {Collapse, CollapseItem} from 'element-ui'
import Viewer from 'viewer'
import UploadToAli from 'upload-to-ali'
import GoBack from '@/components/GoBack'

export default {
  name: 'activity-publish',
  components: {
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem,
    Viewer,
    UploadToAli,
    'go-back': GoBack
  },
  data() {
    return {
      pageName: 'activity-publish',
      url: '', //aftList + `?shopId=${this.$store.state.shopId}`,
      dateRange: [],
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
      dialogRow: {},
      activeNames: '',
      radio2: 1,
      form: {
        tmaTitle: '',
        tmaStmartTime: '',
        tmaEndTime: '',
        tmaLinkAddress: '',
        tmaIsPartakePc: '',
        tmaIsPartakeApp: '',
        tmaPicture: '',
        tmaDescribe: '',
        tmaPriority: '',
        tmaStatus: 1,
        name: '',
        photoUrl:
          'https://tse3.mm.bing.net/th?id=OIP.bJTVUv9Z3A68Eq-uYZAUWQHaEK&pid=Api&w=660&h=371&rs=1&p=0',
        description: ''
      },
      rules: {
        tmaTitle: [
          {required: true, message: '请输入活动标题', trigger: 'blur'},
          {max: 30, message: '长度在 30 个字符以内', trigger: 'blur'}
        ],
        tmaStmartTime: [
          {required: true, message: '请输入活动有效时间', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入活动描述', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    isView() {
      return this.$route.query.isView > 0
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
  methods: {
    handleReset() {
      this.customQuery.startDate = ''
      this.customQuery.endDate = ''
      this.dateRange = []
    },
    setTime() {
      this.form.tmaStmartTime = this.dateRange[0]
      this.form.tmaEndTime = this.dateRange[1]
    },
    handleChange() {},
    onUpLoadFile(value) {
      this.$set(this.form, 'photoUrl', value)
    },
    onTest() {},
    onSubmit() {},
    onCancel() {}
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
<style lang="stylus">
.activity-publish {
  .is-flex {
    display: flex
    flex-wrap: nowrap
    width: 100%
    min-height: 100%
  }

  .el-card {
    width: 49%
    min-width: 300px
    height: 100%
    margin: 0 5px
  }

  .box-card {
    height: 100%
    min-height: 100%
  }

  .el-collapse {
    border-top: 0

    .el-radio-group {
      display: block
    }

    .el-radio {
      width: 100%
      line-height: 26px
    }

    .el-radio+.el-radio {
      margin: 0
    }
  }

  .el-date-editor {
    width: 100%
  }

  .el-range-separator {
    width: 20px
  }

  .link {
    width: 77%
  }

  .href-btn {
    a {
      color: #fff
    }
  }
}
</style>
