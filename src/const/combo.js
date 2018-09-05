import {status, formatPublishInfo} from './goods'
import {comboStatus, comboSource} from '@/const/config'
//todo:  listColumns  后端还没有提供相关接口  可能全都得改
export const listColumns = [
  {
    prop: 'name',
    label: '套餐名称',
    minWidth: 150,
    'show-overflow-tooltip': true
  },
  {
    prop: 'prdCatalog.name',
    label: '后台类目'
  },
  {
    prop: 'shop.name',
    label: '门店',
    minWidth: 180
  },
  {
    prop: 'type',
    label: '套餐类型',
    formatter: ({type}) => comboType[type ? type.toUpperCase() : '']
  },
  {
    prop: 'source',
    label: '套餐来源',
    minWidth: 100,
    formatter: ({source}) => {
      return comboSource[source]
    }
  },
  {
    prop: 'auditStatus',
    label: '状态',
    formatter: row => comboStatus[row.auditStatus]
  }
  // {
  //   prop: 'update',
  //   label: '更新提示',
  //   formatter: () => '测试字体颜色'
  // }
]

export const searchForm = [
  {
    $el: {
      placeholder: '请输入'
    },
    label: '套餐名称',
    $id: 'name',
    $type: 'input'
  }
]

export const manageListSearchForm = [
  {
    $el: {
      placeholder: '请输入'
    },
    label: '套餐名称',
    $id: 'name',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请选择'
    },
    label: '后台类目',
    $type: 'select',
    $id: 'baseCategory',
    $options: []
  },
  {
    $el: {
      placeholder: '请选择'
    },
    label: '套餐类型',
    $id: 'type',
    $type: 'select',
    $options: []
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '门店',
    $id: 'store',
    $type: 'select',
    $options: []
  }
]

export const manageListolumns = [
  {
    prop: 'name',
    label: '套餐名称',
    'show-overflow-tooltip': true
  },
  {
    prop: 'store',
    label: '门店'
  },
  {
    prop: 'baseCategory',
    label: '后台类目'
  },
  {
    prop: 'type',
    label: '套餐类型'
  },
  {
    prop: 'status',
    label: '上下架信息',
    formatter: formatPublishInfo
  }
]

export const comboType = {
  // STAGE: '金融套餐',
  UNKEEP: '保养套餐',
  SERVICE: '服务套餐',
  MAINTENANCE: '保养项目',
  BOUTIQUE: '精品套餐',
  INSURANCE: '保险套餐'
}

export const tplStatus = {
  ENABLE: '启用',
  DISABLE: '禁用'
}
