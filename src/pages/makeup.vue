<template>
  <div>
    <el-upload
      ref="upload"
      :on-change="importExcel"
      :action='`${url}`'
      :multiple='false'
      :auto-upload="false"
      :http-request="httpRequest"
      show-file-list
      :on-success='onSuccess'
      :file-list="fileList">
      <el-button slot="trigger" size="small" type="primary" v-loading='loading'>{{leadingIn}}</el-button>
    </el-upload>
    <el-dialog title="错误提示" :visible.sync="dialogVisible"
               >
      <span>上传文件共{{totalLength}}条数据，校验合格{{totalLength-errorLength}}，有{{errorLength}}条数据检验未通过，请修改重新导入！</span>
      <el-table :data="tableData" style="width: 70%">
        <el-table-column
          prop="id"
          label="序号"
          min-width="30">
        </el-table-column>
        <el-table-column
          prop="content"
          label="提示内容"
          min-width="180">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import {Upload} from 'element-ui'
import {emailPattern} from '@/const/pattern'
export default {
  data() {
    return {
      totalLength: 0,
      errorLength: 0,
      fileList: [],
      fileitem: {},
      response: {},
      token: this.$store.state.token,
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
      ]
    }
  },
  components: {
    'el-upload': Upload
  },

  computed: {
    url() {
      return '/mall-deepexi-member-center/api/v1/mcMemberAccounts/importExcel'
    }
  },
  methods: {
    importExcel(file) {
      const types = file.name.split('.')[1]
      this.fileExcel(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          this.xlsxJson = tabJson
        }
        if (this.xlsxJson.length > 0) {
          this.submitUpload()
          this.loading = true
        }
        if (this.tableData.length) {
          // 有错误！！！！
          this.dialogVisible = true
        } else {
          this.loading = true
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
      this.tableData = []
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
              sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
            })
          })
          console.log(wb)
          console.log(result)
          result.forEach((value, index) => {
            if (result[index].sheet.length > 0) {
              result[index].sheet.forEach((Ovalue, Oindex) => {
                let mapKey = {
                  '昵称(20字符以内)': 'nickName',
                  '姓名(20字符以内)': 'realName',
                  '手机号(不可为空)': 'mobile',
                  '性别(男/女)': 'gender',
                  生日: 'birthday',
                  邮箱: 'email'
                }
                resuleChange = Object.keys(Ovalue).reduce((result, key) => {
                  result[mapKey[key]] = Ovalue[key].toString()
                  return result
                }, {})
                resuleChange.birthday = '1990-01-01'
                console.log(resuleChange)
                this.resultArray.push(resuleChange)
              })
            }
          })
          console.log(this.resultArray)
          this.totalLength = this.resultArray.length
          this.errorLength = 0
          this.resultArray.forEach((value, index) => {
            let temp = false
            if (
              (value.nickName && value.nickName.length < 2) ||
              value.nickName.length > 20
            ) {
              this.tableData.push({
                id: this.tableData.length + 1,
                index: index,
                content: '昵称格式不对，昵称长度为2-20个字符'
              })
              temp = true
            }
            if (value.reaLName && value.realName.length > 20) {
              this.tableData.push({
                id: this.tableData.length + 1,
                index: index,
                content: '姓名格式不对，姓名长度最多20个字符'
              })
              temp = true
            }
            if (!/^1[3456789]\d{9}$/.test(value.mobile) || !value.mobile) {
              this.tableData.push({
                id: this.tableData.length + 1,
                index: index,
                content: '手机格式不对'
              })
              temp = true
            }
            if (
              value.gender &&
              value.gender !== '男' &&
              value.gender !== '女'
            ) {
              this.tableData.push({
                id: this.tableData.length + 1,
                index: index,
                content: '性别格式不对，性别只能为男，女'
              })
              temp = true
            }
            if (value.birthday && false) {
              this.tableData.push({
                id: this.tableData.length + 1,
                index: index,
                content: '生日格式不对，生日格式为yyyy-mm-dd'
              })
              temp = true
            }
            if (value.email && !emailPattern.test(value.email)) {
              this.tableData.push({
                id: this.tableData.length + 1,
                index: index,
                content: '邮箱格式不对'
              })
              temp = true
            }
            if (temp) {
              this.errorLength += 1
            }
          })
          console.log(this.resultArray)
          resolve(this.resultArray)
        }
        reader.readAsBinaryString(file.raw)
      })
    },
    httpRequest() {
      // 自定义上传的实现
      this.$axios
        .post(this.url, this.resultArray)
        .then(response => {
          if (response.data.length > 0) {
            this.openSuccess()
            this.$refs.upload.clearFiles()
            this.resultArray = []
            this.loading = false
          }
        })
        .catch(error => {
          if (error.response) {
            this.$refs.upload.clearFiles()
            this.resultArray = []
            this.loading = false
          }
        })
    }
  }
}
</script>
