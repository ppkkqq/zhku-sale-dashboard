<template>
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
</template>

<script>
import XLSX from 'xlsx'
import {Upload} from 'element-ui'

export default {
  data() {
    return {
      fileList: [],
      fileitem: {},
      response: {},
      token: this.$store.state.token,
      xlsxJson: [],
      resultArray: [],
      leadingIn: '导入excel表格',
      loading: false
    }
  },
  components: {
    'el-upload': Upload
  },

  computed: {
    url() {
      return (
        '/pmsX-api/api/v1/admin/manhours/manhourbacktrack?token=' + this.token
      )
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
          const data = e.target.result
          let wb = XLSX.read(data, {
            type: 'binary'
          })
          let result = []
          let resuleChange
          wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              // sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
              sheet: XLSX.utils.sheet_to_asv(wb.Sheets[sheetName])
            })
          })
          console.log(wb)
          console.log(result)
          result.forEach((value, index) => {
            if (result[index].sheet.length > 0) {
              result[index].sheet.forEach((Ovalue, Oindex) => {
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
