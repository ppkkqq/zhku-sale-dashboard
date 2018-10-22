/**
 * Created by levy on 2018/2/12.
 */
import Vue from 'vue'
import {
  Button,
  Table,
  Pagination,
  TableColumn,
  Notification,
  scrollbar,
  Loading,
  Dialog,
  MessageBox,
  Message,
  Radio,
  RadioGroup,
  Switch,
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  DatePicker,
  Tooltip,
  Container,
  ButtonGroup,
  Main,
  Footer,
  Header,
  Menu,
  Submenu,
  MenuItem,
  Dropdown,
  Card,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Tabs,
  TabPane,
  Tag,
  Steps,
  Step,
  Cascader
} from 'element-ui'
import ElFormRenderer from 'el-form-renderer'
import ElDataTable from 'el-data-table'
import ElUploadToAli from '@/components/el-upload-to-ali'

Vue.prototype.$ELEMENT = {size: 'medium'}

Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Menu)
Vue.use(ButtonGroup)
Vue.use(Submenu)
Vue.use(Card)
Vue.use(MenuItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Header)
// Vue.use(Aside)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Loading.directive)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(scrollbar)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
// Vue.use(Autocomplete)

// steps
Vue.use(Steps)
Vue.use(Step)

Vue.component('el-form-renderer', ElFormRenderer)
Vue.component('el-data-table', ElDataTable)
Vue.component('el-upload-to-ali', ElUploadToAli)

Vue.prototype.$notify = Notification
Vue.$notify = Notification

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

Vue.prototype.$log = console.log.bind(console)
