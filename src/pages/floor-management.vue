<template>
  <el-crud-tree
    ref='tree'
    class="front-end-category"
    :url="url"
    :add-node-button-filter="addNodeButtonFilter"
    :delete-node-button-filter="deleteNodeButtonFilter"
    :change-visible="changeVisible"
    @node-click="handleNodeClick"
    @clear-node="handleClearNode">

    <el-tabs type="border-card">
      <el-tab-pane label="分类详情">
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editForm"
          label-width="100px"
          class="editForm"
        >
          <el-form-item label="节点名称:" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input type="textarea" v-model="editForm.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="updateNode">保存</el-button>
            <el-button type="normal"
                       @click="resetNode">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="子分类新增">
        <el-form
          :model="newForm"
          :rules="newFormRules"
          ref="newForm"
          label-width="100px"
          class="newForm"
        >
          <el-form-item label="节点名称:" prop="name">
            <el-input v-model="newForm.name"></el-input>
          </el-form-item>
          <el-form-item label="图片"
                        prop="displayUrl">
            <upload-to-ali @load="onUpLoadFile($event, 'newForm')"
                           :disabled="!newForm.id"
                           accept="image/png, image/jpeg, image/jpg"
                           :fileUrl="newForm.displayUrl">
            </upload-to-ali>
            <div class="el-form-item__warning">
              建议尺寸：26*34，仅支持png格式，图片大小1M以内。
            </div>
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input type="textarea" v-model="newForm.description"></el-input>
          </el-form-item>
          <el-form-item label="图片"
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

          <el-tree
            :data="config"
            :props="defaultProps"
            show-checkbox
            @check-change="handleCheck"
          ></el-tree>
          <el-form-item>
            <el-button type="primary"
                       @click="addNode">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

  </el-crud-tree>
</template>

<script>
import ElCrudTree from '@/container/el-crud-tree'
import UploadToAli from 'upload-to-ali'
import {
  frontendCatalogBaseUrl,
  backendCatalogBaseUrl,
  bindBackendUrl,
  selectedFilterCondition,
  AllfilterCondition
} from '@/const/api'
import BindBackendCategory from '@/components/category/bind-backend-category'
import BindAttributeFilter from '@/components/category/bind-attribute-filter'
import {Tree} from 'element-ui'
export default {
  name: 'front-end-category',
  components: {
    'el-tree': Tree,
    ElCrudTree,
    UploadToAli,
    BindBackendCategory,
    BindAttributeFilter
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
      config: [
        {
          label: '台式机',
          children: [
            {
              label: 'A系列'
            },
            {
              label: 'M系列',
              children: [{label: 'M1'}, {label: 'M2'}]
            },
            {
              label: 'T系列'
            },
            {
              label: 'W系列'
            },
            {
              label: '惠商专属'
            }
          ]
        },
        {
          label: '一体机',
          children: [
            {
              label: 'S2系列'
            },
            {
              label: 'S3系列'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pageName: 'front-end-category',
      url: frontendCatalogBaseUrl,
      bindBackendUrl: bindBackendUrl,
      backendTree: [],
      editFormRules: {
        name: [{required: true, message: '请输入节点名称', trigger: 'blur'}]
      },
      editForm: {
        name: '',
        description: '',
        isLeaf: '1'
      },
      newFormRules: {
        name: [{required: true, trigger: 'blur', validator: checkName}]
      },
      newForm: {
        name: '',
        description: '',
        isLeaf: '1'
      },

      selectedFilters: [],

      compareData: {} // 点击节点时初始化出数据同editForm，用于判断新增属性是否可点击
    }
  },
  methods: {
    handleCheck(data, props) {
      console.log(1)
    },
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

      // 获取筛选条件
      this.getSelectedFilters()
    },
    handleClearNode() {
      this.editForm = {}
      this.compareData = {}
      this.selectedFilters = []
    },
    changeVisible(val) {
      //弹窗出现或者消失
      this.newForm = {
        name: '',
        description: '',
        isLeaf: '1'
      }
    },
    setNode(data) {
      this.$refs.tree.mergeNode(this.editForm.id, data)
    },
    updateNode() {
      // 新增节点保存成功
      const done = payload => {
        if (payload && payload.id) {
          this.compareData = payload
        }
      }

      this.$refs.editForm.validate(valid => {
        if (valid) {
          const {id, name, description, isLeaf, displayUrl} = this.editForm
          this.$refs.tree.updateNode(
            {
              id,
              name,
              description,
              displayUrl,
              isLeaf
            },
            done
          )
        }
      })
    },
    addNode() {
      this.$refs.newForm.validate(valid => {
        if (valid) {
          this.$refs.tree.addNode({
            ...this.newForm
          })
        }
      })
    },
    resetNode() {
      this.editForm = {...this.compareData}
    },
    //form
    onUpLoadFile(value, key) {
      this.$set(this[key], 'displayUrl', value)
    },
    //detail
    loadBackendTree() {
      this.$axios.$get(`${backendCatalogBaseUrl}/tree`).then(result => {
        this.backendTree = result.payload
      })
    },

    // 获取筛选条件
    async getSelectedFilters() {
      let url = selectedFilterCondition + `?preCategoryId=${this.editForm.id}`

      try {
        let resp = await this.$axios.$get(url)
        let data = resp.payload || []
        this.selectedFilters = data
      } catch (e) {}
    }
  },
  mounted: function() {
    this.loadBackendTree()
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
  },
  watch: {}
}
</script>

<style lang="stylus">
  .front-end-category {
    display: flex;

    .el-form-item__warning {
      color: #dcdcdc;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
    }

    .upload-to-ali {
      text-align: center;

      .upload-img-box {
        display: flex;
        width: 60px;
        height: 60px;

        .upload-img {
          margin: auto;
        }
      }
    }

    .box-card {
      height: 100%;
    }
  }
</style>
