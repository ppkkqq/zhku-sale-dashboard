import {pcBrands, carBrandsSeries} from '@/const/api.js'
import {templateType} from '@/const/goods.js'

export const goods = {
  type: templateType
}

export const api = {
  pcBrands,
  carBrandsSeries: carBrandsSeries + '/new/tree'
}
