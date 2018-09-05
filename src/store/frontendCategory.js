import {
  state as commonState,
  mutations,
  actions,
  getters
} from '@/utils/category-module'
import {frontendCatalogBaseUrl} from '@/const/api'

const state = commonState(frontendCatalogBaseUrl)
export {state, mutations, actions, getters}
