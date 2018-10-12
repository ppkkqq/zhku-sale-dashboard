import {toOptionsLabel, formatDate, price} from '@/const/filter'

const format = {
  dateTime: (row, column, val) => formatDate(val, 'YYYY-MM-DD HH : mm'),
  money: (row, column, val) => price(val)
}

export const statusOpts = {
  WAIT_AUDIT: '待审核',
  AUDITED: '已审核',
  REFUNDED: '已退款',
  REFUNDING: '退款中',
  REJECTED: '已拒绝'
}
export const searchForm = [
  {
    $el: {placeholder: '请输入'},
    label: '客户手机号',
    $id: 'memberPhone',
    $type: 'input'
  },
  {
    $el: {placeholder: '请输入'},
    label: '客户姓名',
    $id: 'memberName',
    $type: 'input'
  },
  {
    $el: {placeholder: '请输入'},
    label: '退款单号',
    $id: 'id',
    $type: 'input'
  }
]
export const columns = [
  {
    prop: 'createdAt',
    label: '申请时间',
    formatter: format.dateTime,
    minWidth: 160
  },
  {prop: 'id', label: '退款单号', minWidth: '170'},
  {prop: 'tradeOrderId', label: '订单号', minWidth: '170'},
  {prop: 'memberName', label: '客户姓名'},
  {prop: 'memberPhone', label: '客户手机号', minWidth: 120},
  {prop: 'carName', label: '车型', minWidth: '260'},
  {
    prop: 'payMoney',
    label: '支付金额',
    formatter: format.money
  },
  {
    prop: 'refundMoney',
    label: '退款金额',
    formatter: format.money
  },
  {prop: 'refundTypeId', label: '退款原因', minWidth: '120'},
  {
    prop: 'status',
    label: '退款状态',
    formatter: row => statusOpts[row.status]
  }
]
