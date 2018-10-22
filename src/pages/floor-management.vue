<template>
  <el-crud-tree ref='tree'
                :url="url"
                :add-node-button-filter="addNodeButtonFilter"
                :delete-node-button-filter="deleteNodeButtonFilter"
                :change-visible="changeVisible"
                @node-click="handleNodeClick"
                @clear-node="handleClearNode">
    <!-- 修改节点 -->
    <el-card class="box-card"
             header="类目编辑">
      <el-form :model="editForm"
               :rules="editFormRules"
               :disabled="!editForm.id"
               ref="editForm"
               label-width="100px"
               class="demo-editForm">
        <el-form-item label="父级节点"
                      prop="name">
          <el-input disabled v-model="editForm.parentName"></el-input>
        </el-form-item>
        <el-form-item label="节点名称"
                      prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述"
                      prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>

        <!--<el-form-item label="是否末级类目"-->
                      <!--prop="isLeaf">-->
          <!--<el-radio-group v-model="editForm.isLeaf"-->
                          <!--:disabled="hasChildren || editForm.hasAttributeGroups">-->
            <!--<el-radio label="1">是</el-radio>-->
            <!--<el-radio label="0">否</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->

        <el-form-item label="分类图标"
                      prop="displayUrl">
          <upload-to-ali @load="onUpLoadFile($event, 'newForm')"
                         :disabled="!newForm.id"
                         accept="image/png, image/jpeg, image/jpg"
                         :fileUrl="newForm.displayUrl">
          </upload-to-ali>
          <!--<div class="el-form-item__warning">-->
            <!--建议尺寸：26*34，仅支持png格式，图片大小1M以内。-->
          <!--</div>-->
        </el-form-item>
        <el-form-item label="广告图"
                      prop="displayUrl">
          <div class="el-form-item__warning">
            建议尺寸：1190*109，显示在楼层底部位置
          </div>
          <upload-to-ali @load="onUpLoadFile($event, 'newForm')"
                         :disabled="!newForm.id"
                         accept="image/png, image/jpeg, image/jpg"
                         :fileUrl="newForm.displayUrl">
          </upload-to-ali>
          <div class="el-form-item__warning">
            建议尺寸：215*605，显示在楼层左侧位置
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="updateNode">保存</el-button>
          <el-button type="normal"
                     @click="resetNode">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 新增节点 -->
    <!--新增子楼层-->
    <!--新增楼层-->
    <template slot="create">
      <el-form :model="newForm"
               :rules="newFormRules"
               ref="newForm"
               label-width="100px">
        <el-form-item label="类目名称"
                      prop="name">
          <el-input v-model="newForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述"
                      prop="description">
          <el-input v-model="newForm.description"></el-input>
        </el-form-item>

        <el-form-item label="是否末级类目"
                      prop="isLeaf">
          <el-radio-group v-model="newForm.isLeaf">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="addNode">保存</el-button>
        </el-form-item>
      </el-form>
    </template>

  </el-crud-tree>
</template>

<script>
import ElCrudTree from '@/container/el-crud-tree'
import AttributeGroupTable from '@/components/category/attribute-group-table'

import {backendCatalogBaseUrl} from '@/const/api'

export default {
  name: 'back-end-category',
  components: {
    ElCrudTree,
    AttributeGroupTable
  },
  data() {
    const checkName = (rule, value, callback) => {
      const tree = this.$refs.tree
      if (!value) {
        callback('请输入节点名称')
      } else if (tree.names.includes(value) && tree.status !== 'updateNode') {
        callback('节点名称已存在')
      } else {
        callback()
      }
    }
    return {
      pageName: 'back-end-category',
      url: backendCatalogBaseUrl,
      editFormRules: {
        name: [{required: true, message: '请输入类目名称', trigger: 'blur'}]
      },
      editForm: {
        name: '',
        description: '',
        isLeaf: '1',
        children: [],
        parentName: ''
      },
      newFormRules: {
        name: [{required: true, trigger: 'blur', validator: checkName}]
      },
      newForm: {
        name: '',
        description: '',
        isLeaf: '1'
      },

      compareData: {}, // 点击节点时初始化出数据同editForm，用于判断新增属性是否可点击
      isRoot: true
    }
  },
  methods: {
    //树形
    addNodeButtonFilter(node, data) {
      return data.isLeaf === '1'
    },
    deleteNodeButtonFilter(node, data) {
      return !node.isLeaf
    },
    handleNodeClick({data, node}) {
      this.editForm = {...data}
      this.compareData = {...data}

      let hasAttributeGroups =
        this.editForm.attributeGroups &&
        this.editForm.attributeGroups.length > 0

      this.$set(this.editForm, 'hasAttributeGroups', hasAttributeGroups)
    },
    handleClearNode() {
      this.editForm = {}
      this.compareData = {}
    },
    changeVisible(val) {
      //弹窗出现或者消失
      this.newForm = {
        parentId: '',
        parentName: '',
        name: '',
        description: '',
        isLeaf: '1'
      }
    },
    //点击保存保存表单是触发
    updateNode() {
      // 新增节点保存成功
      const done = payload => {
        if (payload && payload.id) {
          this.compareData = payload
        }
      }

      this.$refs.editForm.validate(valid => {
        if (valid) {
          const {id, name, description, isLeaf} = this.editForm
          this.$refs.tree.updateNode(
            {
              id,
              name,
              description,
              isLeaf
            },
            done
          )
        }
      })
    },
    resetNode() {
      this.editForm = {...this.compareData}
    },
    setNode(data) {
      if (data.attributeGroups && data.attributeGroups.length > 0) {
        this.$set(this.editForm, 'hasAttributeGroups', true)
      } else {
        this.$set(this.editForm, 'hasAttributeGroups', false)
      }
      this.$refs.tree.mergeNode(this.editForm.id, data)
    },
    addNode() {
      // this.isRoot=true
      this.$refs.newForm.validate(valid => {
        if (valid) {
          const {name, description, isLeaf} = this.newForm
          this.$refs.tree.addNode({
            name,
            description,
            isLeaf
          })
        }
      })
    }
  },
  computed: {
    hasChildren() {
      return (this.editForm.children || []).length > 0
    },

    canAdd() {
      if (this.editForm.isLeaf === '0') {
        return false
      }
      if (this.compareData.isLeaf == 0) {
        return false
      }

      return !!this.editForm.id
    }
  }
}
</script>

<style lang="stylus" scoped>
  .back-end-category {
    display: flex;

    .box-card {
      height: 100%;
    }
  }
</style>
