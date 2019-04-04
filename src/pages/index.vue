<template>
  <div class="index">
    <img class="home-img" :src="$store.state.meta.homePageImg" alt="homeImg">
  </div>
</template>

<script>
//import fileSaver from 'file-saver'

export default {
  data() {
    return {
      renderInput: [
        {
          $type: 'input',
          $id: 'pageName',
          label: '页面名字(对应路由名字)',
          rules: [{required: true}]
        },
        {
          $type: 'input',
          $id: 'url',
          label: '接口url',
          rules: [{required: true}]
        }
      ],
      renderCheckbox: [
        {
          $type: 'checkbox',
          $id: 'hasNew',
          label: '新增',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'hasEdit',
          label: '修改',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'hasDelete',
          label: '删除',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'hasSelect',
          label: '是否有选择(多选)',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'single',
          label: '是否单选(上一项必须勾选才生效)',
          $default: false
        },
        {
          $type: 'checkbox',
          $id: 'hasPagination',
          label: '是否分页',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'hasOperation',
          label: '是否有操作列',
          $default: true
        },
        {
          $type: 'checkbox',
          $id: 'isTree',
          label: '是否树形结构',
          $default: false
        }
      ],
      searchForm: [],
      extraButtons: [],
      columns: [],
      form: [],
      query: {}
    }
  },
  methods: {
    addColumn() {
      this.columns.push({
        prop: '',
        label: ''
      })
    },
    addBtn() {
      this.extraButtons.push({
        text: '',
        onClick: ''
      })
    },
    addSearch() {
      this.searchForm.push({
        $type: 'input',
        $id: '',
        label: '',
        $el: {
          placeholder: '请输入'
        }
      })
    },
    generate() {
      //      let host = 'levy.ren'
      let host = 'localhost'

      let api = `http://${host}:30000/generator/data-table`

      if (!this.columns.length) return alert('至少有一个列')

      this.$refs.renderInput.validate(valid => {
        if (!valid) return

        this.$refs.renderCheckbox.validate(valid => {
          if (!valid) return
        })

        let extraButtons = this.extraButtons.map(btn => ({
          text: btn.text,
          type: btn.type,
          atClick: `row => ${btn.onClick}`
        }))

        let data = Object.assign(
          {},
          this.$refs.renderInput.getFormValue(),
          this.$refs.renderCheckbox.getFormValue()
        )

        Object.keys(this.$data).forEach(key => {
          // renderxxx 不传给接口
          if (key.indexOf('render') > -1) return
          data[key] = this[key]
        })

        // 参数判断
        if (data.hasSelect && data.columns[0].type !== 'selection')
          data.columns.unshift({type: 'selection'})

        this.$axios.$post(api, data).then(resp => {
          console.log(resp)

          let file = new File([resp], data.pageName + '.vue', {
            type: 'text/plain;charset=utf-8'
          })
          fileSaver.saveAs(file)
        })
      })
    }
  }
}
</script>
<style lang="stylus">
  .index {
    .home-img {
      width 100%
    }
  }
</style>
