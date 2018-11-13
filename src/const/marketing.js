import {toOptionsLabel, formatDate, price} from '@/const/filter'

const format = {
  dateTime: (row, column, val) => formatDate(val, 'YYYY-MM-DD HH : mm'),
  money: (row, column, val) => price(val)
}

// export const statusOpts = {
//   WAIT_AUDIT: '待审核',
//   AUDITED: '已审核',
//   REFUNDED: '已退款',
//   REFUNDING: '退款中',
//   REJECTED: '已拒绝',
//   UNDER_REVIEW: '审核中',
//   CONFIRM_REFUND: '确认退款',
//   CANCEL: '取消',
//   RETURNING: '退货中',
//   CONFIRM_RETURN: '确认退货',
//   FAILED_REVIEW: '审核失败'
// }
export const searchForm = [
  {
    $el: {
      placeholder: '请输入'
    },
    label: '活动标题',
    $id: 'refundOrderId',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '活动标题',
    $id: 'source',
    $type: 'select',
    $options: [
      {
        label: '类型一',
        value: 0
      },
      {
        label: '类型二',
        value: 1
      }
    ]
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '活动状态',
    $id: 'refundTypeCode',
    $type: 'select',
    $options: [
      {
        label: '进行中',
        value: 0
      },
      {
        label: '未开始',
        value: 1
      },
      {
        label: '已结束',
        value: 2
      },
      {
        label: '全部',
        value: 3
      }
    ]
  }
]
export const columns = [
  {
    prop: 'id',
    label: '优先级',
    showOverflowTooltip: true
  },
  {
    prop: 'tradeOrderId',
    label: '活动标题',
    // minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'source',
    label: '活动类型',
    // minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'memberName',
    label: '开始时间',
    formatter: format.dateTime
    // showOverflowTooltip: true
  },
  {
    prop: 'refundTypeName',
    formatter: format.dateTime,
    label: '结束时间'
  },
  {
    prop: 'refundMoney',
    label: '活动状态'
    // formatter: row => statusOpts[row.status]
  },
  {
    prop: 'createdAt',
    label: '禁启用',
    // minWidth: 160,
    showOverflowTooltip: true
  }
]
