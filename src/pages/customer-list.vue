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
      :file-list="fileList">
      <el-button slot="trigger" size="small" type="primary" v-loading='importLoading'></el-button>
    </el-upload>
    <el-dialog title="错误提示" :visible.sync="dialogVisible"
    >
      <span>上传文件共{{totalLength}}条数据，校验合格{{totalLength-errorLength}}，有{{errorLength}}条数据检验未通过，请修改重新导入！</span>
      <el-table :data="tableData" style="width: 70%"
                v-bind="tableAttrs">
        <el-table-column
          prop="id"
          label="序号"
          min-width="30">
        </el-table-column>
        <el-table-column
          prop="content"
          label="提示内容"
          min-width="180"
          style="color: red;"
          :formatter="(row)=>{return `第${row.index+1}行,${row.content}`}"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
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
import uniq from 'lodash/uniq'
import {integer, positiveInteger, telPattern} from '@/const/pattern'
import qs from 'qs'
import cookie from 'js-cookie'
import {mapState} from 'vuex'
import XLSX from 'xlsx'
import {emailPattern} from '@/const/pattern'

const dialogTitle = {
  batch: '批量充值',
  single: '国源通币充值'
}
const single = 'single'
const batch = 'batch'

export default {
  name: 'customer-list',
  data() {
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
      let temp = value.search(/[^0-9,]/)
      if (temp != -1) {
        callback(`充值账户格式不正确，第${temp + 1}位字符不能识别`)
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
    return {
      uploading: false,
      totalLength: 0,
      errorLength: 0,
      fileList: [],
      response: {},
      xlsxJson: [],
      resultArray: [],
      leadingIn: '导入excel表格',
      loading: false,
      dialogVisible: false,
      tableData: [
        {
          id: '',
          content: ''
        }
      ],
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
      mobileList: [],
      topUpLoading: false,
      topUpform: {},
      topUpRules: {
        money: {trigger: 'blur', validator: validateMoney},
        mobiles: {trigger: 'blur', validator: validateMobile}
      },
      currentDialog: single,
      topUpDialogVisible: false,
      exportQuery: {},
      importLoading: false,
      errorType: false,
      tableAttrs: {
        'tooltip-effect': 'light',
        'cell-style': e => {
          const row = e.row
          const typeToColor = {
            content: 'red'
          }
          return {color: typeToColor[e.column.property]}
        }
      },
      isRepeat: false
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
      },
      token: function(state) {
        return state.token
      }
    }),
    importUrl() {
      return '/mall-deepexi-member-center/api/v1/mcMemberAccounts/importExcel'
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
      let authInfo = {
        token: this.token,
        tenantCode: this.tenantCode
      }
      Object.assign(this.exportQuery, memberData, this.customQuery, authInfo)
    },
    // 导入excel，csv格式
    importExcel(file) {
      // console.log(file)
      const types = file.name.split('.')[1]
      if (types !== 'csv') {
        this.$notify({
          title: '提示',
          message: `文件格式不正确，只支持.csv文件`,
          type: 'error'
        })
        return
      }
      this.fileExcel(file).then(tabJson => {
        // console.log(tabJson)
        if (tabJson && tabJson.length > 0) {
          this.xlsxJson = tabJson
        }
        if (this.totalLength > 1000) {
          this.openError()
          return
        }
        if (this.tableData.length) {
          // 有错误！！！！
          this.dialogVisible = true
        } else {
          this.importLoading = true
          this.submitUpload()
        }
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    openSuccess() {
      this.$notify({
        title: '提示',
        message: `上传文件共${this.totalLength}条数据，成功导入${
          this.totalLength
        }条！`,
        type: 'success'
      })
    },
    openError() {
      this.$notify({
        title: '提示',
        message: `单次导入只支持1000条（含）以内记录！`,
        type: 'error'
      })
    },
    onSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles()
      this.$message({
        type: 'success',
        message: `上传成功`
      })
    },
    fileExcel(file) {
      this.tableData = []
      this.resultArray = []
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
          if (
            !wb.Sheets[wb.SheetNames[0]].A1 ||
            wb.Sheets[wb.SheetNames[0]].A1.v !== '昵称(2-16字符)' ||
            (!wb.Sheets[wb.SheetNames[0]].B1 ||
              wb.Sheets[wb.SheetNames[0]].B1.v !== '姓名(20字符以内)') ||
            (!wb.Sheets[wb.SheetNames[0]].C1 ||
              wb.Sheets[wb.SheetNames[0]].C1.v !== '手机号(不可为空)') ||
            (!wb.Sheets[wb.SheetNames[0]].D1 ||
              wb.Sheets[wb.SheetNames[0]].D1.v !== '性别(男/女)') ||
            (!wb.Sheets[wb.SheetNames[0]].E1 ||
              wb.Sheets[wb.SheetNames[0]].E1.v !== '生日(yyyy-MM-dd)') ||
            (!wb.Sheets[wb.SheetNames[0]].F1 ||
              wb.Sheets[wb.SheetNames[0]].F1.v !== '邮箱')
          ) {
            this.errorType = true
            this.$notify({
              title: '提示',
              message: `文件格式不正确，请下载并参考导入模板！`,
              type: 'error'
            })
          } else {
            this.errorType = false
            wb.SheetNames.forEach(sheetName => {
              result.push({
                sheetName: sheetName,
                sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
              })
            })

            result.forEach((value, index) => {
              if (result[index].sheet.length > 0) {
                result[index].sheet.forEach((Ovalue, Oindex) => {
                  let mapKey = {
                    '昵称(2-16字符)': 'nickName',
                    '姓名(20字符以内)': 'realName',
                    '手机号(不可为空)': 'mobile',
                    '性别(男/女)': 'gender',
                    '生日(yyyy-MM-dd)': 'birthday',
                    邮箱: 'email'
                  }
                  resuleChange = Object.keys(Ovalue).reduce((result, key) => {
                    result[mapKey[key]] = Ovalue[key].toString()
                    return result
                  }, {})
                  resuleChange.birthday = resuleChange.birthday
                    ? formatDate(
                        new Date(1900, 0, resuleChange.birthday - 1),
                        'YYYY-MM-DD'
                      )
                    : ''
                  // console.log(resuleChange.birthday,'我是birthday')
                  // resuleChange.birthday = formatDate('a', 'YYYY-MM-DD')
                  this.resultArray.push(resuleChange)
                })
              }
            })
            this.totalLength = this.resultArray.length

            if (this.totalLength < 1000) {
              if (this.totalLength !== 0) {
                this.errorLength = 0
                this.repeatTemp = true //能够进行重复校验
                this.resultArray.forEach((value, index) => {
                  let temp = false

                  if (
                    value.nickName &&
                    (value.nickName.length < 2 || value.nickName.length > 16)
                  ) {
                    this.tableData.push({
                      id: this.tableData.length + 1,
                      index: index + 1,

                      content: '昵称格式不对，昵称长度为2-16个字符'
                    })
                    temp = true
                  }
                  if (value.realName && value.realName.length > 20) {
                    this.tableData.push({
                      id: this.tableData.length + 1,
                      index: index + 1,
                      content: '姓名格式不对，姓名长度最多20个字符'
                    })
                    temp = true
                  }
                  if (!value.mobile) {
                    this.tableData.push({
                      id: this.tableData.length + 1,
                      index: index + 1,
                      content: '手机号码不能为空'
                    })
                    temp = true
                    this.repeatTemp = false
                  } else {
                    if (!/^1[3456789]\d{9}$/.test(value.mobile)) {
                      this.tableData.push({
                        id: this.tableData.length + 1,
                        index: index + 1,
                        content: '手机格式不对'
                      })
                      temp = true
                      this.repeatTemp = false
                    } else {
                      this.mobileList.push(value.mobile)
                    }
                  }

                  if (
                    value.gender &&
                    value.gender !== '男' &&
                    value.gender !== '女'
                  ) {
                    this.tableData.push({
                      id: this.tableData.length + 1,
                      index: index + 1,
                      content: '性别格式不对，性别只能为男，女'
                    })
                    temp = true
                  }
                  if (value.birthday && value.birthday == 'NaN-NaN-NaN') {
                    this.tableData.push({
                      id: this.tableData.length + 1,
                      index: index + 1,
                      content: '生日格式不对，生日格式为yyyy-mm-dd'
                    })
                    temp = true
                  }
                  if (value.email && !emailPattern.test(value.email)) {
                    this.tableData.push({
                      id: this.tableData.length + 1,
                      index: index + 1,
                      content: '邮箱格式不对'
                    })
                    temp = true
                  }
                  if (temp) {
                    this.errorLength += 1
                  }
                })
                if (
                  this.repeatTemp &&
                  this.errorLength == 0 &&
                  this.mobileList.length !== uniq(this.mobileList).length
                ) {
                  this.$notify({
                    title: '提示',
                    message: `导入会员中存在重复的手机号码，请检查导入的数据！`,
                    type: 'error'
                  })
                  this.isRepeat = true
                } else {
                  this.isRepeat = false
                }
              } else {
                this.$notify({
                  title: '提示',
                  message: `单次导入记录不可为空！`,
                  type: 'error'
                })
              }
            }
          }
          resolve(this.resultArray)
        }
        reader.readAsBinaryString(file.raw)
      })
    },
    httpRequest() {
      //自定义上传的实现
      // console.log(this.errorLength,this.totalLength)
      if (
        this.uploading ||
        this.errorType ||
        this.errorLength > 0 ||
        this.totalLength > 1000 ||
        this.totalLength == 0 ||
        this.isRepeat
      ) {
        return
      }
      this.uploading = true
      this.$axios
        .post(this.importUrl, this.resultArray)
        .then(response => {
          if (response.data.payload.code == 406) {
            let payload = response.data.payload
            payload.result.forEach((item, index) => {
              item.id = index + 1
            })
            this.errorLength = payload.errorNum
            this.totalLength = payload.total
            this.$refs.upload.clearFiles()
            this.tableData = payload.result
            this.resultArray = []
            this.dialogVisible = true
            this.importLoading = false
          } else {
            if (response.data.payload.code == 200) {
              this.$refs.dataTable.getList()
              this.openSuccess()
              this.totalLength = response.data.payload.total
            }
          }
          // if (response.data.length > 0) {
          //   this.$refs.upload.clearFiles()
          //   this.resultArray = []
          //   this.importLoading = false
          // } else {
          //   this.openSuccess()
          // }
        })
        .catch(error => {})
        .finally(() => {
          this.uploading = false
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
