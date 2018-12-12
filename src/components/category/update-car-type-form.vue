<template>
  <el-form ref="form"
           :model="form"
           :rules="rules"
           label-width="80px">
    <el-form-item label="车型名称"
                  prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="编码"
                  prop="code">
      <el-input v-model="form.code"></el-input>
    </el-form-item>
    <el-form-item label="年款">
      <el-select v-model="form.yearStyle"
                 filterable
                 placeholder="请选择">
        <el-option v-for="(item,index) in yearOptions"
                   :key="index"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="图片"
                  prop="logoUrl">
      <upload-to-ali accept="image/png, image/jpeg, image/jpg"
                     :compressOptions="{}"
                     v-model="form.logoUrl">
      </upload-to-ali>
      <div class="el-form-item__warning">
        建议尺寸：128*128，仅支持jpg,png格式，图片大小1M以内。
      </div>
    </el-form-item>

    <el-form-item label="适用业务">
      <el-checkbox-group v-model="form.applyBussiness">
        <el-checkbox label="销售"
                     name="type"></el-checkbox>
        <el-checkbox label="售后"
                     name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="可售性">
      <el-radio-group v-model="form.salability">
        <el-radio label="在售"></el-radio>
        <el-radio label="停售"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import merge from 'lodash/merge'
import UploadToAli from 'upload-to-ali'

import {yearOptions} from '@/const/config.js'
import {checkCode} from '~/utils/validate'

export default {
  name: 'update-car-type-form',
  components: {
    UploadToAli
  },
  props: ['data'],
  data() {
    return {
      form: {
        name: '',
        yearStyle: '',
        applyBussiness: [],
        salability: ''
      },
      rules: {
        name: [{required: true, message: '请输入车型名称', trigger: 'blur'}],
        code: [{required: true, validator: checkCode, trigger: 'blur'}]
      },
      yearOptions
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', {
            ...this.form
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setFormData(form) {
      this.form = Object.assign({applyBussiness: []}, form)
    },
    onUpLoadFile(value) {
      this.$set(this.form, 'logoUrl', value)
    }
  }
}
</script>
