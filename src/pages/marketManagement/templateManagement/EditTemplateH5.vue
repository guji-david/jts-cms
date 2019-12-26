<template>
  <div class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--/*配置页面主体*/-->
    <div class="main">
      <!--头部-->
      <div class="tem-header modelForm">
        <el-form :model="modelForm" label-width="200px" ref="modelForm" :rules="headerRules">
          <el-row>
            <el-col :span="20">
              <el-form-item label="输入模板名称：" prop="name">
                <div class="inputWarp">
                  <el-input
                    v-model="modelForm.name"
                  ></el-input>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-button @click="templateNameSaveBtn('modelForm')">保存</el-button>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <el-form-item label="填写模板用于的渠道：" required>
                <el-autocomplete
                  class="scopeSelect"
                  v-model="modelForm.chanelName"
                  :fetch-suggestions="channelPageQuery"
                  placeholder="请输入内容"
                  @select="channelQueryClick"
                ></el-autocomplete>
                <div class="select-err" v-if="tagsLenVisable">
                  请选择渠道
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" class="pLeft200" style="margin-top: -1rem">
              <el-tag
                v-for="tag in tagsList"
                :key="tag.channelName"
                closable
                :hit="true"
                @close="handleClose(tag)"
                class="scopeTag"
              >
                {{tag.channelName}}
              </el-tag>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!--主体-->
      <div class="tem-body">
        <!--左侧-->
        <div class="tem-left">
          <div class="left-head"><span class="head-highLight">* </span> 选择模板中展示的内容模块</div>
          <div class="color-item"
               v-for="(color,index) in list"
               v-dragging="{ item: color, list: list, group: 'color' }"
               @dragstart="dragstartFn(color.name,index)"
               @dragend="dragendFn(index)"
               :key="color.name"
          >
            <el-button plain type="text" v-html="(!color.html ? color.name : iTag )" :class="{itemSpan:color.html}"
                  class="flexSpan"
                  @click="shiftTab(color)"></el-button>
            <el-button @click="tabDel(index)" plain type="text" v-show="!color.html">删除</el-button>
          </div>
          <div class="left-orderSave-btn">
            <el-button style="width: 80%" @click="orderSaveBtn">顺序保存</el-button>
          </div>

          <div class="left-head delZone-head">已删除模板中展示的内容模块</div>

          <div
            class="add-item"
            v-for="(item,index) in delList"
          >
            <el-button plain type="text" class="flexSpan">{{item.name}}</el-button>
            <el-button @click="tabAdd(index)" plain type="text">添加</el-button>
          </div>
          <div class="left-empty">

          </div>
        </div>
        <!--右侧-->
        <div class="tem-right">
          <div class="right-header">
            <el-form :model="modelFormDetailObj" label-width="200px" ref="modelFormDetail":rules="bodyRules">
              <h2 class="right-item-header" v-text="modelFormDetailObj.description"></h2>
              <div v-for="(item,index) in modelFormDetailObj.itemValues">
                <!--<el-form-item :label="item.description" prop="name" v-if="item.type==10" :required="item.required != 10">-->
                  <!--<el-input v-model="item.proValue" style="width: 85%"></el-input>-->
                <!--</el-form-item>-->

                <template v-if="item.name == 'couponUrl'" >
                  <el-form-item label-width="330px" :label="item.description" v-if="item.type==10 && !!( modelFormDetailObj.itemValues[index-1].proValue)" :required="item.required != 10" >
                    <br>
                    <el-input  class="my-el-input" v-model="item.proValue"></el-input>
                  </el-form-item>
                </template>

                <template v-else>
                  <el-form-item :label="item.description" v-if="item.type==10" :required="item.required != 10" >
                    <el-input v-model="item.proValue" style="width: 85%" ></el-input>
                  </el-form-item>
                </template>








                <el-form-item :label="item.description" v-if="item.type==20" :required="item.required != 10">
                  <el-select name="type" :change="changeItemOptions(item.name,index)" v-model="item.proValue">
                    <el-option v-for='x in targetTypeOptions[index]' :value="x.value" :label="x.label" v-if="x.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="item.description" v-if="item.type==21" :required="item.required != 10">
                  <el-radio-group v-model="item.proValue":change="changeRadioOptions(item.name,index)">
                    <el-radio v-for="x in radioOptions[index]":value="x.value" :label="x.label" v-if="x.value"></el-radio>
                  </el-radio-group>

                </el-form-item>

                <el-form-item :label="item.description" v-if="item.type==30" :required="item.required != 10" :key="item.description">
                  <picUploadMulp
                    :index="index"
                    :delshow=false
                    @childToFatherTransferEvent="fatherGetFileFromChild"
                    @delPic="fatherGetFileFromChild"
                    :filename=item.proValue></picUploadMulp>
                </el-form-item>

                <el-form-item :label="item.description" v-if="item.type==41" :required="item.required != 10" :key="item.description">
                  <div class="flexWrap">
                    <template v-for="(x,ind) in item.proValue1">
                      <picUploadMulp
                        :index="x"
                        :delshow=false
                        @childToFatherTransferEvent="fatherGetFileFromChild"
                        @delPic="fatherGetFileFromChild"
                        :filename=x.honorPic></picUploadMulp>
                    </template>
                  </div>
                </el-form-item>


                <div class="right-ShowRedpacket" v-if="item.type==40" :required="item.required != 10">

                  <div class="redpacket-list">
                    <el-table
                      :data="item.proValue1"
                      border
                    >
                      <el-table-column
                        label="红包面值"
                      >
                        <template scope="scope">
                          <div style="margin: 10px 0">
                            <el-input v-model="scope.row.redpacketAmount"></el-input>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="红包描述"
                      >
                        <template scope="scope">
                          <div style="margin: 10px 0">
                            <el-input v-model="scope.row.redpacketDec"></el-input>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="button描述"
                      >
                        <template scope="scope">
                          <div style="margin: 10px 0">
                            <el-input v-model="scope.row.redpacketBtnDec"></el-input>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="链接"
                      >
                        <template scope="scope">
                          <div style="margin: 10px 0">
                            <el-input v-model="scope.row.redpacketLink"></el-input>
                          </div>
                        </template>
                      </el-table-column>

                      <el-table-column
                        label="操作"
                        width="300px"
                      >
                        <template scope="scope">
                          <el-row>
                           <!-- <span> <el-button @click="addAndEdit(scope.row.id,scope.row)" type="text">编辑</el-button></span>-->
                            <span> <el-button @click="removeRedpacket(item,scope.$index)" type="text">删除</el-button></span>
                          </el-row>


                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="redpacket-addBtn">
                    <el-button @click="addAndEdit(0,item.proValue1)" :disabled="(item.proValue1.length>2)"type="primary" >新增红包
                    </el-button>
                  </div>


                </div>

              </div>
              <div class="right-btn">
                <div class="save-itemValue-btn">
                  <el-button type="primary" @click="saveItemValue('modelFormDetail')">保存</el-button>
                 <!-- :disabled="savebtnDisabled" v-loading.fullscreen.lock="fullscreenLoading"-->
                </div>
              </div>
            </el-form>

          </div>


          <!--预览-->
          <div class="viewBtn">
            <el-button class="viewChild" @click="viewTemplate">预 览</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--选择产品-->
    <el-dialog
      title="温馨提示"
      size=""
      width="50%"
      v-model="tipsVisable"
      :show-close="false"
      center>
      <div class="dialog-template">
        <div v-text="tipsMsg"style="width: 400px;height: 60px;"></div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import picUploadMulp from '../../comComponents/pic-upload.vue'

  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'

  export default {
    name: '',
    data () {
      let validateHeader = (rule, value, callback) => {
        if (!value) {
          callback(new Error('模板名称不能为空'))
        } else if (value.length > 20) {
          callback(new Error('模板名称长度不能超过20'))
        } else if (!TOOLS.checkNoSpecialCode(value)) {
          callback(new Error('不能输入特殊符号'))
        } else {
          callback()
        }
      }
      return {
        tipsMsg: '',
        tipsVisable: false,
        type: TOOLS.getProType(this.$route.params.type),

        templateId: TOOLS.getProID(this.$route.params.id), // 当前页面id,
        viewUrl: '',
        breadcrumName: 'H5页配置',
        onceValue: '', // 拖拽的value
        dragIndex: '', // 拖拽的下表
        iTag: '<i class="el-icon-plus"></i>', // 加号标签
        tagsLenVisable: false, // 渠道选择提示
        tagsList: [], // 头部模糊搜索列表
        queryList: [], // 模糊查询数据
        loading: false,
        list: [ ], // 添加列表

        headerRules: {
          name: [
            {required: true, validator: validateHeader, trigger: 'blur'}
          ]
        },
        bodyRules: {
          name: [
            { required: true, message: '不能为空', trigger: 'change blur' },
            {min: 1, max: 10, message: '长度大于50个字符', trigger: 'change blur'}
          ]
        },
        delList: [], // 删除列表
        activeItemId: '', // 右侧当前操作itemId
        modelForm: {// 头部表单数据
          name: TOOLS.getTemplateName(this.$route.params.name) || '',
          chanelName: ''
        },

        modelFormDetailObj: {// 右侧表单数据
          name: ''
        },
        modelFormDetail: {// 右侧表单数据验证数据
          name: ''
        },

        targetTypeOptions: [// 标的展示类别下拉框

        ],
        radioOptions: [// 获取用户信息按钮组

        ],

        templateRedpacketVisable: false, // 新增和编辑红包弹出框

        redpacketObj: {// 红包弹出框对象
          id: 0,
          redpacketAmount: '', // 红包面值
          redpacketDec: '', // 红包描述
          redpacketBtnDec: '', // button描述
          redpacketLink: ''// 链接
        },
        redpacketActiveId: 0// 选中红包id

      }
    },
    components: {
      breadcrumbNav,
      picUploadMulp
    },
    computed: {},
    mounted () {
      if (this.templateId) {
        this.templateEdit()
      } else {
        this.templateInit()
      }

      this.$dragging.$on('dragged', ({value, draged, to}) => {
        if (!draged.html) {
        //          draged.html = '<div class="el-icon-circle-plus"><b style="display:none">' + draged.text + '</b></div>';
          draged.html = 'draged.text'
        }
      })
    },
    methods: {
      tipsMsgCallback (msg) {
        this.tipsMsg = msg
        this.tipsVisable = true
        let _this = this
        setTimeout(function () {
          _this.tipsVisable = false
        }, 1000)
      },
      /* ----------------------------------拖拽事件组-------------------------------------------------------------- */
      // 将选择模板移到删除模板
      tabDel (index) {
        this.delList.push(this.list.splice(index, 1)[0])
      },
      // 将删除模板移到选择模板
      tabAdd (index) {
        this.list.push(this.delList.splice(index, 1)[0])
      },
      // 拖拽开始
      dragstartFn (val, index) {
        this.onceValue = val
        this.dragIndex = index
      },
      // 拖拽结束
      dragendFn (index) {
        this.list[index].html = ''
        this.dragIndex = ''
      },

      /* ----------------------------------左侧模版事件-------------------------------------------------------------- */
      // 模版顺序保存按钮
      orderSaveBtn () {
        let obj = TOOLS.templateItemOder(this.list, this.delList, this.templateId)
        API.$templateItemSave(obj, res => {
          let msg = ''
          if (!res.success) {
            msg = res.resultMsg
          } else {
            msg = '保存成功'
          }
          this.tipsMsgCallback(msg)
        })
      },
      /* ----------------------------------头部模糊查询-------------------------------------------------------------- */
      // tag关闭事件
      handleClose (tag) {
        this.tagsList.splice(this.tagsList.indexOf(tag), 1)
      },
      // 模糊查询
      channelPageQuery (queryString, cb) {
        API.$channelPageQuery({
          pageNo: 1,
          pageSize: 1000,
          name: queryString
        }, res => {
          this.queryList = res.list
          for (let x of this.queryList) {
            x.value = x.name
            x.channelName = x.name
            x.channel = x.source
          }
          let results = queryString ? this.queryList.filter(this.createStateFilter(queryString)) : this.queryList
          cb(results)
        })
      },
      // 下拉框筛选
      createStateFilter (queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      // 模糊查询点击
      channelQueryClick (query) {
        console.log('channelQueryClick', query, this.modelForm)
        this.tagsLenVisable = false
        this.modelForm.chanelName = ''
        if (query) {
          if (TOOLS.identicalItem(this.tagsList, 'channelName', query.channelName)) {
            this.tagsList.push(query)
          }
        }
      },
      // 模板名称和渠道号保存
      templateNameSaveBtn (formName) {
        if (!this.tagsList.length) {
          this.tagsLenVisable = true
          return
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj = {
              'channels': this.tagsList,
              'id': this.templateId,
              'name': this.modelForm.name
            }
            API.$templateNameSave(obj, res => {
              let msg = ''
              if (!res.success) {
                msg = res.resultMsg
              } else {
                msg = '保存成功'
              }
              this.tipsMsgCallback(msg)
            })
          } else {
            console.log(valid)
          }
        })
      },
      /* ----------------------------------头部模糊查询 结束-------------------------------------------------------------- */
      // 模板左侧列表赋值转换公用方法
      comTransList (list, templateId) { // 左侧列表赋值
        for (let x of list) {
          if (x.status == 20) {
            x.html = ''
            this.list.push(x)
          } else {
            this.delList.push(x)
          }
        }
        if (this.list.length) {
          this.activeitemId = this.list[0].id
          this.templateItemValueQuery(this.activeitemId, templateId)
        }
      },
      // 模板初始化(模板id为0调用)
      templateInit () {
        API.$templateInit(this.type, this.modelForm.name, res => {
          if (res.success) {
            let list = res.data.bizItems
            //            this.templateId = res.data.id;
            this.templateId = TOOLS.getProID(res.data.id)
            this.viewUrl = res.data.viewUrl
            this.comTransList(list, this.templateId)
          }
        })
      },
      // 模板属性回显(模板id不为0调用)
      templateEdit () {
        API.$templateEdit(this.templateId, res => {
          if (res.success) {
            let list = res.data.bizItems
            this.modelForm.name = res.data.name
            this.tagsList = res.data.channels
            this.viewUrl = res.data.viewUrl
            this.comTransList(list, this.templateId)
          }
        })
      },

      // 渠道模块属性查询
      templateItemValueQuery (itemId, templateId) { // itemId 模块id templateId 渠道模板id
        API.$templateItemValueQuery(itemId, templateId, res => {
          if (res.success) {
            this.modelFormDetailObj = res.data
          }
        })
      },

      // 获取模板属性下拉选线
      changeItemOptions (itemName, index) {
        this.targetTypeOptions[index] = TOOLS.fetchObj('commonObj')[itemName]
      },
      // 获取模板属性按钮组
      changeRadioOptions (itemName, index) {
        this.radioOptions[index] = TOOLS.fetchObj('commonObj')[itemName]
      },
      // 切换模版
      shiftTab (itemObj) {
        this.activeitemId = itemObj.id
        this.templateItemValueQuery(this.activeitemId, this.templateId)
      },
      /* -------------------------------父组件从子组件获取文件转换方法------------------------------------------------------ */
      // 父组件从子组件获取文件转换方法-荣誉资质--图片删除也在其中实现
      fatherGetFileFromChild (msg) {
//        let picIndex = msg[0]
        let picValue = msg[1]
        this.modelFormDetailObj.itemValues[msg[0]].proValue = picValue
        if (!this.modelFormDetailObj.itemValues[msg[0]].proValue && !!this.modelFormDetailObj.itemValues[2]) {
          if (this.modelFormDetailObj.itemValues[2].description === '图片链接地址：') {
            this.modelFormDetailObj.itemValues[2].proValue = ''
          }
        }
      },

      // 删除红包item
      removeRedpacket (item, index) {
        if (index) {
          item.proValue1.splice(index, 1)
        } else {
          item.proValue1[index].redpacketAmount = ''
          item.proValue1[index].redpacketDec = ''
          item.proValue1[index].redpacketBtnDec = ''
          item.proValue1[index].redpacketLink = ''
        }
      },
      // 新增和编辑按钮
      addAndEdit (id, item) {
        item.push({
          'redpacketAmount': '', // 红包面值
          'redpacketDec': '', // 红包描述
          'redpacketBtnDec': '', // button描述
          'redpacketLink': ''// 链接
        })
      },

      // 渠道模版选项属性值保存及修改
      saveItemValue (formName) {
        this.modelFormDetailObj.itemId = this.activeitemId
        this.$refs[formName].validate((valid) => {
          if (valid) {
            API.$templateItemValueSave(this.modelFormDetailObj, res => {
              let msg = ''
              if (!res.success) {
                msg = res.resultMsg
              } else {
                msg = '保存成功'
              }
              this.tipsMsgCallback(msg)
            })
          } else {
            console.log(valid)
          }
        })
      },
      // 模板预览
      viewTemplate () {
        window.open(this.viewUrl)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "./EditTemplatePublic.less";
</style>
