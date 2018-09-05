import Tree from './src/tree.vue'
import 'element-ui/lib/theme-chalk/tree.css'

/* istanbul ignore next */
Tree.install = function(Vue) {
  Vue.component(Tree.name, Tree)
}

export default Tree
