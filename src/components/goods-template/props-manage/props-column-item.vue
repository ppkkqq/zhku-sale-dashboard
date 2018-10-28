<template>
  <div class="props-columns-item">
    <!-- 属性值选择 -->
    <span v-if="col.prop === 'propValue'" class="prop-value">

      <el-select
        v-if="row.editMode === 'SELECT'"
        multiple
        placeholder="请选择"
        :value="row.propValue && row.propValue.split(',') || []"
        :disabled="isView"
        @change="handleChange">
        <el-option
          v-for="(value, index) in initValue"
          :key="value"
          :label="value"
          :value="value">
        </el-option>
      </el-select>

      <el-input
        v-else
        placeholder="请输入内容"
        :disabled="isView"
        :value="row.propValue"
        @change="inputChange"
      />

      <span class="isRequired" v-if="row.require === 1">*</span>
    </span>

    <!-- 属性类型切换 -->
    <span v-else-if="col.prop === 'attrType'">
      <el-select placeholder="请选择" v-model="row.attrType" @change="handleTypeChange" :disabled="isView || row.editMode === 'INPUT'">
        <el-option
          v-for="(value, key) in attrTypes"
          :key="key"
          :label="value"
          :value="key">
        </el-option>
      </el-select>
    </span>

    <span v-else>{{ row[col.prop] }}</span>
  </div>
</template>
<script>
const attrTypes = {
  base: '基本属性',
  sale: '规格属性'
}
const SALE = 'sale'

export default {
  name: 'PropsColumnItem',
  props: {
    row: Object,
    col: Object,
    skuPropCodes: Object,
    skuGroupOptions: Object,
    isView: Boolean
  },
  data() {
    return {
      attrTypes,
      SALE
    }
  },
  computed: {
    initCode() {
      if (this.col.prop === 'propValue' && this.row.editMode === 'SELECT') {
        return (this.row.initCode && this.row.initCode.split(',')) || []
      }
      return this.row.initCode
    },
    initValue() {
      if (this.col.prop === 'propValue' && this.row.editMode === 'SELECT') {
        return (this.row.initValue && this.row.initValue.split(',')) || []
      }
      return this.row.initValue
    }
  },
  methods: {
    handleChange(value) {
      const row = this.row

      // 规格属性，更新options
      if (row.attrType === SALE) {
        this.skuGroupOptions[row.propName] = value
        this.skuPropCodes[row.propName] = value
          .reduce((con, item) => {
            const index = this.initValue.indexOf(item)
            if (index > -1) {
              con.push(this.initCode[index])
            }
            return con
          }, [])
          .join(',')
      }

      // 对象是引用的，所以直接赋值可以更改父级的值，但是有点乱
      if (value.length > 0) {
        row.propValue = value.join(',')

        // 根据 属性值 对应的 initValue 的索引设置对应的 propCode
        row.propCode = value
          .reduce((con, item) => {
            const index = this.initValue.indexOf(item)
            if (index > -1) {
              con.push(this.initCode[index])
            }
            return con
          }, [])
          .join(',')

        return
      }

      row.propValue = ''
      row.propCode = ''
    },
    inputChange(val) {
      // 英文逗号会造成bug
      this.row.propValue =
        val.indexOf(',') > -1
          ? val.replace(/,/g, '，') // 转成中文的逗号
          : val

      if (this.row.propCode) {
        return
      }
      this.row.propCode = this.row.initCode
    },

    handleTypeChange(value) {
      const row = this.row
      const propName = row.propName
      if (value === 'sale') {
        if (!row.propValue) {
          this.$message.info('请先设置属性值!')
          this.row.attrType = 'base'
          return
        }
        if (this.skuPropCodes[propName]) {
          this.$message.info('不支持添加同名的规格属性!')
          this.row.attrType = 'base'
          return
        }
        this.$emit('addColumn', row)
        return
      } else {
        this.skuPropCodes[propName] = null
      }
      this.$emit('removeColumn', row)
    }
  }
}
</script>
<style lang="stylus">
  .props-columns-item {
    .prop-value {
      display flex
      align-items center
    }
    .el-select {
      flex 1
    }
    .isRequired {
      width 15px
      text-align center
      color red
    }
  }
</style>
