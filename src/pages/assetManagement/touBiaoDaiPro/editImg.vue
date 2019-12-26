<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <div class="imgBox">

      <div class="imgAside">
        <div class="aside-operation">
          <ul>
            <li>选择笔刷 <i class="el-icon-arrow-right"></i></li>

            <li
              v-for="(val,key) in brush"
              @click="mosaicSize(val)"
            ><div :class="[key,activeNum === val?'brushActive':'']"></div></li>

            <li @click="backCanvas">撤销</li>
            <li @click="originCanvas">重置</li>
            <li @click="originImg">查看原图</li>
            <li @click="reDrawCanvas">重新编辑原图</li>
          </ul>
          <div class="save-btn" ><el-button @click="saveCanvas" type="primary">保存</el-button></div>
        </div>


      </div>

      <div class="imgTable" id="canvasBox"></div>

    </div>
  </div>
</template>


<script>
  import * as API from '../../../store/api'
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as TOOLS from '../../../assets/js/tools'
  import * as CANVAS from '../../../assets/js/canvas'
  import { Loading } from 'element-ui'

export default {
    data () {
      return {
        breadcrumName: '审核 !! 附件编辑',
        picUrl: TOOLS.getDomain(),
        imgObj: {
          id: '',
          desc: '',
          doodleUrl: '',
          type: '',
          url: ''
        },
        canvasBox: '', // 储存dom对象
        brush: {'pen-larger': 5, 'pen-middle': 3, 'pen-small': 2}, // 不同笔刷的类名与对应的尺寸
        activeNum: 2// 默认为2/3/5几种尺寸
      }
    },
    components: {
      breadcrumbNav
    },
    computed: {},
    mounted () {
      this.imgObj = TOOLS.fetchObj('editActiveImgObj')
      this.canvasBox = document.getElementById('canvasBox')
      CANVAS.drawCanvas({canvasWidth: 800, sourceImagePath: this.imgObj.doodleUrl ? `${this.picUrl}${this.imgObj.doodleUrl}` : this.imgObj.url, dom: this.canvasBox})
      this.mosaicSize(this.activeNum)
    },
    methods: {
      backCanvas () {
        CANVAS.backCanvas()
      },
      originCanvas () {
        CANVAS.originCanvas()
      },
      originImg () {
        window.open(this.imgObj.url)
      },
      reDrawCanvas () {
        CANVAS.reDrawCanvas(this.canvasBox)
        CANVAS.drawCanvas({canvasWidth: 800, sourceImagePath: this.imgObj.url, dom: this.canvasBox})
      },
      mosaicSize (index) {
        this.activeNum = index
        CANVAS.mosaicSize(index)
      },
      saveCanvas () {
        CANVAS.saveCanvas(document.getElementById('canvas'), 500 * 1024)
          .then(base64 => {
            let loadingInstance = Loading.service({fullscreen: true, lock: true})
            API.$updataPic({'fileType': 'image/jpeg', 'base64': base64}, res => {
              API.$productDoodle({ 'doodleUrl': res.data.filePath, 'id': this.imgObj.id }, res2 => {
                loadingInstance.close()
                if (!res2.success) {
                  TOOLS.msgBox(this, '保存失败，再试一次！')
                } else {
                  TOOLS.msgBox(this, '保存成功！', true, false, () => {
                    this.$router.go(-1)
                  }, '', '', 'text-align:center', '', '确定')
                }
              })
            })
          })
          .catch(err => {
            TOOLS.msgBox(this, '保存失败，再试一次！')
            console.log(err)
          })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "./editImg.less";
</style>
