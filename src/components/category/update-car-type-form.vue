<template>
  <el-form ref="form"
           :model="form"
           :rules="rules"
           label-width="80px">
    <el-form-item label="车型名称"
                  prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="年款">
      <el-select v-model="form.yearStyle"
                 placeholder="请选择活动区域">
        <el-option v-for="(item,index) in yearOptions"
                   :key="index"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
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

import {yearOptions} from '@/const/config.js'

export default {
  name: 'update-car-type-form',
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
        name: [{required: true, message: '请输入车型名称', trigger: 'blur'}]
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
    }
  },
  watch: {
    data(val) {
      this.form = Object.assign({applyBussiness: []}, val)
    }
  }
}
</script>
