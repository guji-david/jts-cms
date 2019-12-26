<template>
  <div class="main">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="activityObj" label-width="160px" :rules="rules" ref="activity">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="活动基本信息" name="1">
            <el-form-item label="活动名称：" prop="name">
              <el-input v-model="activityObj.name"></el-input>
            </el-form-item>
            <el-form-item label="活动规则：" prop="code">
              <!--<el-input v-model="activityObj.code"  @blur="checkCodeIsOnly(activityObj.code)"></el-input>
              <div style="font-size: 12px;color: #ff4949;line-height: 1;position: absolute;top: 40px;z-index: 10;" v-if="codeIsOnlyVisable">
                您输入的活动规则已经存在,请重新输入
              </div>-->
              <el-select name="type" v-model="activityObj.code" @change="getActivityRulesOption(activityObj.code)">
                <el-option v-for="x in activityRulesOptions" :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动类型：" prop="type">
              <el-select name="type" v-model="activityObj.type">
                <el-option v-for="x in activityTypeOptions" :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间：" prop="onlineTime">
              <el-date-picker
                v-model="activityObj.onlineTime"
                type="datetime"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" prop="offlineTime">
              <el-date-picker
                v-model="activityObj.offlineTime"
                type="datetime"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动简介：" prop="summaryPc">
              <el-input
                type="textarea"
                :rows="8"
                placeholder="请输入活动简介"
                v-model="activityObj.summaryPc">
              </el-input>
            </el-form-item>
            <el-form-item label="适用项目类型：" prop="productScope">
              <el-row>
                <el-col :span="3">
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                  </el-checkbox>
                </el-col>
                <el-col :span="10">
                  <el-checkbox-group v-model="activityObj.productScope" @change="handleCheckedProductTypesChange">
                    <el-checkbox v-for="item in productTypeOptions"
                                 :label="item.value"
                                 v-if="item.value!='exportRebate'"
                    >{{item.label}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-col>


              </el-row>
            </el-form-item>
            <el-form-item label="上架时间：" prop="shelfTime">
              <el-date-picker
                v-model="activityObj.shelfTime"
                type="datetime"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="是否需要登录：">
              <el-radio class="radio m2" v-model="activityObj.isLogin" label="true">是</el-radio>
              <el-radio class="radio m2" v-model="activityObj.isLogin" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="排列序号：" prop="orderNum">
              <el-input v-model="activityObj.orderNum"></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="活动宣传信息" name="2">
            <el-form-item label="是否pc端展示:">
              <el-radio class="radio m2" v-model="activityObj.isShowPc" label="true">是</el-radio>
              <el-radio class="radio m2" v-model="activityObj.isShowPc" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="宣传图片:" v-show="activityObj.isShowPc=='true'">
              <picUpload :filename=activityObj.picUrlPc
                         @childToFatherTransferEvent="fatherGetFileFromChildPicUrlPc"></picUpload>
            </el-form-item>
            <el-form-item label="链接地址:" v-show="activityObj.isShowPc=='true'">
              <span class="my-input-span">*</span>
              <el-input v-model="activityObj.pcUrl" @blur="blurInput(0)"></el-input>
              <div class="errorMsg" v-if="selfValidateList[0].isVisable">
                {{selfValidateList[0].errMsg}}
              </div>
            </el-form-item>
            <el-form-item label="是否App端展示:">
              <el-radio class="radio m2" v-model="activityObj.isShowApp" label="true">是</el-radio>
              <el-radio class="radio m2" v-model="activityObj.isShowApp" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="宣传图片:" v-show="activityObj.isShowApp=='true'">
              <picUpload :filename=activityObj.picUrlApp
                         @childToFatherTransferEvent="fatherGetFileFromChildPicUrlApp"></picUpload>
            </el-form-item>

            <el-form-item label="宣传小图片:" v-show="activityObj.isShowApp=='true'">
              <span class="my-input-span">*</span>
              <picUpload :filename=activityObj.picUrlAppDiscovery
                         @childToFatherTransferEvent="fatherGetFileFromChildPicUrlDiscovery"></picUpload>
              <div class="errorMsg" v-if="picIsNotNullVisable">
                宣传小图片不能为空
              </div>
            </el-form-item>

            <el-form-item class="myRequired" label="链接地址:" v-show="activityObj.isShowApp=='true'">
              <span class="my-input-span">*</span>
              <el-input v-model="activityObj.appUrl" @blur="blurInput(1)"></el-input>
              <div class="errorMsg" v-if="selfValidateList[1].isVisable">
                {{selfValidateList[1].errMsg}}
              </div>
            </el-form-item>
            <el-form-item label="是否H5端展示:">
              <el-radio class="radio m2" v-model="activityObj.isShowWechat" label="true">是</el-radio>
              <el-radio class="radio m2" v-model="activityObj.isShowWechat" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="宣传图片:" v-show="activityObj.isShowWechat=='true'">
              <picUpload :filename=activityObj.picUrlWechat
                         @childToFatherTransferEvent="fatherGetFileFromChildPicUrlWechat"></picUpload>
            </el-form-item>
            <el-form-item label="链接地址:" v-show="activityObj.isShowWechat=='true'" prop="h5Url">
              <span class="my-input-span">*</span>
              <el-input v-model="activityObj.h5Url" @blur="blurInput(2)"></el-input>
              <div class="errorMsg" v-if="selfValidateList[2].isVisable">
                {{selfValidateList[2].errMsg}}
              </div>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="活动奖品信息" name="3">
            <el-button type="primary" @click="popGift()" class="height36">新增礼品</el-button>
            <el-form>
              <el-collapse v-model="activeNamesPrize">
                <el-collapse-item title="红包" name="1">
                  <hr>
                  <!--红包表-->
                  <el-table
                    :data="activityObj.bizActivityRedpackets"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="name"
                      label="红包名称"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="amount"
                      :formatter="formatterAmount"
                      label="金额(元)"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="validLimit"
                      label="有效期(天)"
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
                      <template scope="props">
                        <div class="table-line">
                          <ul>
                            <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.minAmount / 100}}</li>
                          </ul>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="投资产品最低期限(天)"
                    >
                      <template scope="props">
                        <div class="table-line">
                          <ul>
                            <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.limit}}</li>
                          </ul>

                        </div>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column
                       prop="createTime"
                       label="创建时间"
                       :formatter="formatterDate"
                       >
                     </el-table-column>-->
                    <el-table-column
                      label="发放规则"
                      width="180"
                    >
                      <template scope="ruleSourceType">
                        <div style="margin: 10px 0;width: 100%">
                          <el-select name="type" v-model="ruleSourceType.row.ruleSource">
                            <el-option v-for="x in subActivityRulesOptions" :value="x.value"
                                       :label="x.label"></el-option>
                          </el-select>
                        </div>
                      </template>


                    </el-table-column>
                    <!--<el-table-column-->
                      <!--label="总数"-->
                    <!--&gt;-->
                      <!--<template scope="propsAllNum">-->
                        <!--<div style="margin: 10px 0">-->
                          <!--<el-input v-model="propsAllNum.row.allNum"></el-input>-->
                        <!--</div>-->
                      <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                      prop="id"
                      label="操作"
                    >
                      <template scope="scope">
                        <span> <el-button @click="delRedpacket(scope.$index)" type="text">删除</el-button></span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--红包表end-->
                </el-collapse-item>
                <el-collapse-item title="加息券" name="2">
                  <hr>
                  <!--加息劵表-->
                  <el-table
                    :data="activityObj.bizActivityCoupons"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="name"
                      label="加息券名称"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="rate"
                      label="加息额度(%)"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="validLimit"
                      label="有效期(天)"
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
                      :formatter="formatterMaxRateAmount"
                      label="最高加息金额(元) "
                    >
                    </el-table-column>
                    <el-table-column
                      prop="maxRateLimit"
                      label="最高加息天数(天)"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="minInvestAmount"
                      :formatter="formatterMinInvestAmount"
                      label="最低投资金额(元)"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="minInvestLimit"
                      label="投资产品最低期限(天)"
                    >
                    </el-table-column>
                    <!-- <el-table-column
                       prop="createTime"
                       label="创建时间"
                       :formatter="formatterDate"
                      >
                     </el-table-column>-->
                    <el-table-column
                      label="发放规则"
                      width="180"
                    >
                      <template scope="ruleSourceType">
                        <div style="margin: 10px 0">
                          <el-select name="type" v-model="ruleSourceType.row.ruleSource">
                            <el-option v-for="x in subActivityRulesOptions" :value="x.value"
                                       :label="x.label"></el-option>
                          </el-select>
                        </div>
                      </template>


                    </el-table-column>
                    <!--<el-table-column-->
                      <!--label="总数"-->
                    <!--&gt;-->
                      <!--<template scope="propsAllNum">-->
                        <!--<div style="margin: 10px 0">-->
                          <!--<el-input v-model="propsAllNum.row.allNum"></el-input>-->
                        <!--</div>-->
                      <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                      prop="id"
                      label="操作"
                    >
                      <template scope="scope">
                        <span> <el-button @click="delCoupon(scope.$index)" type="text">删除</el-button></span>
                      </template>

                    </el-table-column>
                  </el-table>
                  <!--加息劵表end-->
                </el-collapse-item>
                <el-collapse-item title="实物" name="3">
                  <!--实物表-->
                  <el-table
                    :data="activityObj.bizActivityGifts"
                    border
                    style="width: 100%">
                    <el-table-column
                      label="实物名称"

                    >
                      <template scope="propsName">
                        <div style="margin: 10px 0">
                          <el-input v-model="propsName.row.name"></el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="实物类型"
                    >
                      <template scope="propsType">
                        <div style="margin: 10px 0">
                          <el-select name="type" v-model="propsType.row.type">
                            <el-option v-for="x in activityGiftTypeOptions" :value="x.value"
                                       :label="x.label"></el-option>
                          </el-select>
                        </div>
                      </template>


                    </el-table-column>
                    <el-table-column
                      label="发放规则"
                    >
                      <template scope="ruleSourceType">
                        <div style="margin: 10px 0">
                          <el-select name="type" v-model="ruleSourceType.row.ruleSource">
                            <el-option v-for="x in subActivityRulesOptions" :value="x.value"
                                       :label="x.label"></el-option>
                          </el-select>
                        </div>
                      </template>


                    </el-table-column>
                    <!--<el-table-column-->
                      <!--label="总数"-->
                    <!--&gt;-->
                      <!--<template scope="propsAllNum">-->
                        <!--<div style="margin: 10px 0">-->
                          <!--<el-input v-model="propsAllNum.row.allNum"></el-input>-->
                        <!--</div>-->
                      <!--</template>-->
                    <!--</el-table-column>-->

                    <el-table-column

                      prop="id"
                      label="操作"
                    >
                      <template scope="scope">
                        <span v-if="scope.$index>0"> <el-button @click="delGifts(scope.$index)"
                                                                type="text">删除</el-button></span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-form-item label="">
                    <el-button @click="addDomain" type="primary">新增实物</el-button>
                  </el-form-item>
                  <!--实物表end-->
                </el-collapse-item>
              </el-collapse>
            </el-form>

          </el-collapse-item>
        </el-collapse>

        <div style="padding:20px 0px 50px 0px; text-align:center;">
          <span style="margin-right: 15px">
            <el-button type="primary"
                       @click="saveActivity('activity')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
            >确认</el-button>
          </span>
          <span> <el-button type="primary" @click="resetForm('activity')"
                                                      :plain="true">取消</el-button></span>

        </div>
      </el-form>
      <!--弹出添加礼品-->
      <div class="wrap" v-show="addGiftVisable">
        <div class="addGiftBox">
          <el-row type="flex" class="addGiftTapBox">
            <el-col :span="6" v-for="(item,index) in giftTabList">
              <div class="addGiftTap" @click="shiftGiftTap(index)">{{item.name}}</div>
            </el-col>
            <el-col :span="6" :offset="6">
              <el-button @click="addGift()">添加</el-button>
              <el-button @click="addGiftVisable=false">关闭</el-button>
            </el-col>

          </el-row>
          <div v-show="activeIndex==0">
            <redpacket :comVisable="comVisable"
                       @childToFatherTransferEvent="fatherGetFileFromChildRedpacket"></redpacket>
          </div>
          <div v-show="activeIndex==1">
            <coupon :comVisable="comVisable" @childToFatherTransferEvent="fatherGetFileFromChildCoupon"></coupon>
          </div>
          <el-row type="flex" class="addGiftTapBox">

          </el-row>
        </div>
      </div>
      <!--弹出添加礼品end-->
      <!-- 对话框 -->
      <el-dialog title="提示" v-model="dialogVisible" size="tiny">
        <span>{{msg}}</span>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "addActivityInfo.less";
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import picUpload from '../../../comComponents/pic-upload-simple.vue'
  import redpacket from '../../giftManagement/redpacket/redpacket.vue'
  import coupon from '../../giftManagement/coupon/coupon.vue'

  import * as TOOLS from '../../../../assets/js/tools'
  import * as API from '../../../../store/api'

  export default {
    data () {
      var onlineTimeValidate = (rule, value, callback) => {
        setTimeout(() => {
          if (!value) {
            callback(new Error('时间不能为空'))
          } else {
            callback()
          }
        }, 100)
      }

      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        comVisable: true,
        codeIsOnlyVisable: false,
        breadcrumName: '',
        activeNames: ['1'],
        activeNamesPrize: ['1'],
        redpacketsTableData: [],
        redpacketTableData: [], // 红包礼品的列表(添加批次号页面的)
        couponTableData: [], // 加息劵礼品的列表(添加批次号页面的)
        activityObj: {
          id: 0,
          name: '',
          code: '',
          type: '',
          onlineTime: '',
          offlineTime: '',
          productScope: [],
          shelfTime: '',
          isLogin: 'false',
          orderNum: '',
          isShowPc: 'false',
          picUrlPc: '',
          pcUrl: '',
          summaryPc: '',
          isShowApp: 'false',
          picUrlApp: '',
          picUrlAppDiscovery: '',
          appUrl: '',
          isShowWechat: 'false',
          picUrlWechat: '',
          h5Url: '',
          bizActivityRedpackets: [// 红包礼品的列表

          ],
          bizActivityCoupons: [// 加息劵礼品的列表
            /* {
             name:"",
             rate:"",
             validLimit:"",
             productType:'[]',
             maxRateAmount:'',
             maxRateLimit:"",
             minInvestAmount:"",
             minInvestLimit:"",
             createTime:"",
             allNum:'',
             ruleSource:''
             } */
          ],
          bizActivityGifts: [// 实物的列表
            {name: '', type: '', allNum: '', ruleSource: ''}
          ]
        },
        addGiftVisable: false,
        giftTabList: [{name: '红包'}, {name: '加息券'}],
        activeIndex: 0,
        // 上线时间禁用选项  //下线时间禁用选项 //上架时间禁用选项
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },

        activityTypeOptions: '',
        activityGiftTypeOptions: '',
        activityRulesOptions: '', // 发放规则
        subActivityRulesOptions: '', // 发放规则 礼品中 联动获取
        rules: {
          name: [
            {required: true, message: '活动名称不能为空', trigger: 'blur'},
            {min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '活动规则不能为空', trigger: 'blur'},
            {min: 0, max: 20, message: '长度必须在20个字符以内', trigger: 'blur'}
          ],
          onlineTime: [
            {required: true, type: 'date', validator: onlineTimeValidate, trigger: 'blur,change'}
          ],
          offlineTime: [
            {required: true, type: 'date', validator: onlineTimeValidate, trigger: 'blur,change'}
          ],
          type: [
            {required: true, message: '活动类型不能为空', trigger: 'change'}
          ],
          shelfTime: [
            {required: true, type: 'date', validator: onlineTimeValidate, trigger: 'blur,change'}
          ],
          productScope: [
            {required: true, type: 'array', message: '至少选择一个适用项目类型', trigger: 'change'}
          ],
          summaryPc: [
            {required: true, message: '活动简介不能为空', trigger: 'blur'},
            {min: 0, max: 500, message: '长度必须在500个字符以内', trigger: 'blur'}
          ],
          pcUrl: [
            {message: '链接地址不能为空', trigger: 'blur'},
            {min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur,change'}
          ],
          /* picUrlAppDiscovery:[
           {  required: true, message: '图片不能为空', trigger: 'blur' }
           ], */
          appUrl: [
            {message: '链接地址不能为空', trigger: 'blur'},
            {min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur'}
          ],
          h5Url: [
            {message: '链接地址不能为空', trigger: 'blur'},
            {min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur'}
          ]

        },
        productTypeOptions: '',
        productTypeALLValueList: '',
        checkAll: true,
        isIndeterminate: true,
        dialogVisible: false,
        msg: '',
        activityId: TOOLS.getProType(this.$route.params.activityId),
        picIsNotNullVisable: false,
        selfValidateList: [
          { name: 'pcUrl', isVisable: false, errMsg: '' },
          { name: 'app', isVisable: false, errMsg: '' },
          { name: 'h5', isVisable: false, errMsg: '' }
        ],
        selfValidateErrorMsgList: ['链接地址不能为空', '长度必须在100个字符以内']
      }
    },
    components: {
      breadcrumbNav,
      picUpload,
      redpacket,
      coupon
    },

    watch: {},
    mounted () {
      // 对活动类型进行处理
      let activityTypeOptionsList = TOOLS.fetchObj('commonObj').ActivityType
      activityTypeOptionsList.splice(0, 1)
      this.activityTypeOptions = activityTypeOptionsList

      // 对产品类型进行处理
      let productTypeOptionsList = TOOLS.fetchObj('commonObj').ProductType
      productTypeOptionsList.splice(0, 1)
      this.productTypeOptions = productTypeOptionsList
      this.productTypeALLValueList = TOOLS.getValueList(this.productTypeOptions)

      // 对实物类型进行处理
      let activityGiftTypeOptionsList = TOOLS.fetchObj('commonObj').ActivityGiftType
      activityGiftTypeOptionsList.splice(0, 1)
      this.activityGiftTypeOptions = activityGiftTypeOptionsList

      // 对发放规则进行处理
      let activityRulesOptionsList = TOOLS.fetchObj('commonObj').ActivityCode
      activityRulesOptionsList.splice(0, 1)
      this.activityRulesOptions = activityRulesOptionsList
      if (this.activityId != 0) {
        this.breadcrumName = '编辑'

        API.$activityQueryById(this.activityId, res => {
          if (res.success) {
            this.activityObj = res.data
            this.activityObj.productScope = JSON.parse(res.data.productScope)
            TOOLS.setCode(this.activityObj.code)
          } else {
            alert(res.resultMsg)
          }
        })
      } else {
        this.breadcrumName = '新增'
        this.activityObj.offlineTime = new Date(new Date().setHours(23, 59, 59, 0)) * 1
      }
    },
    methods: {
      // 获取新增礼品中发放规则下列拉列表
      getActivityRulesOption: function (val) {
        API.$activityGetRulesByCode(val, res => {
          this.subActivityRulesOptions = res.data
        })
      },
      // 金额转换-红包
      formatterAmount (val) {
        return TOOLS.fenToYuan(val.amount)
      },
      // 最高加息金额(元)金额转换-加息券
      formatterMaxRateAmount (val) {
        return TOOLS.fenToYuan(val.maxRateAmount)
      },
      // 最低投资金额(元)金额转换-加息券
      formatterMinInvestAmount (val) {
        return TOOLS.fenToYuan(val.minInvestAmount)
      },
      popDialog (msg) {
        this.msg = msg
        this.dialogVisible = true
      },
      // 限投产品类型-全选
      handleCheckAllChange (event) {
        this.isIndeterminate = false
        this.activityObj.productScope = event.target.checked ? this.productTypeALLValueList : []
      },
      // 限投产品类型-单选checkbox
      handleCheckedProductTypesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.productTypeOptions.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.productTypeOptions.length
      },
      // 新增实物
      addDomain () {
        this.activityObj.bizActivityGifts.push({name: '', type: '', allNum: ''})
      },
      /*  //检查活动规则是否唯一
       checkCodeIsOnly(code){
       this.codeIsOnlyVisable=false;
       if (!code){
       return;
       }
       if(this.activityId!=0){
       if(TOOLS.getCode()==this.activityObj.code){
       return;
       }else {
       this.getCheckCode(code);
       }
       }else{
       this.getCheckCode(code);
       }

       },
       //获取活动规则是否重复接口
       getCheckCode(code){
       API.$activityCheckCode(code,res=>{
       if(res.success){
       this.codeIsOnlyVisable=false;
       TOOLS.log("Code--success")
       }else{
       this.codeIsOnlyVisable=true;
       TOOLS.log("Code--false")
       }
       })
       }, */
      formatterRule (val) {
        return JSON.parse(val)
      },
      // 产品类型转换
      formatterProductType (val) {
        if (!val.productType) {
          return ''
        } else {
          return TOOLS.valueToLabelListStr(TOOLS.fetchObj('commonObj').ProductType, JSON.parse(val.productType))
        }
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },
      // 删除红包
      delRedpacket (index) {
        this.activityObj.bizActivityRedpackets.splice(index, 1)
      },
      // 删除加息券
      delCoupon (index) {
        this.activityObj.bizActivityCoupons.splice(index, 1)
      },
      // 删除实物
      delGifts (index) {
        this.activityObj.bizActivityGifts.splice(index, 1)
      },
      // 弹出
      popGift () {
        this.activeNames = []
        this.addGiftVisable = true
      },
      // 切换礼物tap
      shiftGiftTap (index) {
        this.activeIndex = index
      },
      // 提交礼物
      addGift () {
        this.activeNames = ['3']
        this.activeNamesPrize = ['1', '2', '3']
        for (let item of TOOLS.getList('redpacketTableData')) {
          this.activityObj.bizActivityRedpackets.push(item)
        }
        for (let item of TOOLS.getList('couponTableData')) {
          this.activityObj.bizActivityCoupons.push(item)
        }

        this.addGiftVisable = false
      },
      // 父组件从子组件获取文件转换方法-pc
      fatherGetFileFromChildPicUrlPc (msg) {
        this.activityObj.picUrlPc = msg
      },
      // 父组件从子组件获取文件转换方法-App
      fatherGetFileFromChildPicUrlApp (msg) {
        this.activityObj.picUrlApp = msg
      },
      // 父组件从子组件获取文件转换方法-App
      fatherGetFileFromChildPicUrlDiscovery (msg) {
        this.activityObj.picUrlAppDiscovery = msg
        this.picIsNotNullVisable = this.activityObj.picUrlAppDiscovery == ''
      },
      // 父组件从子组件获取文件转换方法-Wechat
      fatherGetFileFromChildPicUrlWechat (msg) {
        this.activityObj.picUrlWechat = msg
      },
      // 父组件从子组件获取文件转换方法-红包列表
      fatherGetFileFromChildRedpacket (msg) {
        this.redpacketTableData = msg
        for (let item of this.redpacketTableData) {
          item.ruleSource = ''
        }
        TOOLS.setList('redpacketTableData', this.redpacketTableData)
      },
      // 父组件从子组件获取文件转换方法-加息券列表
      fatherGetFileFromChildCoupon (msg) {
        this.couponTableData = msg
        for (let item of this.couponTableData) {
          item.ruleSource = ''
        }
        TOOLS.setList('couponTableData', this.couponTableData)
      },
      blurInput (i) {
        this.selfValidateList[i].isVisable = false
      },
      // 重置自定义提示
      resetValidate () {
        this.picIsNotNullVisable = false
        for (var item of this.selfValidateList) {
          item.isVisable = false
        }
      },
      // 自定义验证
      selfValidate () {
        if (this.activityObj.isShowPc === 'true') {
          if (!this.activityObj.pcUrl) {
            this.selfValidateList[0].isVisable = true
            this.selfValidateList[0].errMsg = this.selfValidateErrorMsgList[0]
            return false
          }
          if (this.activityObj.pcUrl.length > 100) {
            this.selfValidateList[0].isVisable = true
            this.selfValidateList[0].errMsg = this.selfValidateErrorMsgList[1]
            return false
          }
        }
        if (this.activityObj.isShowApp === 'true') {
          if (!this.activityObj.appUrl) {
            this.selfValidateList[1].isVisable = true
            this.selfValidateList[1].errMsg = this.selfValidateErrorMsgList[0]
            return false
          }
          if (this.activityObj.appUrl.length > 100) {
            this.selfValidateList[1].isVisable = true
            this.selfValidateList[1].errMsg = this.selfValidateErrorMsgList[1]
            return false
          }
          if (!this.activityObj.picUrlAppDiscovery) {
            this.picIsNotNullVisable = true
            return false
          }
        }
        if (this.activityObj.isShowWechat === 'true') {
          if (!this.activityObj.h5Url) {
            this.selfValidateList[2].isVisable = true
            this.selfValidateList[2].errMsg = this.selfValidateErrorMsgList[0]
            return false
          }
          if (this.activityObj.h5Url.length > 100) {
            this.selfValidateList[2].isVisable = true
            this.selfValidateList[2].errMsg = this.selfValidateErrorMsgList[1]
            return false
          }
        }
        return true
      },
      // 时间转换
      timeChange () {
        this.activityObj.onlineTime = +this.activityObj.onlineTime
        this.activityObj.offlineTime = +this.activityObj.offlineTime
        this.activityObj.shelfTime = +this.activityObj.shelfTime
      },
      // 确认提交
      saveActivity (formName) {
        this.resetValidate()
        this.timeChange()
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.activeNames = ['1', '2']
            return false
          } else {
            if (!this.selfValidate()) {
              this.activeNames = ['2']
              return
            }
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            if (this.activityId == 0) {
              API.$activityAdd(this.activityObj, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success) {
                  this.back()
                } else {
                  this.popDialog(res.resultMsg)
                }
              })
            } else {
              API.$activityUpdate(this.activityObj, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success) {
                  this.back()
                } else {
                  this.popDialog(res.resultMsg)
                }
              })
            }
          }
        })
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.back()
      },
      // 返回
      back () {
        this.$router.go(-1)
      }

    }

  }
</script>
