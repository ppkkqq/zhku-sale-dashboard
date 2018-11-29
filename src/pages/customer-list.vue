<template>
  <div :class="pageName">
    <el-data-table
      ref="dataTable"
      v-loading="loading"
      :url="url"
      :columns="columns"
      :headerButtons="headerButtons"
      :hasNew="false"
      :hasEdit="false"
      :hasDelete="false"
      :hasOperation="true"
      :isTree="false"
      :hasPagination="true"
      :extraButtons="extraButtons"
      :operationAttrs="operationAttrs"
      :searchForm="searchForm"
      :dataPath="dataPath"
      :totalPath="totalPath"
      :customQuery="customQuery"
      @reset="handleReset"
      @update="saveImportData"
    >
      <template slot="search">
        <el-form-item label="创建时间">
          <el-date-picker
            @change="setCreateTime"
            value-format="yyyy-MM-dd"
            v-model="createDate"
            type="daterange"
            range-separator="-"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="最后登录时间">
          <el-date-picker
            @change="setLoginTime"
            value-format="yyyy-MM-dd"
            v-model="lastLoginTime"
            type="daterange"
            range-separator="-"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
          ></el-date-picker>
        </el-form-item>
      </template>
    </el-data-table>
    <el-dialog :title="topUpDialogTitle" :visible.sync="topUpDialogVisible">
      <el-form ref="topUpform" label-width="100px" label-position="right" :model="topUpform" :rules="topUpRules">
        <template v-if="currentDialog === single">
          <el-form-item prop="nickName" label="昵称">
            {{topUpform.nickName}}
          </el-form-item>
          <el-form-item prop="mobile" label="手机号">
            {{topUpform.mobile}}
          </el-form-item>
          <el-form-item prop="balance" label="当前国源通币">
            {{topUpform.balance}}
          </el-form-item>
          <el-form-item prop="money">
            <div slot="label">
              <span>充值数量</span>
              <el-tooltip class="item" effect="dark" content="输入正整数为增加，输入负整数为减" placement="top-start">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <el-input v-model.trim="topUpform.money"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item prop="money">
            <div slot="label">
              <span>充值数量</span>
              <el-tooltip class="item" effect="dark" content="只能输入正整数" placement="top-start">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <el-input v-model.trim="topUpform.money"></el-input>
          </el-form-item>
          <el-form-item prop="mobiles">
            <div slot="label">
              <span>充值账号</span>
              <el-tooltip class="item" effect="dark" content="赠送账号为手机号码，账号与账号之间用半角符“,”隔开" placement="top-start">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <el-input type="textarea" row="4" resize="none" v-model.trim="topUpform.mobiles"></el-input>

          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="topUp" v-loading="topUpLoading">保存</el-button>
          <el-button @click="topUpDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-upload
      v-show="false"
      ref="upload"
      :on-change="importExcel"
      :action='`${importUrl}`'
      :multiple='false'
      :auto-upload="false"
      :http-request="httpRequest"
      show-file-list
      :on-success='onSuccess'
      :file-list="[]">
      <el-button slot="trigger" size="small" type="primary" v-loading='importLoading'></el-button>
    </el-upload>
  </div>
</template>

<script>
import {Upload} from 'element-ui'
import {formatDate} from '@/const/filter'
import {
  mcMemberInfos,
  getShopUserInfo,
  currency,
  memberImportTem,
  menberAccountsExport
} from '@/const/api'
import {customerDetail} from '@/const/path'
import {integer, positiveInteger, telPattern} from '@/const/pattern'
import qs from 'qs'
import cookie from 'js-cookie'
import {mapState} from 'vuex'
const dialogTitle = {
  batch: '批量充值',
  single: '国源通币充值'
}
const single = 'single'
const batch = 'batch'

const validateMoney = (rule, value, callback) => {
  if (!value) {
    callback('请输入充值数量')
    return
  }
  if (this.currentDialog === this.single && !integer.test(value)) {
    callback('请输入整数')
    return
  }

  if (this.currentDialog === this.batch && !positiveInteger.test(value)) {
    callback('请输入正整数')
    return
  }
  callback()
}

const validateMobile = (rule, value, callback) => {
  if (!value) {
    callback('请输入充值手机号')
    return
  }

  // 检查错误格式的手机号
  const mobiles = value.split(',')
  const errMobile = mobiles.reduce((result, mobile, index) => {
    if (mobile.trim() && !telPattern.test(mobile)) {
      result.push(mobile)
    }
    return result
  }, [])

  if (errMobile && errMobile.length > 0) {
    callback(`手机号码格式不正确${errMobile.join(',')}`)
  } else {
    callback()
  }
}

