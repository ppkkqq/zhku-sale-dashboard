<!--
  description: 设置筛选条件
  author: edgar
  created: 2018/9/18 19:27
  email: 15989069487@163.com
 -->
<template>
  <div class="bind-attribute-filter">
    <div style="margin-bottom: 20px">
      <el-button type="primary"
                 @click="handleAdd"
                 :disabled="!canAdd"
                 v-loading="isFetchingAttributes"
                 size="small">添加</el-button>
      <el-button @click="handleClear"
                 :disabled="!canAdd"
                 size="small">清空</el-button>
    </div>
    <div class="selection border">
      <!--展示分组的属性-->
      <el-tag closable
              :key="tag.name"
              v-for="tag in tags"
              :disable-transitions="false"
              @close="handleClose(tag.name)">
        {{tag.name}}
      </el-tag>
    </div>

    <el-dialog
      title="选择筛选条件"
      @open="handleOpen"
      :visible.sync="dialogVisible"
    >
      <!--<div class="header">-->
        <!--<el-input placeholder="输入关键字进行过滤"-->
                  <!--v-model="filterText">-->
        <!--</el-input>-->
      <!--</div>-->
      <el-tree
        class="filter-tree"
        show-checkbox
        v-bind="$attrs"
        :data="treeData"
        :props="props"
        @check="hanldeCheck"
        node-key="name"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :filter-node-method="filterNode"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
           <span>{{ data.name }}</span>
          <el-checkbox
            v-model="checked"
            @change="handleCheckSet(node, data, $event)"
            v-if="(data.name === pageFilter.name) || !pageFilter.type && data.type !== 'MODEL' && showSettingBox && node.isLeaf && data.name === filterName"
          >设为分类页筛选</el-checkbox>
        </span>
      </el-tree>

      <div slot="footer">
        <el-button type="primary"
                   v-loading="isSaving"
                   @click="handleSave">保存</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {Tree} from 'element-ui'
import {
  selectedFilterCondition,
  filterConditions,
  AllfilterCondition
} from '@/const/api'

import uniqBy from 'lodash/uniqBy'

