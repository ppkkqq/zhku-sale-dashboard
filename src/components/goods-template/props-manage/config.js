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
    NEW_CARS: [
      {
        label: '指导价',
        prop: 'guidePrice',
        type: 'price'
      },
      {
        label: '优惠价',
        prop: 'preferentialPrice',
        type: 'price'
      }
    ],
    FINANCE: [
      {
        label: '服务费',
        prop: 'preferentialPrice',
        type: 'price'
      },
      {
        label: '物料编码',
        prop: 'materialCode'
      }
    ],
    BOUTIQUE: [
      {
        label: '指导价',
        prop: 'guidePrice',
        type: 'price'
      },
      {
        label: '优惠价',
        prop: 'preferentialPrice',
        type: 'price'
      },
      {
        label: '套餐价',
        prop: 'packagePrice',
        type: 'price'
      },
      {
        label: '物料编码',
        prop: 'materialCode'
      }
    ],
    UNKEEP: [
      {
        label: '价格',
        prop: 'preferentialPrice',
        type: 'price'
      },
      {
        label: '物料编码',
        prop: 'materialCode'
      }
    ],
    SERVICE: [
      {
        label: '价格',
        prop: 'preferentialPrice',
        type: 'price'
      },
      {
        label: '物料编码',
        prop: 'materialCode'
      }
    ],
    INSURANCE: [
      {
        label: '物料编码',
        prop: 'materialCode'
      },
      {
        label: '价格',
        prop: 'preferentialPrice',
        type: 'price'
      }
    ],
    MANHOUR: [
      {
        label: '价格',
        prop: 'preferentialPrice',
        type: 'price'
      },
      {
        label: '物料编码',
        prop: 'materialCode'
      }
    ]
  },
  fixedColumns: {
    combo: [
      {
        label: '属性组',
        prop: 'groupName'
      },
      {
        label: '属性名',
        prop: 'propName'
      },
      {
        label: '属性值',
        prop: 'propValue'
      }
    ],
    goods: [
      {
        label: '属性组',
        prop: 'groupName'
      },
      {
        label: '属性名',
        prop: 'propName'
      },
      {
        label: '属性值',
        prop: 'propValue'
      },
      {
        label: '属性类型',
        prop: 'type'
      }
    ]
  }
}
