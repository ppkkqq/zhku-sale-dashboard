<template>
  <div>
    <el-select v-model="carBrandId" placeholder="请选择品牌" :multiple="isMultiple" @change="onBrandChange" :disabled="!isChecked">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="carModelId" placeholder="请选择车系" :multiple="isMultiple" @change="onModelChange" :disabled="!isChecked">
      <el-option
        v-for="item in carModelList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="carSeriesId" placeholder="请选择车型" :multiple="isMultiple" @change="onSeriesChange" :disabled="!isChecked">
      <el-option
        v-for="item in carSeriesList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-checkbox v-if="hasCheckBox" v-model="isChecked" @change="onCheck">取消勾选“适配车型”，即代表通用</el-checkbox>
  </div>
</template>
<script>
export default {
  name: 'RelationCar',
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    hasCheckBox: {
      type: Boolean,
      default: false
    },
    value: Array,
    options: Array
  },
  data() {
    return {
      isChecked: true,

      // carBrandList: [],
      carModelList: [],
      carSeriesList: [],

      carBrandId: '', // 品牌
      carModelId: '', // 车型
      carSeriesId: '' // 车系
    }
  },
  watch: {
    // isMultiple(newVal) {
    //   this.initCarData()
    // },
    value() {
      this.initCarData()
    },
    options() {
      this.initCarData()
    }
  },
  created() {
    this.initCarData()
  },
  methods: {
    initCarData() {
      // 待优化
      const isMultiple = this.isMultiple
      const value = this.value

      const arr = ['carBrandId', 'carModelId', 'carSeriesId']
      arr.forEach((item, index) => {
        this[item] = isMultiple
          ? (value[index] && value[index].split(',')) || []
          : value[index]
      })

      // this.carBrandId =  isMultiple ? (value[0] && value[0].split(',') || []) : value[0]
      // this.carModelId = isMultiple ? (value[1] && value[1].split(',') || []) : value[1]
      // this.carSeriesId = isMultiple ? (value[2] && value[2].split(',') || []) : value[2]

      this.handleChange(this.carBrandId, 'options', 'carModelList', 'children')

      this.handleChange(
        this.carModelId,
        'carModelList',
        'carSeriesList',
        'pcCarModelList'
      )
    },
    handleChange(value, source, target, props) {
      // this.emitChange()

      if (this.isMultiple) {
        this[target] = value.reduce((con, v) => {
          const item = this[source].find(it => it.id === v)
          if (item && item[props]) {
            con = con.concat(item[props])
          }
          return con
        }, [])
        return
      }
      const curBrand = this[source].find(item => item.id === value)
      this[target] = curBrand ? curBrand[props] : []
    },

    onCheck(value) {
      if (!value) {
        // this.initCarData()
        this.carBrandId = []
        this.carModelId = []
        this.carSeriesId = []
        this.emitChange()
      }
    },
    onBrandChange(value) {
      this.carModelId = this.isMultiple ? [] : ''
      this.carSeriesId = this.isMultiple ? [] : ''

      this.emitChange()
      this.handleChange(value, 'options', 'carModelList', 'children')
    },
    onModelChange(value) {
      this.carSeriesId = this.isMultiple ? [] : ''

      this.emitChange()
      this.handleChange(
        value,
        'carModelList',
        'carSeriesList',
        'pcCarModelList'
      )
    },
    onSeriesChange(value) {
      this.emitChange()
    },

    emitChange() {
      this.$emit('input', [this.carBrandId, this.carModelId, this.carSeriesId])
    }
  }
}
</script>
