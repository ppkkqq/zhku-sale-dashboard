import {inputMethods} from '@/const/config'
import {attributes} from '@/const/api'

export const formatter = {
  inputMethods
}

export const api = {
  attributes
}

export const columns = {
  skuColumns: {
    GOODS: [
      // {
      //   label: '指导价',
      //   prop: 'guidePrice',
      //   type: 'price'
      // },
      // {
      //   label: '优惠价',
      //   prop: 'preferentialPrice',
      //   type: 'price'
      // }
    ]
  },
  skuFixedColumns: {
    GOODS: [
      {
        label: '价格',
        prop: 'sellPrice',
        type: 'price'
        // type: 'fixed',
      },
      {
        label: '数量',
        prop: 'stockCount',
        type: 'number'
        // type: 'fixed',
      }
    ]
  },
  fixedColumns: {
    GOODS: [
      {
        label: '属性名',
        prop: 'propName'
      },
      {
        label: '属性值',
        prop: 'propValue',
        minWidth: '150px'
      },
      {
        label: '属性类型',
        prop: 'attrType',
        renderHeader: (h, {column, $index}) => {
          return h('span', {}, [
            column.label,
            h(
              'el-tooltip',
              {
                attrs: {
                  effect: 'dark',
                  content: '规格属性对应客户端商品详情的规格',
                  placement: 'top'
                }
              },
              [
                h('i', {
                  class: 'el-icon-question'
                })
              ]
            )
          ])
        }
      }
    ]
  }
}

export const columnItemConfig = {
  interiorExterior: {
    url: '',
    columns: [],
    hasNew: false,
    hasEdit: false,
    hasDelete: false,
    searchForm: []
  }
}