export default {
  name: 'bind-backend-category',
  props: ['hasNodeSelected', 'node', 'canAdd', 'selectedFilters'],
  components: {
    'el-tree': Tree
  },
  data() {
    return {
      props: {
        label: 'name',
        children: 'attributeList',
        disabled: function(data, node) {
          // 禁用属性值为空的属性
          return (
            node.isLeaf &&
            ((data.value && data.value.length === 0) || !data.value)
          )
        }
      },
      isSaving: false,
      isFetchingAttributes: false,
      usePrecategoryId: '',
      dialogVisible: false,
      filterText: '',
      checkedNodes: [],
      checkedKeys: [],
      tags: [],
      treeData: [],
      checked: false,

      filterName: '',
      pageFilter: {} // 分类页筛选
    }
  },
  methods: {
    handleClose(name) {
      this.tags = this.tags.filter(tag => tag.name !== name)
      this.pageFilter = this.tags.find(it => it.type === 'PAGE') || {}

      let data = this.tags.reduce((result, item) => {
        return this.groupInResult(result, item)
      }, [])
      this.__doSave(data)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleClear() {
      this.__doSave([])
    },
    async handleAdd() {
      // 获取该类目下的所有已选属性
      this.isFetchingAttributes = true
      try {
        let resp = await this.$axios.$get(
          AllfilterCondition + `?preCategoryId=${this.node.id}`
        )

        this.isFetchingAttributes = false

        let data = resp.payload || []

        this.treeData = data.map(item => {
          // name作为tree的唯一标识
          item.name = item.groupName

          let attributeList = item.attributeList || []
          attributeList.map(it => {
            // 属性没有groupName的加上所在分组的groupName
            it.groupName = item.groupName
            it.type = item.type
          })

          let uniqName = uniqBy(attributeList, 'name')

          item.attributeList = uniqName
          return item
        })

        this.dialogVisible = true
      } catch (e) {
        this.isFetchingAttributes = false
      }
    },
    handleOpen() {
      this.$nextTick(() => {
        this.checkedNodes = this.$refs.tree.getCheckedNodes()
        this.pageFilter = this.tags.find(it => it.type === 'PAGE') || {}
        if (this.pageFilter.name) {
          this.checked = true
        }
      })
    },

    groupInResult(result, it) {
      let itemInGroup = result
        .filter(v => v.type !== 'PAGE')
        .find(i => i.groupName == it.groupName)
      let item = {...it}
      const delAttr = item => {
        // delete item.type
        delete item.groupName
        delete item.jsonValue
      }

      // 设置为分类筛选页的数据单独一个对象
      const isPageFilter = this.pageFilter.name === item.name

      if (isPageFilter) {
        // 只有一个
        let it = {}
        it.precategoryId = this.node.id
        it.groupName = item.groupName
        it.type = 'PAGE'
        // 需要读取item.type
        delAttr(item)

        it.attributeList = [item] // 分组
        result.push(it)
      } else {
        if (itemInGroup) {
          delAttr(item)
          itemInGroup.attributeList.push(item)
        } else {
          let it = {}
          it.precategoryId = this.node.id
          it.groupName = item.groupName
          it.type = item.type

          // 需要读取item.type
          delAttr(item)

          it.attributeList = [item] // 分组
          result.push(it)
        }
      }

      return result
    },
    __doSave(data) {
      let isEdit = this.selectedFilters && this.selectedFilters.length

      let url = filterConditions,
        method = '$post'

      if (isEdit) {
        url = filterConditions + `/${this.node.id}`
        method = '$put'
      }

      this.isSaving = true

      this.$axios[method](url, data)
        .then(resp => {
          this.dialogVisible = false

          this.isSaving = false
          this.tags = this.flatAttributeList2Tags(data)
        })
        .catch(error => {
          this.isSaving = false
        })
    },
    handleSave() {
      let data = this.leafNodes.reduce((result, item) => {
        return this.groupInResult(result, item)
      }, [])
      this.__doSave(data)
    },
    hanldeCheck(data, props) {
      this.checkedNodes = props.checkedNodes
      this.checkedKeys = props.checkedKeys

      if (this.checkedKeys.indexOf(data.name) > -1) {
        this.filterName = data.name
      } else {
        this.filterName = ''

        if (data.name === this.pageFilter.name) {
          this.pageFilter = {}
          this.checked = false
        }
      }
    },
    handleCheckSet(node, data, e) {
      // console.log(node, data, e)
      if (this.checkedKeys.indexOf(data.name) > -1) {
        this.pageFilter = data
        if (!this.checked) {
          this.pageFilter = {}
          this.filterName = data.name
        }
      } else {
        this.pageFilter = {}
      }
    },

    flatAttributeList2Tags(group) {
      return group.reduce((result, it) => {
        if (it.attributeList) {
          // 加上groupName
          // type
          let attributeList = it.attributeList.map(k => {
            k.groupName = it.groupName
            k.type = it.type || k.type
            return k
          })
          result = [...result, ...attributeList]
        }
        return result
      }, [])
    }
  },
  computed: {
    showSettingBox() {
      return this.checkedKeys.indexOf(this.filterName) > -1
    },
    tree() {
      return this.$refs.tree
    },
    defaultCheckedKeys() {
      return this.tags.map(item => item.name)
    },
    label() {
      const {props = {}} = this.$attrs
      return props.label || 'name'
    },
    leafNodes() {
      return this.checkedNodes.filter(node => {
        return node.value && node.value.length
        // return node.isLeaf === '1'
      })
    }
  },
  watch: {
    filterText(val) {
      this.tree.filter(val)
    },

    selectedFilters(val) {
      if (val) {
        this.tags = this.flatAttributeList2Tags(val)
      } else {
        this.tags = []
      }
    },
    tags(val) {
      if (val && this.$refs.tree) {
        // console.log(val)
        // this.$refs.tree.setCheckedKeys(val.map(node => node.precategoryId))
      }
    },

    dialogVisible(val) {
      if (!val) {
        this.filterName = ''
        this.pageFilter = {}
        this.checked = false // 分类选择框
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .bind-attribute-filter {
    .el-tree {
      max-height 500px
      overflow scroll
    }
  }
.header {
  margin-bottom: 10px;
}

.selection {
  height: 100px;
  padding: 10px 10px;
  overflow: auto;
}

.el-tag {
  margin-left: 10px;
}

.el-tag + .el-tag {
  margin-top: 10px;
}
</style>
