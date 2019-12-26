<template>
    <div v-html="content"  @input="result" @focus="result" id="editor"><!--@blur="result @input="result" @focus="result" "-->
    </div>
</template>

<script>
import LyEditor from '../../../node_modules/jts-cms-editor/dist/js/jtseditor'
export default {
  props: ['content', 'path'],
  data () {
    return {
      editor: '',
      editorData: ''
    }
  },
  mounted () {
    const editor = new LyEditor('editor')
    // 配置上传图片的地址
    editor.config.uploadImgUrl = '/console/gateway/fileManage/upload'
    editor.config.menus = ['source', '|', 'bold', 'underline', 'italic', 'strikethrough', 'eraser', 'forecolor', 'bgcolor', '|', 'quote', 'fontfamily', 'fontsize', 'head', 'unorderlist', 'orderlist', 'alignleft', 'aligncenter', 'alignright',
      '|', 'link', 'unlink', 'table', 'img', 'video', 'insertcode', '|', 'undo', 'redo', 'fullscreen'
    ]
    // 设置 headers
    editor.config.uploadHeaders = {
      'Access-Control-Allow-Headers': 'X-Requested-With'
    }
    editor.config.uploadImgFileName = 'myFileName'
    //      console.log(file);
    // 隐藏掉插入网络图片功能。该配置，只有在你正确配置了图片上传功能之后才可用。
    //      editor.config.hideLinkImg = true;
    editor.config.uploadImgUrl = this.path
    //       自定义load事件
    editor.config.uploadImgFns.upload = function (file) {
      console.log('file')
      console.log(file)
    }
    // 自定义load事件
    editor.config.uploadImgFns.onload = function (resultText, xhr) {
      // resultText 服务器端返回的text
      // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
      console.log('editor.uploadImgOriginalName------->' + editor.uploadImgOriginalName)
      //        console.log("filename"+uploadImgOriginalName)
      //        console.log(" '上传结束，返回结果为 ' + resultText;"+JSON.parse(resultText).data.filePath);
      //      console.log('originalName' + originalName)

      // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
      var originalName = editor.uploadImgOriginalName || ''
      var responseUrl = window.sessionStorage.domain + JSON.parse(resultText).data.filePath

      // 如果 resultText 是图片的url地址，可以这样插入图片：
      editor.command(null, 'insertHtml', '<img src="' + responseUrl + '" alt="' + originalName + '" style="max-width:100%;"/>')

      // 如果不想要 img 的 max-width 样式，也可以这样插入：
      //         editor.command(null, 'InsertImage', responseUrl);
    }

    // 图片上传成功回调方法---callback是为了在成功后,赋值所使用的,否则会出现先获取地址而得不到图片的问题
    editor.config.fn = function (res, blob, calback) {
      console.log('editor res', res)
      var re = JSON.parse(res)
      var xhr = new XMLHttpRequest()
      xhr.open('put', re.data.url, false)
      xhr.setRequestHeader('x-oss-meta-author', re.data.userId)
      xhr.setRequestHeader('Content-Type', re.data.contentType)
      xhr.send(blob)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('img.src 200')
            calback()
          }
        }
      }
    }
    //      editor.config.vedioFn=function (html) {
    //        console.log(111111111111111111)
    //      }
    editor.create()
    this.editor = editor
    //      editor.value = this.aaa
  },
  methods: {
    result () {
      if (this.editor.$txt) {
        //            console.log(this.editor.$txt.html());
        this.editorData = this.editor.$txt.html()
        this.$emit('input', this.editorData)
      }
    },
    fn (vla) {
      console.log(vla)
    }
  }
}
</script>
<style scoped lang="less">
#editor {
    height: 440px;
}

.wangEditor-container {
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid #CCC;
}
#editor {
    height: 440px;
}
</style>
