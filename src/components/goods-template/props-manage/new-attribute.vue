<template>
  <div>
    <el-form ref="dialogForm" :model="dialogForm" :rules="rules">
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="dialogForm.name"></el-input>
      </el-form-item>
      <el-form-item label="属性描述" prop="description">
        <el-input v-model="dialogForm.description"></el-input>
      </el-form-item>
      <el-form-item label="输入方式" prop="editMode">
        <el-radio-group v-model="dialogForm.editMode">
          <el-radio label="SELECT">选项输入</el-radio>
          <el-radio label="INPUT">手工输入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否必填" prop="require">
        <el-radio-group v-model="dialogForm.require">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="!hideAttribtesInput" prop>
        <el-table :data="dialogForm.attributeValue" class="table-class">
          <el-table-column label="属性值" prop="value" width="260px">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.value" @blur="onInput" required></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="120px" fixed="right">
            <template slot-scope="scope">
              <el-button v-for="(btn, i) in dialogExtraButtons"
                         v-if="'show' in btn ? btn.show(scope) : true"
                         v-bind="btn" @click="btn.atClick(scope)" :key="i" size="small">{{btn.text}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="text-right">
      <el-button @click="cancel" size="small">取 消</el-button>
      <el-button type="primary" @click="confirm" v-loading="confirmLoading" size="small">保 存</el-button>
    </div>
  </div>
</template>

<script>
import {api} from './config.js'
import cloneDeep from 'lodash/cloneDeep'
const required = {
  1: '是',
  0: '否'
}

const initDialogForm = {
  name: '',
  require: 0,
  description: '',
  editMode: 'SELECT',
  attributeValue: [{value: ''}]
}
export default {
  name: 'NewAttribute',
  data() {
    return {
      row: null,
      hideAttribtesInput: false,
      dialogVisible: false,
      dialogTitle: '新增属性',
      confirmLoading: false,

      dialogExtraButtons: [
        {
          text: '添加',
          type: 'primary',
          show: scope => {
            return scope.$index == this.dialogForm.attributeValue.length - 1
          },
          atClick: scope => {
            this.dialogForm.attributeValue.push({value: ''})
          }
        },
        {
          text: '删除',
          type: 'danger',
          show: scope => {
            return this.dialogForm.attributeValue.length - 1
          },
          atClick: scope => {
            this.dialogForm.attributeValue.splice(scope.$index, 1)
          }
        }
      ],
      rules: {
        name: [
          {
            required: true,
            message: '请输入属性名称',
            trigger: 'blur',
            transform: v => v && v.trim()
          }
        ]
      },
      dialogForm: cloneDeep(initDialogForm)
    }
  },
  watch: {
    'dialogForm.editMode': function(val) {
      if (val === 'INPUT') {
        this.hideAttribtesInput = true
      } else {
        this.hideAttribtesInput = false
      }
    }
  },
  methods: {
    commaTransform(str) {
      if (str) {
        return str.replace(/,/g, '，')
      }
    },
    confirm() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid || !this.validAttributes()) return false

        let attributeValue = this.dialogForm.attributeValue.map(it => {
          it.value = this.commaTransform(it.value)
          return it
        })
        const submit = () => {
          let p
          if (this.row && this.row.id) {
            // 编辑
            p = this.$axios.$put(`${api.attributes}/${this.row.id}`, {
              ...this.dialogForm,
              attributeValue
            })
          } else {
            // 新增
            p = this.$axios.$post(api.attributes, {
              ...this.dialogForm,
              attributeValue
            })
          }

          this.confirmLoading = true
          p
            .then(res => {
              this.$message.success('操作成功')
              this.confirmLoading = false
              this.resetForm()
            })
            .catch(err => {
              console.error(err)
              this.$message.error('操作失败')
              this.confirmLoading = false
            })
        }

        if (this.row && this.row.id) {
          // 编辑
          this.$confirm('修改后将影响引用该属性之处，确认修改?', {
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                done()
                submit()
              } else {
                done()
              }
            }
          }).catch(er => {
            /*取消*/
          })
        } else {
          submit()
        }
      })
    },
    cancel() {
      this.resetForm()
      this.dialogVisible = false
    },
    onInput() {
      this.validAttributes()
    },
    resetForm() {
      this.$refs.dialogForm.resetFields()

      // 重置对象内的对象，
      this.dialogForm.attributeValue = [{value: ''}]
      this.row = null
    },
    validAttributes() {
      let {attributeValue, editMode} = this.dialogForm
      if (editMode === 'SELECT') {
        let hasEmpty = attributeValue.some(it => !it.value)
        if (hasEmpty) {
          this.$message.error('属性值不能为空')
          return false
        }
        return true
      }
      return true
    }
  }
}
</script>
