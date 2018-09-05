<template>
  <div>
    <span v-if="col.prop === 'propValue'">
      <el-select
        v-if="row.editMode === 'SELECT' && row.initValue && row.initValue.split(',').length > 0"
        multiple
        placeholder="请选择"
        :value="row.propValue && row.propValue.split(',') || []"
        :disabled="isView"
        @change="handleChange">
        <el-option
          v-for="(value, index) in row.initValue.split(',')"
          :key="value"
          :label="value"
          :value="value">
        </el-option>
      </el-select>
      <el-input v-else placeholder="请输入内容" :disabled="isView" v-model="row.propValue" @change="inputChange"></el-input>
    </span>

    <span v-else-if="col.prop === 'type'">
      <el-select placeholder="请选择" v-model="row.type" @change="handleTypeChange" :disabled="isView">
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
  sale: '销售属性'
}
export default {
  name: 'PropsColumnItem',
  props: {
    row: Object,
    col: Object,
    skuPropCodes: Object,
    isView: Boolean
  },
  data() {
    return {
      attrTypes
    }
  },
  methods: {
    handleChange(value) {
      // 对象是引用的，所以直接赋值可以更改父级的值，但是有点乱
      if (value.length > 0) {
        this.row[this.col.prop] = value.join(',')
        if (this.col.prop === 'propValue') {
          const initCode = this.row.initCode.split(',')
          const initValue = this.row.initValue.split(',')
          this.row.propCode = value
            .reduce((con, item) => {
              const index = initValue.findIndex(it => it === item)
              if (index > -1) {
                con.push(initCode[index])
              }
              return con
            }, [])
            .join(',')
        }
        return
      }
      this.row[this.col.prop] = ''
    },
    inputChange(val) {
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
          this.row.type = 'base'
          return
        }
        if (this.skuPropCodes[propName]) {
          this.$message.info('不支持添加同名的销售属性!')
          this.row.type = 'base'
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
