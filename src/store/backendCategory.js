import {
  state as commonState,
  mutations,
  actions,
  getters
} from '@/utils/category-module'
import {backendCatalogBaseUrl} from '@/const/api'

const state = commonState(backendCatalogBaseUrl)
export {state, mutations, actions, getters}
