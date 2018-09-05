import {formatDate} from '@/const/filter'
import {goodsType, goodsStatus, goodsSource} from '@/const/config'
import {Object2Options} from '@/const/filter'

export const status = {
  draft: '草稿',
  unaudited: '待审核',
  passed: '审核通过',
  rejected: '驳回'
  // canceled: '已取消申请'   没有这个状态，改为草稿
}
export const onelineStatus = {
  on: '上架',
  off: '下架',
  readyOn: '待上架'
}

export const goodsListColumns = [
  {
    prop: 'name',
    label: '商品名称',
    minWidth: 150,
    'show-overflow-tooltip': true
  },
  {
    prop: 'shopName',
    label: '门店',
    minWidth: 180
  },
  {
    prop: 'prdCatalog.name',
    label: '后台类目'
  },
  {
    prop: 'type',
    label: '商品类型',
    formatter: ({type}) => goodsType[type]
  },
  {
    prop: 'source',
    label: '商品来源',
    minWidth: 100,
    formatter: ({source}) => goodsSource[source]
  },
  {
    prop: 'status',
    label: '状态',
    formatter: ({status}) => goodsStatus[status]
  }
  // {
  //   prop: 'update',
  //   label: '更新提示',
  //   //TODO:后端还没有数据  还没有提供字段  此处formatter 供于测试颜色
  //   formatter: () => '测试字体颜色'
  // }
]

export const searchForm = [
  {
    $el: {
      placeholder: '请输入'
    },
    label: '商品名称',
    $id: 'name',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请选择'
    },
    label: '商品类型',
    $id: 'type',
    $type: 'select',
    $options: Object2Options(goodsType)
  }
  // { // 不支持多个status查询，写在slot中了
  //   $el: {
  //     placeholder: '请选择'
  //   },
  //   label: '状态',
  //   $id: 'status',
  //   $type: 'select',
  //   $options: Object2Options(goodsStatus).filter(
  //     it => it.value !== 'draft' && it.value !== 'canceled'
  //   )
  // }
]

export const getOnelineStatus = ({
  allSkuCount,
  offStatusSkuCount,
  onStatusSkuCount
}) => {
  if (onStatusSkuCount > 0) {
    return '上架'
  }
  if (offStatusSkuCount === allSkuCount) {
    return '下架'
  }

  return '待上架'
}

export const formatPublishInfo = ({offStatusSkuCount, onStatusSkuCount}) => {
  return `上架/下架(${onStatusSkuCount}/${offStatusSkuCount})`
}
export const goodsManageColumns = [
  {
    prop: 'name',
    label: '商品名称',
    'show-overflow-tooltip': true
  },
  {
    prop: 'store',
    label: '门店'
  },
  {
    prop: 'prdCatalog.name',
    label: '后台类目'
  },
  {
    prop: 'type',
    label: '商品类型'
  },
  {
    prop: 'status',
    label: '上下架信息',
    formatter: formatPublishInfo
  }
]

export const templateType = {
  NEW_CARS: '新车',
  UNKEEP: '保养',
  BOUTIQUE: '精品',
  SERVICE: '服务',
  INSURANCE: '保险',
  FINANCE: '金融',
  MANHOUR: '工时'
}
export const tplStatus = {
  ENABLE: '启用',
  DISABLE: '禁用'
}
