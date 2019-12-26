<template>
  <div>
    <div class="show" v-if="myFilename==''">
      <el-row>
        <el-col :span="3">
         <!-- <el-button icon="upload" :plain="true" type="info" class="posBtn"><span>上传附件</span>
            <input type="file" id="upload" accept="image" @change="upload" >
          </el-button>-->
          <div class="posBtn1">
            <i class="el-icon-upload"></i>
            <span>上传附件</span>
            <input type="file" id="upload1" accept="image" @change="upload" alt="" title="">
          </div>
        </el-col>
        <el-col :span="10">
          <span>{{msg}}</span>
        </el-col>
      </el-row>
    </div>
    <div v-else="myFilename!=''">
      <el-row type="">
        <el-col :span="6">
          <img width="100px" height="80px" :src="myFileAbsolutePath" alt="">
        </el-col>
        <el-col :span="4">
          <el-button type="danger" size="small" @click="delImg()">删除<i class="el-icon-delete el-icon--right"></i></el-button>
        </el-col>

      </el-row>

    </div>

    <!-- 对话框 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span class="error">{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import * as API from '../../store/api'
  import * as TOOLS from '../../assets/js/tools'
  export default{
    props: ['filename'],
    data () {
      return {
        dialogVisible: false,
        msg: '上传的图片大小不能超过5M',
        headerImage: '',
        picValue: '',
        myFilename: this.filename, // ①创建props属性filename的副本--myFilename
        myFileAbsolutePath: ''
      }
    },
    watch: {
      filename (val) {
        console.log('val---------->' + val)
        if (val == null) {
          this.myFilename = ''
        } else {
          this.myFilename = val// ②监听外部对props属性filename的变更，并同步到组件内的data属性myFilename中
        }
      },
      myFilename (val) {
        this.myFileAbsolutePath = TOOLS.getDomain() + this.myFilename
        this.$emit('childToFatherTransferEvent', val)// ③组件内对myFilename变更后向外部发送事件通知
      }

    },
    mounted () {
    },
    methods: {
      // 删除文件
      delImg () {
        this.myFilename = ''
        this.$emit('childToFatherTransferEvent', this.myFilename)
      },
      upload (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.picValue = files[0]
        this.imgPreview(this.picValue)
      },
      imgPreview (file) {
        let self = this
        // 看支持不支持FileReader
        if (!file || !window.FileReader) return
        let FILE_MAX = 5 * 1024 * 1024
        if (file.size > FILE_MAX) {
          this.dialogVisible = true
          return
        }
        if (/^image/.test(file.type)) {
          // 创建一个reader
          let reader = new FileReader()
          // 将图片将转成 base64 格式
          reader.readAsDataURL(file)

          //           读取文件成功后的回调
          reader.onloadend = function () {
            let result = this.result
            var newres = result.substr(result.indexOf(',') + 1)// 截取base64字符串部分
            //            self.postImg(newres,file.type.split('/')[1]);
            self.postImg(newres, file.type)
            self.headerImage = this.result
          }
        }
      },
      postImg (result, fileType) {
      //          console.log("result-------------->"+result)
      //          console.log("fileType-------------->"+fileType)
        // 这里写接口
        API.$updataPic({'fileType': fileType, 'base64': result}, res => {
          if (res.success) {
            this.myFilename = res.data.filePath
            this.myFileAbsolutePath = TOOLS.getDomain() + this.myFilename
            this.$emit('childToFatherTransferEvent', this.myFilename)
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .error{
    color:#ff4949;
  }
  .show {
    width: auto;
    height:auto;
    border-radius: 5px;
  /*  .posBtn{
      display: flex;
      width: auto;
      height:auto;
      overflow: hidden;
    }
    .posBtn>span{
      position: relative;
      overflow: hidden;
    }
    #upload{
      position: absolute;
      font-size: 0;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      height: 400%;
      cursor: pointer;
      border: none;
      transform: scale(.2) translate(-200%, -190%);
    }*/
    .posBtn1{
      background: #fff;
      border: 1px solid #bfcbd9;
      color: #1f2d3d;
      border-radius: 4px;
      text-align: center;
      width: 96px;
      line-height: 30px;
      cursor:pointer ;
      .posBtn1>span{
        position: relative;
        overflow: hidden;
      }
      #upload1{
        position: absolute;
        font-size: 0;
        left: 0;
        top: 0;
        opacity: 0;
        width: 66%;
        height: 400%;
        cursor: pointer;
        border: none;
        transform: scale(.2) translate(-200%, -190%);
      }

    }
    .posBtn1:hover{
      background: #fff;
      border-color: #50bfff;
      color: #50bfff
      /*color: ;*/
    }
  }
   .validate{
     position: absolute;
     top:40px;
     line-height: 1;
     color: #ff4949;
     font-size: 12px;
   }
  .el-button--danger:focus, .el-button--danger:hover {
    background: #ff6d6d;
    border-color: #ff6d6d;
    color: #fff;
  }
</style>
