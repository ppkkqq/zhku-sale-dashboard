<template>
  <div class="store-detail">
    <h2>
      <go-back></go-back>
    </h2>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <el-form label-width="150px" ref="submitForm1" :rules="supplierRules" :disabled="isView" :model="submitForm">
          <el-form-item label="门店编号" prop="code">
            <el-input v-model.trim="submitForm.code" placeholder="请输入" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="门店名称" prop="name">
            <el-input v-model.trim="submitForm.name" placeholder="请输入" maxlength="25"></el-input>
          </el-form-item>
          <el-form-item label="门店简称" prop="aliasName">
            <el-input v-model.trim="submitForm.aliasName" placeholder="请输入" maxlength="25"></el-input>
          </el-form-item>
          <el-form-item label="经营品牌" prop="brandIdList">
            <el-select multiple v-model="submitForm.brandIdList" placeholder="请输入">
              <el-option :label="brand.name" :value="brand.id" v-for="brand in brands" :key="brand.id" :disabled="brand.status === 'forbidden'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经营状态" prop="businessStatus">
            <el-select v-model="submitForm.businessStatus" placeholder="请输入">
              <el-option :label="val" :value="key" v-for="(val, key) in businessStatus" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属地区">
            <area-select type="code" v-model="selected" size="medium" :level=2 :disabled="isView"></area-select>
          </el-form-item>
          <el-form-item label="电话" prop="contactPhone">
            <el-input v-model.trim="submitForm.contactPhone" placeholder="请输入" maxlength="13"></el-input>
          </el-form-item>

          <el-form-item label="门店图片" prop="shopUrl">
            <el-row :span="24" type="flex">
              <simple-upload
                v-model="submitForm.shopUrl"
                :compressOptions="{}"
                :hidden="isView">
                <span class="upload-btn-wrap">
                  <i class="el-icon-plus"></i>
                  <div>上传</div>
                </span>
              </simple-upload>
              <span class="upload-btn-wrap">
                <viewer :src="submitForm.shopUrl"></viewer>
              </span>
            </el-row>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress">
            <el-input v-model.trim="submitForm.detailAddress" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="证照信息" name="second">
        <el-form label-width="150px" ref="submitForm2" :disabled="isView" :model="submitForm" :rules="supplierRules">
          <el-form-item label="社会统一信用代码" prop="shopCompany.socialCreditCo">
            <el-input v-model.trim="submitForm.shopCompany.socialCreditCo" placeholder="请输入" maxlength="18"></el-input>
          </el-form-item>
          <el-form-item label="法人身份证号" prop="shopCompany.legalPersonIDCard">
            <el-input v-model.trim="submitForm.shopCompany.legalPersonIDCard" placeholder="请输入" maxlength="18"></el-input>
          </el-form-item>
          <el-form-item label="法人姓名" prop="shopCompany.legalPerson">
            <el-input v-model.trim="submitForm.shopCompany.legalPerson" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="税务登记号" prop="shopCompany.taxRegistrNum">
            <el-input v-model.trim="submitForm.shopCompany.taxRegistrNum" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item>
            <span slot="label"><span class="red">*</span> 营业执照</span>
            <el-row :span="24" type="flex">
              <simple-upload
                v-model="submitForm.shopCompany.businessLicenseUrl"
                :compressOptions="{}"
                :hidden="isView">
                <span class="upload-btn-wrap">
                  <i class="el-icon-plus"></i>
                  <div>上传</div>
                </span>
              </simple-upload>
              <span class="upload-btn-wrap">
                <viewer :src="submitForm.shopCompany.businessLicenseUrl"></viewer>
              </span>
            </el-row>
          </el-form-item>

          <el-form-item>
            <span slot="label"><span class="red">*</span> 社会统一信用代码证</span>
            <el-row :span="24" type="flex">
              <simple-upload
                v-model="submitForm.shopCompany.socialCreditCoUrl"
                :hidden="isView"
                :compressOptions="{}">
                <span class="upload-btn-wrap">
                  <i class="el-icon-plus"></i>
                  <div>上传</div>
                </span>
              </simple-upload>
              <span class="upload-btn-wrap">
                <viewer :src="submitForm.shopCompany.socialCreditCoUrl"></viewer>
              </span>
            </el-row>
          </el-form-item>

          <el-form-item label="企业法人身份证">
            <span slot="label"><span class="red">*</span> 企业法人身份证</span>
            <el-row :span="24" type="flex">
              <simple-upload
                v-model="submitForm.shopCompany.legalPersonIDCardUrl"
                :hidden="isView"
                :compressOptions="{}">
                <span class="upload-btn-wrap">
                  <i class="el-icon-plus"></i>
                  <div>上传</div>
                </span>
              </simple-upload>
              <span class="upload-btn-wrap">
                <viewer :src="submitForm.shopCompany.legalPersonIDCardUrl"></viewer>
              </span>
            </el-row>
          </el-form-item>

          <el-form-item label="合同">
            <span slot="label"><span class="red">*</span> 合同</span>
            <el-row :span="24" type="flex">
              <simple-upload
                v-model="submitForm.shopCompany.contractUrl"
                :hidden="isView"
                :compressOptions="{}">
                <span class="upload-btn-wrap">
                  <i class="el-icon-plus"></i>
                  <div>上传</div>
                </span>
              </simple-upload>
              <span class="upload-btn-wrap">
                <viewer :src="submitForm.shopCompany.contractUrl"></viewer>
              </span>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="账号信息" name="third">
        <el-form label-width="150px" ref="submitForm3" :disabled="isView" :model="submitForm" :rules="supplierRules">
          <el-form-item label="账号" prop="username">
            <el-input v-model="submitForm.username" :disabled="usernameDisbled" placeholder="请输入手机号作为账号" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="submitForm.password" type='password' placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template v-if="!isView">
      <el-button @click="onSummit" :loading="saveLoading" type="primary">保存</el-button>
      <el-button @click="onCancel">取消</el-button>
    </template>
  </div>
