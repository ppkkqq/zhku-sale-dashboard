<template>
  <div :class="pageName">
    <el-data-table
      ref="dataTable"
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
      :searchForm="searchForm"
      :headerButtons="headerButtons"
      :customQuery="customQuery"
      dataPath="payload.content"
      totalPath="payload.totalElements"
      @reset="searchReset">
      <template slot="search">
        <el-form-item label="消费渠道">
          <el-cascader
            :options="channelOptions"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <!--<el-form-item label="圆通币品类">-->
          <!--<el-cascader-->
            <!--:options="categoryOptions"-->
            <!--v-model="categoryValue"-->
            <!--:show-all-levels="false"-->
            <!--:props="{value:'id', label:'name'}"-->
            <!--@change="handleCategoryChange">-->
          <!--</el-cascader>-->
        <!--</el-form-item>-->
        <el-form-item label="圆通币品类">
          <el-select v-model="customQuery.catalog" placeholder="请选择">
            <el-option
              v-for="item in catalogList"
              :key="item.key"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发放日期">
          <el-date-picker
            @change="setReleaseTime"
            value-format="yyyy-MM-dd"
            v-model="releaseDate"
            type="daterange"
            :clearable=false
            range-separator="-"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
          ></el-date-picker>
        </el-form-item>
      </template>
    </el-data-table>

    <el-dialog title="批量充值国源通币"  :visible.sync="TopUpVisible">
      <el-form ref="topUpform" :model="topUpform" >

        <el-form-item label="上传附件">
          <el-upload
            class="upload-demo"
            ref="upload"
            accept="excel"
            :action=batchInpour
            :limit=1
            :data="topUpform"
            :on-success="uploadSuccess"
            :auto-upload="false">
          <el-button slot="trigger">上传文件</el-button>
          <div class="tip">
            <span style="margin-right: 10px">仅支持Excle文件，请按模板要求规范填写</span>
            <el-button type="text" @click="downloadTemplate">下载批量充值模板</el-button></div>
          </el-upload>
        </el-form-item>

        <el-form-item label="有效期">
          <el-radio-group v-model="topUpform.endTime">
            <el-radio label="1">12个月</el-radio>
            <el-radio label="2">24个月</el-radio>
            <el-radio label="3">36个月</el-radio>
            <el-radio label="5">5年</el-radio>
            <el-radio label="10">10年</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="适用渠道" >
          <el-select v-model="topUpform.platform" @change="isEcommerce" placeholder="请选择">
            <el-option
              v-for="item in fatherOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
            <el-select v-model="topUpform.channel" :disabled="isTrue" placeholder="请选择">
            <el-option
              v-for="item in childrenOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item  label="适用品类" >
          最多可选择5个品类，选择旅游渠道时不用选择品类
          <el-transfer v-model="topUpform.catalogIds"
                       :data="catalogList"
                       v-if="isShowTransfer"
                       :titles="['平台前端类目', '可使用圆通币品类']"
                       :button-texts="['加入左侧', '加入右侧']">
          </el-transfer>
        </el-form-item>

      </el-form>
      <el-row  slot="footer">
        <el-button type="primary" @click="submit()">提交审批</el-button>
        <el-button @click="TopUpVisible = false">取消</el-button>
      </el-row>
    </el-dialog>

    <!--提交结果弹框-->
    <el-dialog title="批量充值国源通币"  style="margin-top: -8vh" :visible.sync="SubmitVisible">
        <div style="text-align: center;">
          <i :class="submitStatus==='succeed'? successClass: errorClass"></i>
          <p class="submit-text">{{submitStatus==='succeed'?'提交成功':'提交失败'}}</p>
          <p v-if="submitStatus==='succeed'" class="submit-message" >总共导入{{total}}条数据，成功匹配{{total}}条</p>
          <p v-if="submitStatus==='failed'" class="submit-message">请核对并修改以下信息后，再重新提交</p>
        </div>

      <!--提交成功步骤条-->
      <el-steps v-if="submitStatus==='succeed'" align-center  :active="1" finish-status="success">
        <el-step title="创建批量充值">
          <template slot="description">
            <p>{{userName}}</p>
            <p>{{createAt}}</p>
          </template>
        </el-step>
        <el-step title="财务复审">
          <template slot="description">
            <!--<p>某某某</p>-->
            <!--<p>2018-02-30</p>-->
          </template>
        </el-step>
        <el-step title="充值成功">
          <template slot="description">
            <!--<p>某某某</p>-->
            <!--<p>2018-02-30</p>-->
          </template>
        </el-step>
      </el-steps>

      <!--提交失败提示信息-->
      <div style="margin-left: 140px;" v-if="submitStatus==='failed'">
        <p style="font-weight: bold;margin-bottom:10px;">您提交的内容有如下错误：</p>
        <div class="errorBox">
          <div v-for="(item,index) in errorMessage" :key="index" class="error-message">
            <span>第{{item.index}}行</span>
            <span>{{item.content}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const status2String = {
  REJECTED: '驳回',
  ACTIVE: '审批通过',
  PENDING_APPROVAL: '待审批',
  CANCEL: '已取消'
}
const expiry2Date = {
  1: '12个月',
  2: '24个月',
  3: '36个月',
  5: '5年',
  10: '10年'
}
import {
  template,
  batchInpour,
  catalog,
  inpourList,
  downloadDetail,
  review,
  cancelInpour
} from '@/const/api'
import {formatDate} from '@/const/filter'
import {mapState} from 'vuex'
import {Transfer, Upload, Tree} from 'element-ui'

export default {
  name: 'top-up-record',
  components: {
    'el-transfer': Transfer,
    'el-upload': Upload,
    'el-tree': Tree
  },
  data() {
    return {
      fileList: [],
      errorMessage: [],
      categoryOptions: [],
      categoryValue: [],
      authInfo: '',
      createAt: '',
      userName: '',
      isShowTransfer: true,
      total: 0,
      topUpform: {
        channel: '',
        platform: '',
        endTime: '',
        catalogIds: []
      },
      customQuery: {
        platform: '',
        channel: '',
        catalog: '',
        startTime: '',
        endTime: ''
      },
      catalogList: [],
      selectedOptions: [],
      releaseDate: [],
      submitStatus: '',
      successClass: 'el-icon-success',
      errorClass: 'el-icon-error',
      value: '',
      pageName: 'top-up-record',
      url: inpourList,
      SubmitVisible: false,
      TopUpVisible: false,
      isTrue: true,
      channelOptions: [
        {
          value: 'PLAT_FORM',
          label: '全部'
        },
        {
          value: 'E_COMMERCE',
          label: '电商',
          children: [
            {
              value: 'ALL',
              label: '全部'
            },
            {
              value: 'SELF',
              label: '国投自营'
            },
            {
              value: 'JD',
              label: '京东'
            },
            {
              value: 'WOMAI',
              label: '我买网'
            }
          ]
        },
        {
          value: 'TOURISM',
          label: '旅游'
        }
      ],
      fatherOptions: [
        {
          value: 'ALL',
          label: '全部'
        },
        {
          value: 'E_COMMERCE',
          label: '电商'
        },
        {
          value: 'TOURISM',
          label: '旅游'
        }
      ],
      childrenOptions: [
        {
          value: 'ALL',
          label: '全部'
        },
        {
          value: 'SELF',
          label: '国投自营'
        },
        {
          value: 'JD',
          label: '京东'
        },
        {
          value: 'WOMAI',
          label: '我买网'
        }
      ],
      columns: [
        {
          prop: 'eventTime',
          label: '充值时间',
          minWidth: '150px',
          formatter: row => {
            return formatDate(row.eventTime, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          prop: 'userName',
          label: '操作人员',
          minWidth: '100px'
        },
        {
          prop: 'totalCount',
          label: '充值人数'
        },
        {
          prop: 'balance',
          label: '充值总币数',
          minWidth: '100px'
        },
        {
          prop: 'channel',
          label: '消费渠道',
          minWidth: '100px'
        },
        {
          prop: 'catalogId',
          label: '源通币品类',
          minWidth: '100px'
        },
        {
          prop: 'expiry',
          label: '使用有效期',
          minWidth: '100px',
          formatter: row => {
            return expiry2Date[row.expiry]
          }
        },
        {
          prop: 'status',
          label: '状态',
          formatter: row => {
            return status2String[row.status]
          }
        }
      ],

      searchForm: [
        {
          $el: {
            placeholder: '请选择'
          },
          label: '状态',
          $id: 'status',
          $type: 'select',
          $options: [
            {
              label: '待审批',
              value: 'PENDING_APPROVAL'
            },
            {
              label: '审批通过',
              value: 'ACTIVE'
            },
            {
              label: '驳回',
              value: 'REJECTED'
            },
            {
              label: '已取消',
              value: 'CANCEL'
            }
          ]
        }
      ],
      operationAttrs: {
        width: '320px',
        fixed: 'right'
      },
      extraButtons: [
        {
          text: '取消充值',
          show: this.showCancelButton,
          atClick: row => {
            this.cancelInpour(row)
          }
        },
        {
          text: '通过审核',
          show: this.showPermitButton,
          atClick: row => {
            this.permitInpour(row)
          }
        },
        {
          type: 'primary',
          text: '驳回',
          show: this.showRejectButton,
          atClick: row => {
            this.rejectInpour(row)
          }
        },
        {
          type: 'primary',
          text: '下载充值明细',
          show: this.showDownloadButton,
          atClick: row => {
            window.open(
              `${downloadDetail}?${this.authInfo}&batchNum=${row.batchNum}`,
              '_blank'
            )
          }
        }
      ],
      headerButtons: [
        {
          text: '批量充值源通币',
          type: 'primary',
          atClick: row => this.onBatchInpour(row)
        },
        {
          text: '下载批量导入模板',
          type: 'primary',
          atClick: row => this.downloadTemplate(row)
        }
      ]
    }
  },
  methods: {
    searchReset() {
      this.selectedOptions = []
      this.releaseDate = []
    },
    // handleCategoryChange() {
    //   if (this.categoryValue.length === 1) {
    //     this.customQuery.catalog = this.categoryValue[0]
    //   } else if (this.categoryValue.length === 2) {
    //     this.customQuery.catalog = this.categoryValue[1]
    //   }
    // },
    downloadTemplate() {
      window.open(`${template}`, '_blank')
    },
    onBatchInpour() {
      ;(this.fileList = []),
        (this.topUpform.endTime = ''),
        (this.topUpform.channel = ''),
        (this.topUpform.platform = ''),
        (this.topUpform.catalogIds = []),
        (this.TopUpVisible = true)
    },
    rejectInpour(row) {
      this.$confirm('是否驳回此次圆通币充值?', {
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .$get(`${review}?batchNum=${row.batchNum}&passed=false`)
            .then(res => {
              this.$refs.dataTable.getList() //刷新页面
              this.$message({
                type: 'success',
                message: '驳回成功!'
              })
            })
        })
        .catch(() => {})
    },
    cancelInpour(row) {
      this.$confirm('是否取消此次圆通币充值?', {
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .$get(`${cancelInpour}?batchNum=${row.batchNum}`)
            .then(res => {
              this.$refs.dataTable.getList() //刷新页面
              this.$message({
                type: 'success',
                message: '取消成功!'
              })
            })
        })
        .catch(() => {})
    },
    permitInpour(row) {
      this.$confirm('是否同意此次圆通币充值?', {
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .$get(`${review}?batchNum=${row.batchNum}&passed=true`)
            .then(res => {
              this.$refs.dataTable.getList() //刷新页面
              this.$message({
                type: 'success',
                message: '审核成功!'
              })
            })
        })
        .catch(() => {})
    },
    showCancelButton(row) {
      return (
        status2String[row.status] === '待审批' &&
        (this.user && this.user.id === row.createdBy)
      )
    },
    showPermitButton(row) {
      return status2String[row.status] === '待审批' && this.isCWmember
    },
    showRejectButton(row) {
      return status2String[row.status] === '待审批' && this.isCWmember
    },
    showDownloadButton(row) {
      return (
        status2String[row.status] === '待审批' ||
        status2String[row.status] === '审批通过' ||
        status2String[row.status] === '已取消'
      )
    },
    submit() {
      const fileList = this.$refs.upload.uploadFiles
      if (fileList.length === 0) {
        this.$message({
          type: 'error',
          message: '必须上传文件'
        })
        return
      }
      if (this.topUpform.endTime === '') {
        this.$message({
          type: 'error',
          message: '必须选择有效期'
        })
        return
      }
      if (!this.topUpform.platform) {
        this.$message({
          type: 'error',
          message: '必须选择适用渠道'
        })
        return
      }
      if (this.topUpform.platform === 'E_COMMERCE' && !this.topUpform.channel) {
        this.$message({
          type: 'error',
          message: '必须选择电商类目'
        })
        return
      }
      if (
        this.topUpform.platform === 'E_COMMERCE' &&
        this.topUpform.catalogIds.length === 0
      ) {
        this.$message({
          type: 'error',
          message: '必须选择适用品类'
        })
        return
      }

      this.$refs.upload.submit()
      this.TopUpVisible = false
      this.SubmitVisible = true
    },
    handleChange() {
      if (this.selectedOptions.length === 1) {
        this.customQuery.platform = this.selectedOptions[0]
      } else if (this.selectedOptions.length === 2) {
        this.customQuery.platform = this.selectedOptions[0]
        this.customQuery.channel = this.selectedOptions[1]
      }
    },
    getCatalog() {
      this.$axios.$get(catalog).then(res => {
        console.log(res)
        // this.categoryOptions = res.payload;
        // res.payload.map(firstLevel => {
        //   firstLevel.children &&
        //   firstLevel.children.map(secondLevel => {
        //     return (secondLevel.children = null);
        //   });
        // });
        this.catalogList.push({
          label: '全部',
          key: 'ALL'
        })
        res.payload.forEach(item => {
          this.catalogList.push({
            label: item.name,
            key: item.id
          })
        })
      })
    },
    setReleaseTime() {
      this.customQuery.startTime = this.releaseDate[0]
      this.customQuery.endTime = this.releaseDate[1]
    },
    isEcommerce() {
      if (
        this.topUpform.platform === 'ALL' ||
        this.topUpform.platform === 'TOURISM'
      ) {
        this.isTrue = true
        this.isShowTransfer = false
      } else if (this.topUpform.platform === 'E_COMMERCE') {
        this.isTrue = false
        this.isShowTransfer = true
      }
    },
    uploadSuccess(response) {
      this.TopUpVisible = false
      this.SubmitVisible = true
      this.$refs.dataTable.getList() //刷新页面
      this.errorMessage = response.payload.result
      this.total = response.payload.total
      this.submitStatus = response.payload.status
      this.userName = response.payload.userName
      this.createAt = formatDate(
        response.payload.createAt,
        'YYYY-MM-DD HH:mm:ss'
      )
    }
  },
  created() {
    this.authInfo = `token=${this.token}&tenantCode=${this.tenantCode}`
    this.batchInpour = `${batchInpour}?${this.authInfo}`
  },
  mounted() {
    this.getCatalog()
  },
  computed: {
    isCWmember() {
      return this.user && this.user.roles && this.user.roles[0].roleNum === 'CW'
    },
    ...mapState({
      tenantCode: function(state) {
        return state.tenantCode
      },
      token: function(state) {
        return state.token
      },
      user: function(state) {
        return state.user
      }
    })
  },
  watch: {
    'topUpform.catalogIds': {
      handler: function(val) {
        const allItem = val.find(item => {
          return item === 'ALL'
        })
        if (allItem) {
          let selectedArr
          // 为了防止重复调用
          if (val.length === 1) {
            selectedArr = val
          } else {
            selectedArr = [allItem]
          }
          this.topUpform.catalogIds = selectedArr
          return
        }

        this.topUpform.catalogIds.length = val.length > 5 ? 5 : val.length
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus">
  .top-up-record {
    .tip {
      margin-left: 70px;
      color: #aaa;
    }
    .el-icon-success {
      font-size: 50px;
      color: rgb(82, 196, 26)
      margin-bottom: 15px;
    }
    .el-icon-error {
      font-size: 50px;
      color: rgb(245, 34, 45)
      margin-bottom: 15px;
    }
    .submit-text {
      font-size: 16px;
      font-weight: bold;
    }
    .submit-message {
      margin: 10px 0 30px;
      font-size: 12px;
      color: #ccc;
    }
    .errorBox {
      width:70%;
      height:200px;
      border:1px solid #888;
      .error-message {
        margin:5px 0 0 10px;
        font-size: 13px;
      }
    }
    .el-textarea {
      width: 70%;
    }
    .el-dialog__wrapper {
      .el-dialog {
        z-index: 99;
      }
    }
  }
</style>
