import {MessageBox, Message} from 'element-ui'

export function customConfirm({
  title = '提示',
  message = '确认删除吗',
  cb,
  payload
}) {
  MessageBox.confirm(message, title, {
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm' && cb) {
        instance.confirmButtonLoading = true

        cb(payload)
          .then(result => {
            instance.confirmButtonLoading = false
            done()
          })
          .catch(error => {
            instance.confirmButtonLoading = false
            done()
          })
      } else done()
    }
  }).catch(error => {
    /*取消*/
  })
}
