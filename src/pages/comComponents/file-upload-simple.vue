
<template>
  <div>
    <div class="posBtn1">
      <i class="el-icon-upload"></i>
      <span>上传附件</span>
      <input type="file" id="upload1" accept="image" @change="upload" alt="" title="">
    </div>
    <!--<div>
      <el-button icon="upload" :plain="true" type="info" class="posBtn" >上传附件<input type="file" id="upload" @change="upload" ></el-button>
    </div>-->
    <el-dialog title="提示" v-model="errorVisible" size="tiny">
      <span style="color:#ff4949">请上传后缀名为.csv的文件!!!</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
  export default{
    props: ['isValid'],
    data () {
      return {
        myIsValid: this.isValid, // ①创建props属性filename的副本--myIsValid
        base64: '',
        errorVisible: false
      }
    },
    watch: {
      isValid (val) {
        this.myIsValid = val// ②监听外部对props属性filename的变更，并同步到组件内的data属性myFilename中
      },
      myIsValid (val) {
        if (val) {
          var file = document.getElementById('upload1')
          file.value = '' // 虽然file的value不能设为有字符的值，但是可以设置为空值
          this.filename = ''
          this.$emit('childToFatherTransferEvent', this.filename)// ③组件内对myFilename变更后向外部发送事件通知
        }
      }

    },
    methods: {
      // 上传文件并转换成base64
      upload (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.filename = files[0].name
        // 看支持不支持FileReader
        if (!files[0] || !window.FileReader) return
        if (/^.*\.csv$/.test(files[0].name)) {
          // 创建一个reader
          let reader = new FileReader()
          reader.readAsDataURL(files[0])
          //         读取成功后的回调
          let _this = this// 这里要保存一下指向
          reader.onloadend = function () {
            let result = this.result
            //            console.log(reader);
            let realyBase = result.substr(result.indexOf(',') + 1)
            _this.base = realyBase
            _this.base64 = _this.base
            _this.$emit('childToFatherTransferEvent', [_this.filename, _this.base64])
          }
        } else {
          this.errorVisible = true
        }
      }
    }
  }
</script>
<style scoped lang="less">
 /* .posBtn{
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
     width: 400%;
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
</style>
