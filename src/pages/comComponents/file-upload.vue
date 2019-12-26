<template>
  <div>
    <div class="show" v-if="myFileUrl==''">
      <el-button icon="upload" :plain="true" type="info" class="posBtn"><span>上传附件</span>
        <input type="file" id="upload" accept="image" @change="upload" >
      </el-button>
      <span :class="{'warning':onPass}">{{tips}}</span>
    </div>
    <div v-else="myFileUrl!=''">
      <el-row type="">
        <el-col :span="4">
          <a :href="myFileAbsolutePath"><span v-text="fileName"></span></a>
        </el-col>
        <el-col :span="6">
          <el-button type="danger" size="small" @click="delFile()">删除<i class="el-icon-delete el-icon--right"></i></el-button>
        </el-col>

      </el-row>

    </div>
  </div>
</template>
<script>
  import * as API from '../../store/api'
  import * as TOOLS from '../../assets/js/tools'
  export default{
    props: ['fileUrl', 'fileName', 'tips'],
    data () {
      return {
        myFileUrl: this.fileUrl, // ①创建props属性filename的副本--myFileUrl1111
        myFileAbsolutePath: '',
        fileValue: '',
        onPass: false
      }
    },
    watch: {
      fileUrl (val) {
        this.myFileUrl = val// ②监听外部对props属性filename的变更，并同步到组件内的data属性myFilename中
      },
      myFileUrl (val) {
        this.myFileAbsolutePath = TOOLS.getDomain() + this.myFileUrl
        console.log('this.myFileAbsolutePath--------->' + this.myFileAbsolutePath)
        this.$emit('childToFatherTransferEvent', val)// ③组件内对myFilename变更后向外部发送事件通知
      }
    },

    methods: {
      // 删除文件
      delFile () {
        this.myFileUrl = ''
        this.$emit('childToFatherTransferEvent', this.myFileUrl)
      },
      upload (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.fileValue = files[0]
        this.filePreview(this.fileValue)
      },
      filePreview (file) {
        let self = this
//        let Orientation
        // 看支持不支持FileReader
        if (!file || !window.FileReader) return
        if ((/(^.*\.APK$)|(^.*\.apk$)/).test(file.name)) {
          // 创建一个reader
          let reader = new FileReader()
          reader.readAsDataURL(file)
          //         读取成功后的回调
          reader.onloadend = function () {
            let result = this.result
            let realyBase = result.substr(result.indexOf(',') + 1)
//            去掉 file .type的截取 原为 file.type.split('/')[1]
            self.postFile(realyBase, file.type)
          }
        }
      },
      postFile (result, fileType) {
        // 这里写接口
        API.$updataPic({'fileType': fileType, 'base64': result}, res => {
          if (res.success) {
            this.myFileUrl = res.data.filePath
            this.myFileAbsolutePath = TOOLS.getDomain() + this.myFileUrl
            this.$emit('childToFatherTransferEvent', this.myFileUrl)
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .warning{
    color:#FF4949 ;
  }
  .posBtn{
    position: relative;
    overflow: hidden;
  }
  #upload{
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
  }

</style>
