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
  REJECTED: '已拒绝',
  UNDER_REVIEW: '审核中',
  CONFIRM_REFUND: '确认退款',
  CANCEL: '取消',
  RETURNING: '退货中',
  CONFIRM_RETURN: '确认退货',
  FAILED_REVIEW: '审核失败'
}
export const searchForm = [
  {
    $el: {
      placeholder: '请输入'
    },
    label: '售后申请编号',
    $id: 'refundOrderId',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '订单编号',
    $id: 'tradeOrderId',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '会员账号',
    $id: 'memberName',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '商品来源',
    $id: 'source',
    $type: 'select',
    $options: [
      {
        label: '我买网',
        value: 0
      },
      {
        label: '自营',
        value: 1
      }
    ]
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '售后类型',
    $id: 'refundTypeCode',
    $type: 'select',
    $options: [
      {
        label: '退款',
        value: 1
      },
      {
        label: '退货',
        value: 3
      }
    ]
  }
]
export const columns = [
  {
    prop: 'id',
    label: '售后申请单号',
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'tradeOrderId',
    label: '订单编号',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'source',
    label: '商品来源',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'memberName',
    label: '会员账号',
    showOverflowTooltip: true
  },
  {
    prop: 'refundTypeName',
    label: '售后类型'
  },
  {
    prop: 'refundMoney',
    label: '退款总金额',
    minWidth: 100
  },
  {
    prop: 'createdAt',
    label: '退款申请时间',
    formatter: format.dateTime,
    minWidth: 160,
    showOverflowTooltip: true
  },
  {
    prop: 'status',
    label: '订单状态'
    // formatter: row => statusOpts[row.status]
  }
]