</template>

<script>
import viewer from 'viewer'

import SimpleUpload from 'upload-to-ali'
import {AreaSelect} from 'el-area-select'
import GoBack from '@/components/GoBack'
import {shopList, pcBrands} from '@/const/api'
import {businessStatus} from '@/const/store'
import {storeList} from '@/const/path'

import {
  pswPattern,
  telPattern,
  idCardPattern,
  phonePattern,
  socialCreditCodePattern
} from '@/const/pattern'

let phoneValidator = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  let pattern = new RegExp(
    `${telPattern.toString().slice(1, -1)}|${phonePattern
      .toString()
      .slice(1, -1)}`
  )

  if (!pattern.test(value)) {
    callback(new Error('请输入正确的号码'))
  }
  callback()
}

let pwdValidator = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  if (!pswPattern.test(value)) {
    callback(new Error('请输入正确的密码格式（6到16位数字+字母）'))
  }
  callback()
}

export default {
  name: 'storeDetail',
  components: {
    viewer,
    AreaSelect,
    GoBack,
    SimpleUpload
  },
  data() {
    const initForm = {
      name: '', // 供应商名称
      brandIdList: [], //经营品牌列表
      shopUrl: '',
      contactPhone: '', // 电话
      detailAddress: '', // 地址
      username: '', // 账户
      password: '', // 密码
      shopCompany: {
        socialCreditCo: '', // 社会统一信用代码
        legalPersonIDCard: '', // 法人身份证号
        legalPerson: '', // 法人姓名
        taxRegistrNum: '', // 税务登记号
        businessLicenseUrl: '', // 营业执照url
        socialCreditCoUrl: '', // 社会统一信用号url
        legalPersonIDCardUrl: '', // 法人身份证号url
        contractUrl: '' // 合同url
      }
    }

    return {
      saveLoading: false,
      isView: false,
      usernameDisbled: false,
      dialogVisible: false,
      dialogImgUrl: '',
      initForm,
      businessStatus: businessStatus,
      selected: [],
      submitForm: {...initForm},
      activeName: 'first',
      supplierRules: {
        //新增、修改校验规则
        code: [{required: true, message: '请填写门店编码', trigger: 'blur'}],
        name: [{required: true, message: '请填写门店名称', trigger: 'blur'}],
        aliasName: [
          {required: true, message: '请填写门店简称', trigger: 'blur'}
        ],
        brandIdList: [
          {required: true, message: '请选择经营品牌', trigger: 'blur'}
        ],
        businessStatus: [
          {required: true, message: '请选择经营状态', trigger: 'blur'}
        ],
        detailAddress: [
          {required: true, message: '请选择所属地区', trigger: 'blur'}
        ],
        contactPhone: [
          // {required: true, message: '请填写电话', trigger: 'blur'},
          {validator: phoneValidator, trigger: 'blur'}
        ],
        shopUrl: [{required: true, message: '请上传门店图片', trigger: 'blur'}],
        detailAddress: [
          {required: true, message: '请填写地址', trigger: 'blur'}
        ],
        'shopCompany.socialCreditCo': [
          {
            required: true,
            message: '请填写社会统一信用代码',
            trigger: 'blur'
          },
          {
            pattern: socialCreditCodePattern,
            message:
              '社会统一信用代码由十八位的阿拉伯数字或大写英文字母（不使用I、O、Z、S、V）组成',
            trigger: 'blur'
          }
        ],
        'shopCompany.legalPersonIDCard': [
          {
            required: true,
            pattern: idCardPattern,
            message: '请填写法人身份证号',
            trigger: 'blur'
          }
        ],
        'shopCompany.legalPerson': [
          {
            required: true,
            message: '请填写法人姓名',
            trigger: 'blur'
          }
        ],
        'shopCompany.taxRegistrNum': [
          {required: true, message: '请填写税务登记号', trigger: 'blur'}
        ],
        username: [
          {required: true, message: '请填写账号', trigger: 'blur'},
          {validator: phoneValidator, trigger: 'blur'}
        ],
        password: [
          // {required: true, message: '请填写密码', trigger: 'blur'},
          {validator: pwdValidator, trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    if (this.query.id) {
      this.selected.push(
        this.submitForm.proviceCode,
        this.submitForm.cityCode,
        this.submitForm.countryCode
      )
    }

    this.isView = this.query.isView > 0
  },
  mounted() {
    // window.that = this
    if (!this.query.id) {
      this.submitForm = {...this.initForm}
    }
    this.usernameDisbled = this.submitForm.username
      ? this.submitForm.username.length > 0
      : false
  },
  methods: {
    /*
        @func onUpLoadFile
        @desc 前端直传文件成功，通知服务器文件已经上传
        @pamas {obj} res 成功返回对象
      */
    // onUpLoadFile(url, type) {
    //   this.submitForm.shopCompany[type] = url
    // },
    /*
        @func onUploadError
        @desc 前端直传失败
        @pamas {obj} err 失败原因
      */
    onUploadError(err) {
      this.$message({
        type: 'error',
        message: '上传失败，请稍后重试'
      })
    },
    largeImg(url) {
      this.dialogVisible = true
      this.dialogImgUrl = url
    },
    onCancel() {
      this.$router.push(storeList)
    },
    onSummit() {
      if (this.selected.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择省市区'
        })
        return
      }

      this.$refs.submitForm1.validate(valid1 => {
        //校验第一个tab
        if (!valid1) {
          this.activeName = 'first'
          return
        }

        if (this.submitForm.shopCompany.businessLicenseUrl.length === 0) {
          this.activeName = 'second'
          this.$message({
            type: 'warning',
            message: '请上传营业执照'
          })
          return
        }
        if (this.submitForm.shopCompany.socialCreditCoUrl.length === 0) {
          this.activeName = 'second'
          this.$message({
            type: 'warning',
            message: '请上传社会统一信用代码证'
          })
          return
        }
        if (this.submitForm.shopCompany.legalPersonIDCardUrl.length === 0) {
          this.activeName = 'second'
          this.$message({
            type: 'warning',
            message: '请上传企业法人身份证'
          })
          return
        }
        if (this.submitForm.shopCompany.contractUrl.length === 0) {
          this.activeName = 'second'
          this.$message({
            type: 'warning',
            message: '请上传合同'
          })
          return
        }

        this.$refs.submitForm2.validate(valid2 => {
          //校验第二个tab
          if (!valid2) {
            this.activeName = 'second'
            return
          }

          if (!this.usernameDisbled) {
            if (
              (this.submitForm.username && !this.submitForm.password) ||
              (this.submitForm.password && !this.submitForm.username)
            ) {
              this.$message({
                type: 'warning',
                message: '请完整填写账号信息'
              })
              return
            }
          }
          this.$refs.submitForm3.validate(valid3 => {
            //校验第三个tab
            if (!valid3) {
              this.activeName = 'third'
              return
            }

            this.submitForm.proviceCode = this.selected[0]
            this.submitForm.cityCode = this.selected[1]
            this.submitForm.countryCode = this.selected[2]

            if (this.saveLoading) return //loading中，不再请求、
            this.saveLoading = true
            let reqUrl, promise, method
            let id = this.query.id

            if (id) {
              reqUrl = `${shopList}/${id}`
              method = this.$axios.$put
            } else {
              reqUrl = `${shopList}`
              method = this.$axios.$post
            }

            method(reqUrl, this.submitForm)
              .then(resp => {
                this.saveLoading = false
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })

                this.$router.push(storeList)
              })
              .catch(e => {
                this.saveLoading = false
              })
          })
        })
      })
      // if (this.submitForm.shopCompany.businessLicenseUrl.length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请上传营业执照'
      //   })
      //   return
      // }
      // if (this.submitForm.shopCompany.socialCreditCoUrl.length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请上传社会统一信用代码证'
      //   })
      //   return
      // }
      // if (this.submitForm.shopCompany.legalPersonIDCardUrl.length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请上传企业法人身份证'
      //   })
      //   return
      // }
      // if (this.submitForm.shopCompany.contractUrl.length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请上传合同'
      //   })
      //   return
      // }
      //如果新增账号，账号密码必须同时填写
      // if (!this.usernameDisbled) {
      //   if (
      //     (this.submitForm.username && !this.submitForm.password) ||
      //     (this.submitForm.password && !this.submitForm.username)
      //   ) {
      //     this.$message({
      //       type: 'warning',
      //       message: '请完整填写账号信息'
      //     })
      //     return
      //   }
      // }
      // if (this.submitForm.password) {
      //   if (!pswPattern.test(this.submitForm.password)) return
      // }

      // this.submitForm.proviceCode = this.selected[0]
      // this.submitForm.cityCode = this.selected[1]
      // this.submitForm.countryCode = this.selected[2]
      // this.$refs.submitForm.validate(valid => {
      //   if (!valid) {
      //     //没通过校验规则
      //     return
      //   }
      //   if (this.saveLoading) return //loading中，不再请求、
      //   this.saveLoading = true
      //   let reqUrl, promise
      //   let id = this.query.supplierId
      //   this.submitForm.tenantCode = this.$store.state.tenantCode
      //   if (id) {
      //     reqUrl = 'supplierInfo(id)'
      //     promise = this.$axios.$put(reqUrl, this.submitForm)
      //   } else {
      //     reqUrl = `${'suppliers'}`
      //     promise = this.$axios.$post(reqUrl, this.submitForm)
      //   }

      //   promise
      //     .then(resp => {
      //       this.saveLoading = false
      //       this.$message({
      //         type: 'success',
      //         message: '操作成功'
      //       })

      //       let url = 'supplierList'
      //       this.$router.push(url)
      //     })
      //     .catch(e => {
      //       this.saveLoading = false
      //     })
      // })
    }
  },
  async asyncData({app, query}) {
    try {
      let id = query.id
      const promises = [app.$axios.$get(`${pcBrands}?size=999&page=1`)]
      if (id) {
        // 获取供应商信息
        let shopInfoUrl = `${shopList}/${id}`
        promises.push(app.$axios.$get(shopInfoUrl))
      }

      let [brands, showData] = await Promise.all(promises)
      // console.log(showData, brands)
      const obj = {
        brands: brands.payload.content || [],
        query
      }
      if (showData) {
        obj.submitForm = showData.payload
      }

      return obj
    } catch (e) {
      console.log(e)
      return {
        brands: [],
        query
      }
    }
  }
}
</script>
<style lang="stylus">
  .store-detail {
    .area-select-wrap {
      .area-select {
        // margin-bottom: 22px;
      }
    }

    .upload-btn-wrap {
      width: 100px;
      height: 100px;
      color: #ccc;
      border: 1px dashed #ccc;
      line-height: 70px;
      text-align: center;
      font-size: 50px;
      display: block;
      margin-right: 30px;
      cursor: pointer;
      box-sizing: border-box;

      > img {
        width: 100%;
        height: @width;
      }

      div {
        font-size: 16px;
        width: 100%;
        line-height: 1;
      }
    }

    .red {
      color: #f56c6c;
    }
  }
</style>
