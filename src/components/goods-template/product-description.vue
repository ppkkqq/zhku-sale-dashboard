<template>
  <div class="product-description">
    <power-quill-editor
      class="power-quill-editor"
      :content="value"
      :disabled="disabled"
      @on-editor-change="onEditorChange" />
  </div>
</template>
<script>
import PowerQuillEditor from 'power-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'ProductDescription',
  props: {
    disabled: Boolean,
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: this.content
    }
  },
  watch: {
    content() {
      this.value = this.content
    }
  },
  components: {
    PowerQuillEditor
  },
  methods: {
    onEditorChange({editor, html, text}) {
      this.value = html
    },
    getValue() {
      return this.value
    }
  }
}
</script>
<style lang="stylus">
  .product-description {
    overflow hidden
    label {
      float left
      line-height 36px
    }
    .power-quill-editor {
      // margin-left 80px
      line-height 1
    }
  }
</style>
