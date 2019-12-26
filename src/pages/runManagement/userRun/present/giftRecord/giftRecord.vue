<template>
  <div class="content-body wrap">
    <h2>发放方式</h2>
    <hr>
    <el-row type="flex" >
      <span>发放类型：</span>
      <el-radio-group v-model="radio" class="marBottom20">
        <el-radio :label="1">批量发放(最多支持10个手机号)</el-radio>
        <el-radio :label="2">导入用户发放</el-radio>
        <el-radio :label="3">所有用户发放</el-radio>
      </el-radio-group>
    </el-row>

    <!--选项一-->
    <el-form v-if="radio==1" label-width="100px" ref="mobileForm" :model="mobileForm" :rules='rules'>
      <el-row >
        <el-col :span="18">
          <div class="z-span-20" >
            <el-form-item
              label="手机号："
              prop="mobiles"
              >
              <el-input type="tel" v-model="mobileForm.mobiles" placeholder="11位手机号之间用逗号隔开,只能查询已存在并且未冻结账户"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="3">
          <el-button @click="mobileQuery">查询</el-button>
        </el-col>
        <el-col :span="3">
          <el-button @click="mobileForm.mobiles=null">清空</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-if="radio==1"
      :data="userMobiletable"
      type="expand"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="50%"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户姓名"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatterDate"
      >
      </el-table-column>
      </el-table>
    <!--选项二-->
    <el-form v-if="radio==2" label-width="100px" ref="fileForm" :model="fileForm" >
      <el-row>
        <div class="z-span-20">
          <el-form-item label="文件名：" >
            <el-col :span="19">
              <el-input type="text" v-model="fileForm.fileName" :disabled="true" placeholder="请上传后缀名为.csv的文件 谢谢!"></el-input>
            </el-col>
            <el-col :span="3" :push="1">
              <el-button icon="upload" :plain="true" type="info" class="posBtn" >上传附件<input type="file" id="upload" @change="upload" ></el-button>
            </el-col>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <!--选项三-->
    <el-row>
      <p v-if="radio==3" class="mar20 textInd">用户列表：所有用户</p>
    </el-row>
    <!--选项三结束-->

    <!--目标用户输入框-->
    <el-form :model="targetform" label-width="100px" :rules="rules" ref="targetform">
      <el-form-item label="目标用户：" prop="targetInp">
        <el-row>
          <el-col :span="10">
            <el-input v-model.trim="targetform.targetInp" @keyup.native="keyUp"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <!--目标用户输入框end-->

    <!--下半页表头-->
    <el-row type="flex" justify="space-between" align="middle">
      <h2>礼品列表</h2>
      <el-button type="primary" @click="alertGiftTable" class="height36">添加礼品</el-button>
    </el-row>
    <hr>
    <!--下半页表头end-->

    <!--下半页表格-->
    <!--下半页小表头-->
      <el-collapse v-model="activeNames">
        <el-collapse-item title="红包" name="1">
        <!--<h3>红包</h3>-->
      <!--</el-row>-->
      <hr>
      <!--下半页小表头end-->
      <!--红包表-->
      <el-table
        fit
        :data="redpacketTableData"
        border
        style="width: 100%">
        <el-table-column
          label="批次号"
        >
          <template scope="scope">
            <span>{{scope.row.batchNo}}{{test}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="红包名称"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          :formatter='moneyFormat'
          label="金额(元)"
        >
        </el-table-column>
        <el-table-column
          prop="validLimit"
          label="有效期（天）"
        >
        </el-table-column>
        <el-table-column
          prop="productType"
          :formatter="formatterProductType"
          label="限投产品类型"
        >
        </el-table-column>
        <el-table-column
          label="起投金额(元)"
        >
          <template scope="props" >
            <div class="table-line" >
              <ul>
                <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.minAmount/100}}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="投资产品最低期限(天)"
        >
          <template scope="props" >
            <div class="table-line" >
              <ul>
                <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.limit}}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="发放数量"
        >
          <template scope="scope">
            <el-input type="text" v-model="totalRedpacketCount[scope.$index]" ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
        >
          <template scope="scope">
            <span> <el-button @click="deleteRedpacketBatchNoRow(scope.$index)" type="text">删除</el-button></span>
          </template>
        </el-table-column>
    </el-table>
      <!--红包表end-->
        </el-collapse-item>

      <!--下半页小表头2-->
        <el-collapse-item title="加息券" name="2">

      <hr>
      <!--下半页小表头2end-->
      <!--加息劵表-->

      <el-table
        fit
        :data="couponTableData"
        border
        style="width: 100%">
        <el-table-column
          label="批次号"
          >
          <template scope="scope">
            <span>{{scope.row.batchNo}}{{test}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="加息券名称"
          >
        </el-table-column>
        <el-table-column
          prop="rate"
          label="加息额度（%）"
          >
        </el-table-column>
        <el-table-column
          prop="validLimit"
          label="有效期（天）"
          >
        </el-table-column>
        <el-table-column
          prop="productType"
          :formatter="formatterProductType"
          label="限投产品类型"
          >
        </el-table-column>
        <el-table-column
          prop="maxRateAmount"
          :formatter='moneyFormat'
          label="最高加息金额（元）"
        >
        </el-table-column>
        <el-table-column
          prop="maxRateLimit"
          label="最高加息天数（天）"
        >
        </el-table-column>
        <el-table-column
          prop="minInvestAmount"
          :formatter='moneyFormat'
          label="最低投资金额（元）"
          >
        </el-table-column>
        <el-table-column
          prop="minInvestLimit"
          label="产品最低期限(天)"
          >
        </el-table-column>
        <el-table-column
          prop=""
          label="发放数量"
        >
          <template scope="scope">
            <el-input type="text" v-model="totalCouponCount[scope.$index]"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          >
          <template scope="scope">
            <span> <el-button @click="deleteCouponBatchNoRow(scope.$index)" type="text">删除</el-button></span>
          </template>
        </el-table-column>
      </el-table>

      <!--加息劵表end-->
      <!--下半页表格end-->
        </el-collapse-item>
      </el-collapse>

    <!--弹出添加礼品-->
    <div v-show="tableHide" class='addGiftBox'>
      <el-tabs v-model="seach" class="seachTab">
        <el-tab-pane label="红包" name="1" ></el-tab-pane>
        <el-tab-pane label="加息券" name="2" ></el-tab-pane>
      </el-tabs>

        <redpacketTap v-show="addHide" :addSaveBtn=addSaveBtn :tableHide=tableHide @childToFatherTransferEvent="fatherGetFileFromChild"></redpacketTap>
        <couponTap v-show="!addHide" :addSaveBtn=addSaveBtn :tableHide=tableHide @childToFatherTransferEvent="fatherGetFileFromChild"></couponTap>

      <el-row :gutter="20">
        <el-col :push="8" :span="3">
          <el-button @click="addGift">添加</el-button>
        </el-col>
        <el-col :span="3" :push="11">
          <el-button @click="addSaveBtn = false;tableHide=false">关闭</el-button>
        </el-col>
      </el-row>
      </div>
    <!--弹出添加礼品end-->

    <!--底部按钮-->
    <div class="footBtn">
      <el-row :gutter="20"  type="flex" justify="center" >
        <el-button type="primary" @click="sendGiftBtn('targetform')" class="el-button el-button--primary marR10">发放奖品</el-button>
        <el-button type="" @click="giftDetailAdd" class="is-plain">取消</el-button>
      </el-row>
    </div>
    <!--发送礼品弹出框-->
    <el-dialog title="发送原因" :visible.sync="dialogFormVisible" customClass="dialog" :before-close="handleClose" >
      <el-form :model="dialogForm">
        <el-form-item>
          <el-input v-model="dialogForm.sendReason" auto-complete="off" focus="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="sendGifts">确 定</el-button>
      </div>
    </el-dialog>
    <!--发送礼品弹出框end-->
    <!--返回状态弹出框-->
    <el-dialog title="" :visible.sync="dialogStateFormVisible" customClass="dialog">
      <el-table
        v-if="loadingShow"
        v-loading="loading"
        style="width: 100%;border: none">
      </el-table>
      <el-form :model="dialogStateForm">
        <el-form-item v-if="dialogStateForm.errorType" label="发送失败">{{dialogStateForm.errorTypeArray[dialogStateForm.errorType]}}</el-form-item>
        <el-form-item v-if="dialogStateForm.errorMsg" label="错误提示">{{dialogStateForm.errorMsg}}</el-form-item>
        <el-form-item v-if="dialogStateForm.sendCount" label="应发数量">{{dialogStateForm.sendCount}}</el-form-item>
        <el-form-item v-if="dialogStateForm.sendCountSuc" label="实发数量">{{dialogStateForm.sendCountSuc}}</el-form-item>
        <el-form-item v-if="dialogStateForm.allSend" label="发放成功">{{dialogStateForm.allSend}}</el-form-item>
        <el-row v-if="dialogStateForm.allSend">
          <p>若向全部用户发放，用户登录后插入数据，实发数据才开始计算</p>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStateForm.errorType || dialogStateForm.errorMsg ? dialogStateFormVisible = false:giftDetailAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!--返回状态弹出框end-->
    <!-- 对话框--错误提示使用 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span style="color: #ff4949">{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->

    <!-- 红包 对话框 -->
    <el-dialog title="提示" v-model="redpacketDialogVisible" size="tiny">
      <span >{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="redpacketDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRedpacketBatchNoRowBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->

    <!-- 加息券 对话框 -->
    <el-dialog title="提示" v-model="couponDialogVisible" size="tiny">
      <span>{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="couponDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteCouponBatchNoRowBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->

    <el-dialog title="提示" v-model="errorVisible" size="tiny">
      <span style="color:#ff4949">请上传后缀名为.csv的文件!!!</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import * as API from '../../../../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'
  import redpacketTap from './redpacketTap'
  import couponTap from './couponTap'

  export default {
    data () {
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else if (!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(value))) {
          callback(new Error('不是完整的11位手机号或者正确的手机号'))
        } else {
          callback()
        }
      }
      return {
        loading: true,
        activeNames: ['1', '2'],
        multipleSelection: [],
        redpacketMultipleSelection: [], // 选择礼物的红包表
        couponMultipleSelection: [], // 选择礼物的加息劵表
        dialogFormVisible: false,
        dialogStateFormVisible: false,
        totalCount: 0,
        totalCount2: 0,
        currentPage: 1,
        currentPage2: 1,
        radio: 1,
        redpacketTableData: [], // 红包礼品的列表(添加批次号页面的)
        couponTableData: [], // 加息劵礼品的列表(添加批次号页面的)
        redpacketAlertTableData: [], // 弹出框的红包表格
        couponAlertTableData: [], // 弹出框的加息劵表格
        userMobiletable: [],
        totalRedpacketCount: [],
        productTypeTypeOptions: TOOL.fetchObj('commonObj').ProductType,
        totalCouponCount: [],
        mobileForm: {
          mobiles: ''
        },
        fileForm: {
          fileName: ''
        },
        dialogForm: {
          sendReason: ''
        },
        dialogStateForm: {
          errorMsg: '', // 发送后的错误消息
          errorType: '', // 发送后的错误类型
          sendCount: '', // 发送后的应发数量
          sendCountSuc: '', // 发送后的实发数量
          allSend: '', // 全部发放成功是的提示
          errorTypeArray: ['参数错误', 'csv文件手机号错误', '批次号错误', '没有有效的手机号', '部分发送成功', '用户未注册或已被冻结']// 错误类型提示文本
        },
        targetform: {// 目标用户
          targetInp: ''
        },
        tableHide: false, // 新增礼品弹窗
        addHide: true, // 弹窗中加息券红包列表的显示隐藏
        addSaveBtn: false,
        ticketDetail: {},
        redpacketBatchNo: [], // 批次号的input数组
        couponBatchNo: [], // 批次号的input数组
        pageNo: 1,
        pageSize: 5,
        pageNo2: 1,
        pageSize2: 5,
        redpacketSeach: '',
        couponSeach: '',
        getBatchNo: '', // 获取批次号!!!!
        rules: {
          userPhone: [
            {validator: validatePass1, trigger: 'blur'}
          ],
          targetInp: [
            {required: true, min: 0, max: 20, trigger: 'blur,change', message: '必填项，20字符以内'}
          ]
        },
        base: '',
        loadingShow: false,
        test: '',
        seach: '1', // tab标签
        msg: '',
        activeIndex: '',
        dialogVisible: false,
        redpacketDialogVisible: false,
        couponDialogVisible: false,
        errorVisible: false
      }
    },
    computed: {
      giftDetailSh () { // 通过vuex控制详情页的显示
        return [
          this.$store.state.giftDetail
        ]
      }
    },
    components: {redpacketTap, couponTap},
    watch: {
      // 如果 seach 发生改变，这个函数就会运行
      seach: function (newVal) {
        if (newVal === '1') {
          this.addHide = !this.addHide
        //          this.redpacketTap()
        } else {
          this.addHide = !this.addHide
        //          this.couponTap()
        }
      }
    },
    mounted () {
      API.$getBatchNo(res => {
        this.getBatchNo = res.data * 1
      //          console.log('这是批次号',this.getBatchNo)
      })
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 产品类型转换
      formatterProductType (val) {
        return TOOL.valueToLabelListStr(TOOL.fetchObj('commonObj').ProductType, JSON.parse(val.productType))
      },
      // 金额转换
      moneyFormat (row, column) {
        let money = row[column.property]
        return TOOL.fenToYuan(money)
      },
      // 格式化日期
      formatterDate (val) {
        return TOOL.normalTime(val.createTime)
      },
      // 单元格多行方法
      formatterRule (val) {
        return JSON.parse(val)
      },
      /* --------------------------------------------分页,查询,多选---------------------------------------------------------- */
      // 用户列表多选
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) {
        if (msg.type === 'redpacket') {
        //          下面这个方法可以创建新的obj从而避免数据污染
        //          for (let i = 0; i < msg.val.length; i++) {
        //            this.redpacketTableData = [...this.redpacketTableData, {...msg.val[i]}]
        //          }
          this.redpacketTableData = this.redpacketTableData.concat(msg.val)
          this.addBatchNo(this.redpacketTableData, this.redpacketBatchNo)
          this.redpacketMultipleSelection = this.redpacketTableData
        } else if (msg.type === 'coupon') {
          this.couponTableData = this.couponTableData.concat(msg.val)
          this.addBatchNo(this.couponTableData, this.couponBatchNo)
          this.couponMultipleSelection = this.couponTableData
        }
      },

      giftDetailAdd () {
      //        this.$store.commit('giftDetailAdd')
        this.$router.go(-1)
      },

      // 发送礼品的dialog弹出框的X触发事件
      handleClose () {
        this.activeNames = ['1', '2']
        this.dialogFormVisible = false
        this.addSaveBtn = false
      },

      // 上传文件并转换成base64
      upload (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        // 看支持不支持FileReader
        if (!files[0] || !window.FileReader) return
        if (/^.*\.csv$/.test(files[0].name)) {
          this.fileForm.fileName = files[0].name
          // 创建一个reader
          let reader = new FileReader()
          reader.readAsDataURL(files[0])
          //         读取成功后的回调
          let self = this// 这里要保存一下指向
          reader.onloadend = function () {
            let result = this.result
            let realyBase = result.substr(result.indexOf(',') + 1)
            self.base = realyBase
          }
        }else{
          this.errorVisible = true
        }
      },

      // 合并批次号
      joinArr (arr) {
        let newarr = []
        let len = arr.length
        if (len) {
          for (let i = 0; i < len; i++) {
            newarr[i] = arr[i].join('')
          }
        }
        return newarr
      },

      // 发送礼品
      sendGifts () {
        this.dialogStateForm.errorType = ''
        this.dialogStateForm.errorMsg = ''// 发送后的错误消息
        this.dialogStateForm.sendCount = ''// 发送后的应发数量
        this.dialogStateForm.sendCountSuc = ''// 发送后的
        this.dialogFormVisible = false
        this.dialogStateFormVisible = true
        this.activeNames = ['1', '2']// 展开折叠框
        this.dialogStateForm.allSend = ''
        this.loadingShow = true
        let sendWay, sendWayStr
        if (this.radio === 1) {
          sendWay = 'userId'
          sendWayStr = this.formatAPIData(this.multipleSelection, 'id')
          API.$sendGift(sendWay, this.joinArr(this.couponBatchNo).join(','), this.joinArr(this.redpacketBatchNo).join(','), this.dialogForm.sendReason, this.totalCouponCount.join(','), this.formatAPIData(this.couponTableData, 'id'), this.totalRedpacketCount.join(','), this.formatAPIData(this.redpacketTableData, 'id'), sendWayStr, res => {
            this.dialogStateForm.errorType = res.data.errorType
            this.dialogStateForm.errorMsg = res.data.errorMsg
            this.dialogStateForm.sendCount = res.data.sendCount
            this.dialogStateForm.sendCountSuc = res.data.sendCountSuc
            this.dialogForm.sendReason = ''// 清空发送原因
            this.loadingShow = false
          })
        } else if (this.radio === 2) {
          sendWay = 'base64'
          sendWayStr = this.base
          API.$sendGift(sendWay, this.joinArr(this.couponBatchNo).join(','), this.joinArr(this.redpacketBatchNo).join(','), this.dialogForm.sendReason, this.totalCouponCount.join(','), this.formatAPIData(this.couponTableData, 'id'), this.totalRedpacketCount.join(','), this.formatAPIData(this.redpacketTableData, 'id'), sendWayStr, res => {
            this.dialogStateForm.errorType = res.data.errorType
            this.dialogStateForm.errorMsg = res.data.errorMsg
            this.dialogStateForm.sendCount = res.data.sendCount
            this.dialogStateForm.sendCountSuc = res.data.sendCountSuc
            this.dialogForm.sendReason = ''// 清空发送原因
            this.loadingShow = false
          })
        } else if (this.radio === 3) {
          sendWay = 'all'
          sendWayStr = ''
          API.$sendGift(sendWay, this.joinArr(this.couponBatchNo).join(','), this.joinArr(this.redpacketBatchNo).join(','), this.dialogForm.sendReason, this.totalCouponCount.join(','), this.formatAPIData(this.couponTableData, 'id'), this.totalRedpacketCount.join(','), this.formatAPIData(this.redpacketTableData, 'id'), sendWayStr, res => {
            if (res.success) {
              this.dialogStateForm.allSend = '用户登录即可获取'
            } else {
              this.dialogStateForm.errorType = res.data.errorType
              this.dialogStateForm.errorMsg = res.data.errorMsg
            }
            this.dialogForm.sendReason = ''// 清空发送原因
            this.loadingShow = false
          })
        }
      },

      // 发送礼品的取消按钮
      cancelBtn () {
        this.activeNames = ['1', '2']
        this.dialogFormVisible = false
        this.addSaveBtn = false
      },

      // 发送奖品按钮
      sendGiftBtn (formName) {
        if (!this.redpacketMultipleSelection.length && !this.couponMultipleSelection.length) {
          this.dialogVisible = true
          this.msg = '礼品列表不能为空!!!'
          return
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            scrollTo(0, 0)// 好像没有作用
            this.activeNames = []
            this.dialogFormVisible = true
          } else {
            scrollTo(0, 0)// 好像没有作用
          }
        })
      },

      // 针对上面传参的格式转换
      formatAPIData (table, str) {
        // table->表格;str->所需字段
        if (table) {
          let arr = []
          let len = table.length
          for (let i = 0; i < len; i++) {
            arr[i] = table[i][str]
          }
          return arr.join(',')
        } else {
          return null
        }
      },

      // 选项一的手机号码查询
      mobileQuery () {
        API.postRequest('/gateway/userGift/getUserByMobiles', this.mobileForm, res => {
          this.userMobiletable = res.data
        })
      },

      // keyup事件
      keyUp () {
        this.changeBatch(this.redpacketTableData, this.redpacketBatchNo)
        this.changeBatch(this.couponTableData, this.couponBatchNo)
        this.triggerUpdata(1)
      },

      // 第三方触发变动数据
      triggerUpdata (val) {
        if (val) {
          this.test = ''
        }
        this.test = null
      },

      // 动态变更批次号
      changeBatch (table, arr) {
        let len = table.length
        if (len) {
          for (let i = 0; i < len; i++) {
            arr[i][1] = `_${this.targetform.targetInp}_${table[i]['amount'] / 100 || table[i]['rate']}`
            table[i]['batchNo'] = arr[i].join('')
          }
        }
      },

      // 删除红包表格行
      deleteRedpacketBatchNoRow (index) {
        this.msg = '是否删除此条数据'
        this.activeIndex = index
        this.redpacketDialogVisible = true
      },

      // 删除红包表格行 二次确认
      deleteRedpacketBatchNoRowBtn () {
        this.redpacketTableData.splice(this.activeIndex, 1)
        this.totalRedpacketCount.splice(this.activeIndex, 1)
        this.redpacketAlertTableData.splice(this.activeIndex, 1)
        //        this.redpacketMultipleSelection.splice(this.activeIndex, 1)
        this.redpacketBatchNo.splice(this.activeIndex, 1)
        this.redpacketDialogVisible = false
      },

      // 删除加息劵表格行
      deleteCouponBatchNoRow (index) {
        this.msg = '是否删除此条数据'
        this.activeIndex = index
        this.couponDialogVisible = true
      },

      // 删除加息劵表格行 二次确认
      deleteCouponBatchNoRowBtn () {
        this.couponTableData.splice(this.activeIndex, 1)
        this.totalCouponCount.splice(this.activeIndex, 1)
        this.couponAlertTableData.splice(this.activeIndex, 1)
        //        this.couponMultipleSelection.splice(this.activeIndex, 1)
        this.couponBatchNo.splice(this.activeIndex, 1)
        this.couponDialogVisible = false
      },

      // 新增礼品-->添加按钮
      addGift () {
        this.tableHide = false
        this.addSaveBtn = true
      },

      // 添加礼品默认请求红包接口并弹出添加礼品弹窗
      alertGiftTable () {
        this.seach = '1'
        if (this.radio === 1) {
          if (!this.multipleSelection.length) {
            this.dialogVisible = true
            this.msg = '手机用户未勾选!!!'
            return
          }
        } else if (this.radio === 2) {
          if (this.fileForm.fileName === '') {
            this.dialogVisible = true
            this.msg = '文件名不能为空!!!'
            return
          }
        }

        this.tableHide = !this.tableHide
        this.addHide = true
        this.addSaveBtn = false
      },

      // 添加批次号
      addBatchNo (tableData, arr) {
        if (tableData) {
          for (let x of tableData) {
            if (!('batchNo' in x)) {
              arr.push([this.getBatchNo, `_${this.targetform.targetInp}_${x['amount'] / 100 || x['rate']}`])
              x['batchNo'] = `${this.getBatchNo}_${this.targetform.targetInp}_${x['amount'] / 100 || x['rate']}`
              this.getBatchNo++
            }
          }
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import "./giftRecord.less";
</style>
