import {Object2Options, formatDate, price} from '@/const/filter'

const format = {
  dateTime: (row, column, val) => formatDate(val, 'YYYY-MM-DD HH : mm'),
  money: (row, column, val) => price(val)
}
export const activityType = {
  0: '预售',
  1: '限时抢购'
}
export const timeType = {
  0: '待开始',
  1: '进行中',
  2: '已结束'
}
export const activityStatus = {
  0: '禁用',
  1: '启用'
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
    $id: 'title',
    $type: 'input'
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '活动类型',
    $id: 'type',
    $type: 'select',
    $options: Object2Options(activityType)
  },
  {
    $el: {
      placeholder: '请输入'
    },
    label: '活动状态',
    $id: 'timeStatus',
    $type: 'select',
    $options: [
      {
        label: '待开始',
        value: 0
      },
      {
        label: '进行中',
        value: 1
      },
      {
        label: '已结束',
        value: 2
      }
    ]
  }
]
export const columns = [
  {
    prop: 'tmaPriority',
    label: '优先级',
    showOverflowTooltip: true
  },
  {
    prop: 'tmaTitle',
    label: '活动标题',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'tmaType',
    label: '活动类型',
    // minWidth: 180,
    showOverflowTooltip: true,
    formatter: row => activityType[row.tmaType]
  },
  {
    prop: 'tmaStartTime',
    label: '开始时间',
    minWidth: 180,
    formatter: format.dateTime
    // showOverflowTooltip: true
  },
  {
    prop: 'tmaEndTime',
    minWidth: 180,
    formatter: format.dateTime,
    label: '结束时间'
  },
  {
    prop: 'tmaTimeStatus',
    label: '活动状态',
    formatter: row => timeType[row.tmaTimeStatus]
  },
  {
    prop: 'tmaStatus',
    label: '禁启用',
    // minWidth: 160,
    showOverflowTooltip: true,
    formatter: row => activityStatus[row.tmaStatus]
  }
]
