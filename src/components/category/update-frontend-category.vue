/*
 * @Author: wukunpeng
 * @Date: 2018-08-02 18:19:44
 * @Last Modified by: wukunpeng
 * @Last Modified time: 2018-08-25 21:50:38
 * 用于后台管理页面，类目编辑
 */


<template>
  <el-card class="box-card"
           header="类目编辑">
    <el-form ref="ruleForm"
             :rules="rules"
             :disabled="!hasNodeSelected"
             :model="form"
             label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="类目名称"
                    prop="name">
        <el-input :value="form.name"
                  @input="handleUpdateform('name',$event)"></el-input>
      </el-form-item>
      <el-form-item label="描述"
                    prop="description">
        <el-input :value="form.description"
                  @input="handleUpdateform('description',$event)"></el-input>
      </el-form-item>
      <el-form-item label="图片"
                    prop="description">
        <upload-to-ali accept="image/png, image/jpeg, image/jpg"
                       :compressOptions="{}"
                       v-model="form.displayUrl">
        </upload-to-ali>
        <div class="el-form-item__warning">
          建议尺寸：128*128，仅支持jpg,png格式，图片大小1M以内。
        </div>
      </el-form-item>
      <el-form-item label="是否末级类目"
                    prop="isLeaf">
        <el-radio-group :value="form.isLeaf"
                        :disabled="hasChildren">
          <el-radio label="1"
                    @change="handleUpdateform('isLeaf','1')">是</el-radio>
          <el-radio label="0"
                    @change="handleUpdateform('isLeaf','0')">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="small"
                   @click="submitForm">{{editFormButtonLabel}}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'update-backend-category',
  props: ['form'],
  components: {
    UploadToAli
  },
  data() {
    return {
      rules: {
        name: [{required: true, message: '请输入类目名称', trigger: 'blur'}]
      }
    }
  },
  methods: {
    submitForm() {
      const form = this.ruleForm
      this.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('saveForm', this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleUpdateform(key, value) {
      let data = {}
      data[key] = value
      this.$emit('updateForm', data)
    },
    onUpLoadFile(value, key) {
      this.handleUpdateform(key, value)
    },
    resetForm() {
      this.ruleForm.resetFields()
    }
  },
  computed: {
    hasNodeSelected() {
      return !!this.form.id
    },
    hasChildren() {
      return this.form.children ? this.form.children.length > 0 : false
    },
    ruleForm() {
      return this.$refs['ruleForm']
    },

    editFormButtonLabel() {
      return this.hasNodeSelected ? '保存' : '请选择节点'
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-form-item__warning {
  color: #dcdcdc;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
