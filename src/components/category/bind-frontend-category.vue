<!--&lt;!&ndash;-->
<!--/*-->
 <!--* @Author: wukunpeng-->
 <!--* @Date: 2018-08-02 17:33:09-->
 <!--* @Last Modified by: wukunpeng-->
 <!--* @Last Modified time: 2018-09-12 22:36:13-->
 <!--* 用于后台类目管理页面，显示类目属性组-->
 <!--*/-->
 <!--&ndash;&gt;-->
<!--&lt;!&ndash;-->
<!--/mall-deepexi-mall-config-api/api/v1/floor/addItem-->
<!--/mall-deepexi-mall-config-api/api/v1/floor/deleteItem-->
<!--/mall-deepexi-mall-config-api/api/v1/floor/clearItem-->
<!--&ndash;&gt;-->

<!--<template>-->
  <!--<div>-->
    <!--<div style="margin-bottom: 20px">-->
      <!--<el-button type="primary"-->
                 <!--@click="handleAdd"-->
                 <!--:disabled="!canAdd"-->
                 <!--size="small">添加</el-button>-->
      <!--<el-button @click="handleClear"-->
                 <!--:disabled="!canAdd"-->
                 <!--size="small">清空</el-button>-->
    <!--</div>-->
    <!--<div class="selection border">-->
      <!--<el-tag closable-->
              <!--:key="tag.id"-->
              <!--v-for="tag in tags"-->
              <!--:disable-transitions="false"-->
              <!--@close="handleClose(tag.id)"-->
      <!--&gt;-->
        <!--{{tag.name}}-->
      <!--</el-tag>-->
    <!--</div>-->

    <!--<el-dialog title="后台类目"-->
               <!--@open="handleOpen"-->
               <!--append-to-body-->
               <!--:visible.sync="dialogVisible">-->
      <!--<div class="header">-->
        <!--<el-input placeholder="输入关键字进行过滤"-->
                  <!--v-model="filterText">-->
        <!--</el-input>-->
      <!--</div>-->
      <!--<el-tree class="filter-tree"-->
               <!--show-checkbox-->
               <!--v-bind="$attrs"-->
               <!--@check="hanldeCheck"-->
               <!--:props="props"-->
               <!--node-key="id"-->
               <!--:default-checked-keys="checkedKeys"-->
               <!--:filter-node-method="filterNode"-->
               <!--ref="tree">-->
      <!--</el-tree>-->

      <!--<div slot="footer">-->
        <!--<el-button type="primary"-->
                   <!--v-loading="isSaving"-->
                   <!--@click="handleSave">保存</el-button>-->
      <!--</div>-->

    <!--</el-dialog>-->

  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import {Tree} from 'element-ui'-->

  <!--export default {-->
    <!--name: 'bind-frontend-category',-->
    <!--props: ['baseUrl', 'canAdd', 'node'],-->
    <!--components: {-->
      <!--'el-tree': Tree-->
    <!--},-->
    <!--data() {-->
      <!--return {-->
        <!--dialogVisible: false,-->
        <!--isSaving: false,-->
        <!--filterText: '',-->
        <!--checkedNodes: [],-->
        <!--tags: [],-->
        <!--props: {-->
          <!--label: 'name',-->
          <!--children: 'children',-->
          <!--disabled: function(data, node) {-->
            <!--// 禁用为父节点没有子节点的后台类目-->
            <!--return (-->
              <!--data.isLeaf === '0' &&-->
              <!--(!data.children || (data.children && data.children.length === 0))-->
            <!--)-->
          <!--}-->
        <!--}-->
      <!--}-->
    <!--},-->
    <!--methods: {-->
      <!--handleClose(id) {-->
        <!--const ids = this.tags.map(tag => tag.id)-->
        <!--ids.splice(ids.indexOf(id), 1)-->
        <!--// this.$axios-->
        <!--//   .$delete(`${this.baseUrl}/deleteItem?floorId=${floorId}`, {ids})-->
        <!--this.__doSave(ids)-->
      <!--},-->
      <!--filterNode(value, data) {-->
        <!--if (!value) return true-->
        <!--return data.name.indexOf(value) !== -1-->
      <!--},-->
      <!--handleClear() {-->
        <!--// this.__doSave([])-->
        <!--// todo:-->
        <!--// this.$axios-->
        <!--//   .$delete(`${this.baseUrl}/clearItem?floorId=${floorId}`, {ids})-->
      <!--},-->
      <!--handleAdd() {-->
        <!--this.dialogVisible = true-->
      <!--},-->
      <!--handleOpen() {-->
        <!--this.$nextTick(() => {-->
          <!--this.checkedNodes = this.$refs.tree.getCheckedNodes()-->
        <!--})-->
      <!--},-->

      <!--__doSave(ids) {-->
        <!--console.log(this.node.id)-->
        <!--// categoryId-->
        <!--//todo:-->
        <!--console.log({itemIds: ids, floorId: this.node.id})-->
        <!--// this.$axios-->
        <!--//   .$post(`${this.baseUrl}/addItem`, {itemIds:ids,floorId:this.node.id})-->
        <!--//   .then(data => {-->
        <!--//     const {catalogs, precategory} = data.payload-->
        <!--//     this.tags = catalogs || []-->
        <!--//     this.$emit('save', Object.assign({}, precategory, {catalogs}))-->
        <!--//     this.dialogVisible = false-->
        <!--//     this.isSaving = false-->
        <!--//     this.node.catalogs = !!this.tags.length-->
        <!--//   })-->
        <!--//   .catch(error => {-->
        <!--//     this.isSaving = false-->
        <!--//     this.dialogVisible = false-->
        <!--//   })-->
      <!--},-->
      <!--handleSave() {-->
        <!--this.isSaving = true-->
        <!--const ids = this.nodes.map(node => node.id)-->
        <!--this.__doSave(ids)-->
      <!--},-->
      <!--hanldeCheck(data, props) {-->
        <!--this.checkedNodes = props.checkedNodes-->
      <!--}-->
    <!--},-->
    <!--computed: {-->
      <!--tree() {-->
        <!--return this.$refs.tree-->
      <!--},-->
      <!--checkedKeys() {-->
        <!--return this.tags.map(item => item.id)-->
      <!--},-->
      <!--label() {-->
        <!--const {props = {}} = this.$attrs-->
        <!--return props.label || 'name'-->
      <!--},-->
      <!--nodes() {-->
        <!--return this.checkedNodes.filter(node => {-->
          <!--return node.isLeaf === '1'-->
        <!--})-->
      <!--}-->
    <!--},-->
    <!--watch: {-->
      <!--filterText(val) {-->
        <!--this.tree.filter(val)-->
      <!--},-->
      <!--node(val) {-->
        <!--if (val && val.catalogs) {-->
          <!--this.tags = val.catalogs.slice() || []-->
        <!--} else {-->
          <!--this.tags = []-->
        <!--}-->
      <!--},-->
      <!--tags(val) {-->
        <!--if (val && this.$refs.tree) {-->
          <!--this.$refs.tree.setCheckedKeys(val.map(node => node.id))-->
        <!--}-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style lang="stylus" scoped>-->
  <!--.header {-->
    <!--margin-bottom: 10px;-->
  <!--}-->

  <!--.selection {-->
    <!--height: 100px;-->
    <!--padding: 10px 10px;-->
    <!--overflow: auto;-->
  <!--}-->

  <!--.el-tag {-->
    <!--margin-left: 10px;-->
  <!--}-->

  <!--.el-tag + .el-tag {-->
    <!--margin-top: 10px;-->
  <!--}-->
<!--</style>-->