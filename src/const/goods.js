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

export const tplStatus = {
  ENABLE: '启用',
  DISABLE: '禁用'
}

export const channel = {
  1: '我买网',
  4: '京东',
  2: '自营'
}
