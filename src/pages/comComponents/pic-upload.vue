<template>
  <div>
    <div style="padding:20px;">
      <el-tooltip class="item" effect="light" :content="msg" placement="top">
        <div class="show">
          <div class="picture" :style="styleObj"></div>
          <!--<div class="picture" v-if="domains" :style="'backgroundImage:url('+domains+')'"></div>-->
          <!--<div class="picture" v-if="!domains"></div>-->
          <form id="tform" action="" title="">
            <div class="posBtn" v-show="hide">
              <i class="el-icon-upload"></i>
              <span>上传图片</span>
              <input type="file" id="upload" accept="image" onclick="this.form.reset();" @change="upload" alt="" title="">
              <!--<input type="file" id="upload" accept="image" @change="upload" >-->
            </div>
            <!--<input type="file"  accept="image" @change="upload" alt="231" title=""/>-->
          </form>
        </div>
      </el-tooltip>
      <!--<input type="file"  accept="image" @change="upload" alt="231" title=""/>-->
      <div class="BTN marTop20">
        <!--<el-button type="danger" class=" button" @click="delSelf" v-if="delshow"><small>删除类型</small></el-button>-->
        <!--<div class="fivePX"></div>-->
        <el-button type="danger" class=" button" @click="delSelf" v-if="delshow"><small>删除图片</small></el-button>
        <!--↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓这是删除图片路径的↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓-->
        <el-button type="danger" class=" button" @click="delPic" v-else="delshow"><small>删除图片</small></el-button>
      </div>

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
  import * as TOOL from '../../assets/js/tools'
  export default{
    props: ['index', 'delshow', 'filename'],
    data () {
      return {
        picValue: '',
        hide: true,
        url: '',
        headerImage: this.filename || '',
        domains: '',
        msg: '上传的图片大小不能超过5M',
        dialogVisible: false,
        styleObj: {}
      }
    },
    watch: {
      filename (val) {
      //        console.log("val---------->"+val);
        this.headerImage = val// ②监听外部对props属性filename的变更，并同步到组件内的data属性myFilename中
        if (this.headerImage) {
          this.hide = false
        } else {
          this.hide = true
        }
      },
      headerImage (val) {
        if (this.headerImage) {
          this.domains = TOOL.getDomain() + this.headerImage// 这个好像没有用了
          this.styleObj.backgroundImage = "url('" + this.domains + "')"
          this.hide = false
        } else {
          this.domains = ''// 这个好像没有用了
          this.styleObj = {}
          this.hide = true
        }
        //        this.$emit("childToFatherTransferEvent",val);//③组件内对myFilename变更后向外部发送事件通知
        this.$emit('childToFatherTransferEvent', [this.index, val])// ③组件内对myFilename变更后向外部发送事件通知
      }
    },
    mounted () {
      if (this.filename) {
        this.domains = TOOL.getDomain() + this.headerImage// 这个好像没有用了
        this.styleObj.backgroundImage = "url('" + this.domains + "')"
        this.hide = false
      }
    },
    methods: {
      upload (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.picValue = files[0]
        this.imgPreview(this.picValue)
        files = ''
        this.picValue = ''
      },
      imgPreview (file) {
        let self = this
        /* //        let Orientation;
//        console.log(file);
//        console.log(file.name.split('.'));
//        let newDate = Number(new Date());
//        console.log(newDate);
//        file[name] = newDate+file[name];
//        console.log(file.name); */
        // ?????????FileReader
        if (!file || !window.FileReader) return
        let FILE_MAX = 5 * 1024 * 1024
        if (file.size > FILE_MAX) {
          this.dialogVisible = true
          return
        }
        if (/^image/.test(file.type)) {
          // ???????reader
          let reader = new FileReader()
          // ????2????? base64 ???
          reader.readAsDataURL(file)
          //          reader.readAsArrayBuffer(file);
          //           ???????????
          reader.onloadend = function () {
            let result = this.result
            let img = new Image()
            img.src = result

            var newres = result.substr(result.indexOf(',') + 1)// ???base64?????????
            self.postImg(newres, file.type)
          // ?ж?????????100K,???????????????????
          //            if (this.result.length <= (100 * 1024)) {
          // self.headerImage = this.result;
          //              self.postImg(newres);
          //            }else {
          //              img.onload = function () {
          //                let data = self.compress(img,Orientation);
          // self.headerImage = data;
          //                self.postImg(newres);
          //              }
          //            }
          }
        }
      },
      postImg (result, fileType) {
        // ????д???121
        API.$updataPic({'fileType': fileType, 'base64': result}, res => {
          console.log('postImg', res)
          this.headerImage = res.data.filePath
          this.$emit('childToFatherTransferEvent', [this.index, this.headerImage])
          this.hide = false
        })
      },
      /* compress(img,Orientation){
          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext('2d');
          //???canvas
          let tCanvas = document.createElement("canvas");
          let tctx = tCanvas.getContext("2d");
          let initSize = img.src.length;
          let width = img.width;
          let height = img.height;
          //?????????????????????????????????С???400??????
          let ratio;
          if ((ratio = width * height / 4000000) > 1) {
            console.log("????400??????")
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
          } else {
            ratio = 1;
          }
          canvas.width = width;
          canvas.height = height;
          //        ????
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          //????????????100??????????????
          let count;
          if ((count = width * height / 1000000) > 1) {
            console.log("????100W????");
            count = ~~(Math.sqrt(count) + 1); //???????????????
            //            ???????????????
            let nw = ~~(width / count);
            let nh = ~~(height / count);
            tCanvas.width = nw;
            tCanvas.height = nh;
            for (let i = 0; i < count; i++) {
              for (let j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
              }
            }
          } else {
            ctx.drawImage(img, 0, 0, width, height);
          }
          //??????С???ss
          var ndata = canvas.toDataURL('image/jpeg', 0.1);
          console.log('??????' + initSize);
          console.log('?????' + ndata.length);
          console.log('??????' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
          tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
          this.hide=!this.hide;//??????????
          return ndata;
        }, */
      // 删除图片
      delPic () {
        this.picValue = ''
        this.headerImage = ''
        this.$emit('childToFatherTransferEvent', [this.index, this.headerImage])
        this.hide = true
      },
      // 删除自身元素
      delSelf () {
        this.$emit('delSelf', this.index)
      }
    }
  }
</script>
<style scoped lang="less">
  .fivePX{
    width: 5px;
  }
  .button{
    flex: 1;
  }
  .BTN{
    width: 150px;
    display: flex;
    justify-content: space-between;
  }
  .show {
    width: 150px;
    height: 100px;
    overflow: hidden;
    border: 1px solid #d5d5d5;
    position: relative;
    border-radius: 5px;
  }
  .picture {
    width: 150px;
    height: 100px;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .posBtn{
    position: absolute;
    left:50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border:none;
    background: rgba(0,0,0,0);
    cursor: pointer;
    &:hover{
      color:#20A0FF;
    }
  }
  #upload{
    position: absolute;
    font-size: 0;
    right: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .marTop20{
    margin-top: 10px;
  }
  .el-button--danger:focus, .el-button--danger:hover {
    background: #ff6d6d;
    border-color: #ff6d6d;
    color: #fff;
  }
</style>
