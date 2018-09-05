<template>
  <upload-to-ali @load="onUpLoadFile($event)"
                   v-on="$listeners"
                   v-bind="$attrs"
                   :fileUrl="value">
  </upload-to-ali>
</template>

<script>
import UploadToAli from 'upload-to-ali'

export default {
  name: 'el-up-to-ali',
  components: {
    UploadToAli
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    onUpLoadFile(value) {
      this.$emit('input', value)
    }
  }
}
</script>