export default {
  name: 'customer-list',
  data() {
    return {
      pageName: 'customer-list',
      url: mcMemberInfos, //总部端分页查询
      totalPath: 'payload.totalElements',
      dataPath: 'payload.content',
      columns: [
        {
          prop: 'nickName',
          label: '昵称'
        },
        {
          prop: 'realName',
          label: '姓名'
        },
        {
          prop: 'mobile',
          label: '手机号',
          width: '120px'
        },
        {
          prop: 'gender',
          label: '性别'
        },
        {
          prop: 'birthday',
          label: '生日',
          formatter: ({birthday}) => formatDate(birthday, 'MM-DD')
        },
        {
          prop: 'email',
          label: '邮箱'
        },
        {
          prop: 'createdAt',
          label: '创建时间',
          width: '140px',
          formatter: row => formatDate(row.createdAt)
        },
        {
          prop: 'lastLoginTime',
          label: '最后登录时间',
          width: '140px',
          formatter: row => formatDate(row.lastLoginTime)
        }
      ],
      createDate: [],
      lastLoginTime: [],
      customQuery: {
        startCreateTime: '',
        endCreateTime: '',
        startLastLoginTime: '',
        endLastLoginTime: ''
      },
      loading: false,
      operationAttrs: {
        width: '200px',
        fixed: 'right'
      },
      headerButtons: [
        {
          text: '批量充值',
          type: 'primary',
          atClick: selected => {
            this.currentDialog = batch
            this.topUpDialogVisible = true
          }
        },
        {
          text: '导出会员',
          type: 'primary',
          atClick: () => {
            window.open(
              `${menberAccountsExport}?${qs.stringify(this.exportQuery)}`,
              '_blank'
            )
          }
        },
        {
          text: '导入会员',
          type: 'primary',
          atClick: () => {
            // 模拟点击导入组件
            this.$refs.upload.$el.querySelector('[type=file]').click()
          }
        },
        {
          text: '下载导入模板',
          type: 'primary',
          atClick: () => {
            window.open(`${memberImportTem}`, '_blank')
          }
        }
      ],
      extraButtons: [
        {
          text: '国源通币充值',
          type: 'primary',
          atClick: this.showTopUp
        },
        {
          text: '查看',
          atClick: this.go2Detail
        }
      ],
      searchForm: [
        {
          $el: {
            placeholder: '请输入客户姓名'
          },
          label: '昵称',
          $id: 'nickName',
          $type: 'input'
        },
        {
          $el: {
            placeholder: '请输入手机号'
          },
          label: '手机号',
          $id: 'mobile',
          $type: 'input'
        }
      ],
      single,
      batch,
      topUpLoading: false,
      topUpform: {},
      topUpRules: {
        money: {trigger: 'blur', validator: validateMoney},
        mobiles: {trigger: 'blur', validator: validateMobile}
      },
      currentDialog: single,
      topUpDialogVisible: false,
      exportQuery: {},
      importLoading: false
    }
  },
  components: {
    'el-upload': Upload
  },
  computed: {
    topUpDialogTitle() {
      return dialogTitle[this.currentDialog]
    },
    ...mapState({
      tenantCode: function(state) {
        return state.tenantCode
      }
    }),
    importUrl() {
      return (
        '/pmsX-api/api/v1/admin/manhours/manhourbacktrack?token=' + this.token
      )
    }
  },
  watch: {
    topUpDialogVisible: function(isShow) {
      if (!isShow) {
        this.$refs.topUpform.resetFields()

        this.topUpform = {}
      }
    }
  },
  methods: {
    go2Detail(row) {
      this.$router.push(`${customerDetail}?memberId=${row.id}`)
    },
    topUp() {
      this.$refs.topUpform.validate(valid => {
        if (valid) {
          let data = {
            mobiles: this.topUpform.mobile,
            money: this.topUpform.money
          }

          if (this.currentDialog === this.batch) {
            data = {
              mobiles: this.topUpform.mobiles
                .split(',')
                .filter(v => !!v)
                .join(','),
              money: this.topUpform.money
            }
          }

          this.topUpLoading = true

          let url = `${currency}`

          this.$axios
            .$post(url, data)
            .then(resp => {
              this.$message.success('操作成功')
            })
            .catch(e => console.error(e))
            .finally(() => {
              this.topUpLoading = false
              this.topUpDialogVisible = false
            })
        }
      })
    },
    getBalance() {
      this.topUpLoading = true

      let url = `${currency}/${this.topUpform.id}`
      this.$axios
        .$get(url)
        .then(resp => {
          this.topUpform = {...this.topUpform, balance: resp.payload.balance}
        })
        .catch(e => console.error(e))
        .finally(() => {
          this.topUpLoading = false
        })
    },
    showTopUp(row) {
      this.currentDialog = single
      this.topUpDialogVisible = true
      this.topUpform = row
      this.getBalance()
    },
    setCreateTime() {
      this.customQuery.startCreateTime = this.createDate[0]
      this.customQuery.endCreateTime = this.createDate[1]
    },
    setLoginTime() {
      this.customQuery.startLastLoginTime = this.lastLoginTime[0]
      this.customQuery.endLastLoginTime = this.lastLoginTime[1]
    },
    handleReset() {
      this.customQuery.startCreateTime = ''
      this.customQuery.endCreateTime = ''
      this.customQuery.startLastLoginTime = ''
      this.customQuery.endLastLoginTime = ''
      this.createDate = []
      this.lastLoginTime = []
    },
    saveImportData() {
      let memberData = this.$refs.dataTable.$refs.searchForm.getFormValue()
      let token = cookie.get('token')
      let code = {
        token: token,
        tenantCode: this.tenantCode
      }
      Object.assign(this.exportQuery, memberData, this.customQuery, code)
    },
    // 导入excel，csv格式
    importExcel(file) {
      const types = file.name.split('.')[1]
      this.fileExcel(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          this.xlsxJson = tabJson
        }
        if (this.xlsxJson.length > 0) {
          this.submitUpload()
          this.importLoading = true
        }
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    openSuccess() {
      this.$notify({
        title: '工时补录',
        message: '上传成功',
        type: 'success'
      })
    },
    openFail() {
      this.$notify.error({
        title: '工时补录',
        message: '工时类型应该是加班或正常'
      })
    },
    onSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles()
    },
    transferCouponValueTime(startDate, valueTime) {
      var date = new Date(startDate)
      var newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1 + valueTime
      )
      var year1 = date.getFullYear()
      var month1 = date.getMonth() + 1
      var day1 = date.getDate()
      var year2 = newDate.getFullYear() - 70
      var month2 = newDate.getMonth() + 1
      var day2 = newDate.getDate()
      if (day2 > 10) {
        return year2 + '-' + month2 + '-' + day2
      } else {
        return year2 + '-' + month2 + '-' + '0' + day2
      }
    },
    fileExcel(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          let data = e.target.result

          if (!FileReader.prototype.readAsBinaryString) {
            var str = cptable.utils.decode(936, data) //字符编码转utf-8

            data = new Uint8Array(str)
          } else {
            data = cptable.utils.decode(936, data) //字符编码转utf-8
          }
          let wb = XLSX.read(data, {
            type: 'binary'
          })
          let result = []
          let resuleChange
          wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              // sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
              sheet: XLSX.utils.sheet_to_csv(wb.Sheets[sheetName])
            })
          })
          console.log(wb)
          console.log(result)
          result.forEach((value, index) => {
            if (value.sheet.length > 0) {
              value.sheet.forEach((Ovalue, Oindex) => {
                // let mapKey = {
                //   任务内容: 'taskContent',
                //   工时: 'manHour',
                //   工时类型: 'hourType',
                //   漏填时间: 'fillDate',
                //   用户名: 'name',
                //   项目名称: 'projectName'
                // }
                let mapKey = {
                  昵称: 'nickName',
                  姓名: 'name',
                  手机号: 'mobile',
                  性别: 'gender',
                  生日: 'birth',
                  邮箱: 'email'
                }
                resuleChange = Object.keys(Ovalue).reduce((result, key) => {
                  result[mapKey[key]] = Ovalue[key]

                  return result
                }, {})

                this.resultArray.push(resuleChange)
              })
            }
          })
          this.resultArray.forEach((value, index) => {
            if (value.hourType == '加班') {
              value.hourType = 1
              value.fillDate = this.transferCouponValueTime(1, value.fillDate)
            } else if (value.hourType == '正常') {
              value.hourType = 0
              value.fillDate = this.transferCouponValueTime(1, value.fillDate)
            } else {
              value.hourType = 2
              this.resultArray = []
              this.openFail()
              this.$refs.upload.clearFiles()
            }
          })
          resolve(this.resultArray)
        }
        reader.readAsBinaryString(file.raw)
      })
    },
    httpRequest() {
      //自定义上传的实现
      this.$axios
        .post(this.url, this.resultArray)
        .then(response => {
          if (response.data.length > 0) {
            this.openSuccess()
            this.$refs.upload.clearFiles()
            this.resultArray = []
            this.importLoading = false
          }
        })
        .catch(error => {
          if (error.response) {
            this.$refs.upload.clearFiles()
            this.resultArray = []
            this.importLoading = false
          }
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
