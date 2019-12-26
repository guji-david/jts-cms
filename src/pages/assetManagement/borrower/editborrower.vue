<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="borrowerObj" label-width="160px" :rules="rules" ref="borrowerObj"  class="demo-ruleForm">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="企业资料" name="1">
            <el-form-item label="企业名称：" prop="borrowerName" >
              <el-input v-model.trim="borrowerObj.borrowerName"></el-input>
            </el-form-item>
            <el-form-item label="营业执照/信用代码："prop="businessLicenseCode">
              <el-input v-model.trim="borrowerObj.businessLicenseCode" @blur="checkBusinessLicenseCodeIsOnly(borrowerObj.businessLicenseCode)"></el-input>
               <div style="font-size: 12px;color: #ff4949;line-height: 1;position: absolute;top: 40px;z-index: 10;" v-if="businessLicenseCodeIsOnlyVisable">
                 您输入的营业执照/信用代码已经存在,请重新输入
               </div>
            </el-form-item>
            <el-form-item label="注册地址：" prop="businessAddress">
              <el-input v-model.trim="borrowerObj.businessAddress"></el-input>
            </el-form-item>
            <el-form-item label="机构类型："prop="unitType">
              <el-select name="type"v-model="borrowerObj.unitType">
                <el-option v-for="(x,index) in borrowerTypeOptions" :value="x.value" :label="x.label" v-if="index>0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注册资本：" prop="registeredCapital">
              <el-input v-model="borrowerObj.registeredCapital">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="实缴资本：" prop="contributedCapital">
              <el-input v-model="borrowerObj.contributedCapital">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="成立时间：" prop="foundingTime">
                <el-date-picker
                  v-model="borrowerObj.foundingTime"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="所在地区：">
              <el-col :span="9">
                <el-form-item prop="businessProvince">
                  <el-select v-model="borrowerObj.businessProvince" @change="changeCityOption(borrowerObj.businessProvince)">
                    <el-option v-for="x in provinceOption" :value="x.id" :label="x.name" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="9">
                <el-form-item prop="businessCity">
                  <el-select v-model="borrowerObj.businessCity">
                    <el-option v-for="x in cityOption" :value="x.id" :label="x.name" ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="公司办公地址：" prop="workAddress">
              <el-input v-model.trim="borrowerObj.workAddress"></el-input>
            </el-form-item>
            <el-form-item label="经营区域：" prop="managementArea">
              <el-input v-model.trim="borrowerObj.managementArea"></el-input>
            </el-form-item>
            <el-form-item label="邮政编码：" prop="postalCode">
              <el-input v-model.number="borrowerObj.postalCode"></el-input>
            </el-form-item>
            <el-form-item label="公司电话：" prop="phone">
              <el-input v-model="borrowerObj.phone"></el-input>
            </el-form-item>
            <el-form-item label="公司传真："prop="fax">
              <el-input v-model.trim="borrowerObj.fax"></el-input>
            </el-form-item>
            <el-form-item label="公司介绍：" prop="summary">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model.trim="borrowerObj.summary">
              </el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="法定代表人信息" name="2">
            <el-form-item label="姓名：" prop="legalPerson">
              <el-input v-model.trim="borrowerObj.legalPerson"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idNo">
              <el-input v-model.trim="borrowerObj.idNo"></el-input>
            </el-form-item>
            <el-form-item label="联系电话："  prop="legalPersonMobile">
              <el-input v-model.trim="borrowerObj.legalPersonMobile"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址："prop="address" >
              <el-input v-model.trim="borrowerObj.address"></el-input>
            </el-form-item>
            <el-form-item label="信用信息："prop="creditInfo" >
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model.trim="borrowerObj.creditInfo">
              </el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="股东信息" name="3">
            <el-form-item label="股东信息："prop="shareholderInfo">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model.trim="borrowerObj.shareholderInfo">
              </el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="公司代理人信息" name="4">
            <el-form-item label="姓名：" prop="proxyPerson">
              <el-input v-model.trim="borrowerObj.proxyPerson"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="proxyIdNo">
              <el-input v-model.trim="borrowerObj.proxyIdNo"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="proxyPersonMobile">
              <el-input v-model.trim="borrowerObj.proxyPersonMobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="proxyEmail">
              <el-input v-model.trim="borrowerObj.proxyEmail"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址："prop="proxyAddress">
              <el-input v-model.trim="borrowerObj.proxyAddress"></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="账户信息" name="5">
            <el-form-item label="手机号：" prop="mobile" >

              <el-input v-model.trim="borrowerObj.mobile"
              ></el-input>

            </el-form-item>
            <el-form-item label="开户银行：" prop="bankId" >
              <el-select v-model="borrowerObj.bankId">
                <el-option v-for="x in bankOption" :value="x.code" :label="x.name" ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="开户支行：" prop="bankBranch">
              <el-select v-model="borrowerObj.bankBranch"
                         remote
                         filterable
                         placeholder="请输入关键词"
                         :remote-method="getBranchOption"
                         :loading="branchLoading"
                         >
                <el-option v-for="x in branchOption"
                           :key="x.code"
                           :value="x.branchBankName"
                           :label="x.branchBankName" >

                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="银行卡号：" prop="bankCard" required>
              <el-input v-model.trim="borrowerObj.bankCard"></el-input>
            </el-form-item>

            <el-form-item label=" 银行卡户名：" prop="accountName" >
              <el-input v-model.trim="borrowerObj.accountName"></el-input>
            </el-form-item>

            <el-form-item label="银行卡类型："prop="bankCardType">
              <el-select name="type"v-model="borrowerObj.bankCardType">
                <el-option v-for="(x,index) in bankCardTypeOptions" :value="x.value" :label="x.label"v-if="index>0" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开户行人行联行号：" prop="peopleBankCode" required>
              <el-input v-model.trim="borrowerObj.peopleBankCode" disabled></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="附件资料" name="6">
            <div v-for="(item,index) in borrowerObj.fileList">
              <!--这里是需要隐藏的-->
              <!--<el-form-item :label="item[0]+':'"type="flex"  v-if="index<1" required>-->
                <!--<picUpload  :index=index-->
                           <!--:firstValidateVisable=firstValidateVisable-->
                            <!--:filename=item-->
                            <!--@childToFatherTransferEvent="fatherGetFileFromChild"></picUpload>-->
              <!--</el-form-item>-->
              <!--<el-form-item :label="item[0]+':'"type="flex" v-else="index>=1">-->
                <!--<picUpload  :index=index :filename=item @childToFatherTransferEvent="fatherGetFileFromChild"></picUpload>-->
              <!--</el-form-item>-->

              <!--下面的是需要解开的-->
              <el-form-item :label="item[0]+':'"type="flex">
                <picUpload  :index=index :filename=item @childToFatherTransferEvent="fatherGetFileFromChild"></picUpload>
              </el-form-item>


            </div>


          </el-collapse-item>
          <el-collapse-item title="其他信息" name="7">
            <el-form-item label="备注："prop="remark">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model.trim="borrowerObj.remark">
              </el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <div style="padding:20px 0px 50px 0px; text-align:center">
          <el-button type="primary"
                     @click="saveBorrower('borrowerObj')"
                     :disabled="savebtnDisabled"
                     v-loading.fullscreen.lock="fullscreenLoading">保存数据</el-button>
          <el-button style="margin-left: 10px" type="primary" size=""@click="back" class="is-plain">返回</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "./editborrower.less";
</style>
<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'

  import * as TOOLS from '../../../assets/js/tools'
  import * as API from '../../../store/api'
  import picUpload from '../../comComponents/pic-upload-list.vue'
  export default {
    data () {
      var validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('此项不能为空'))
        }
        setTimeout(() => {
          /* if (!TOOLS.checkName(value)) {
            callback(new Error('请输入中英文'));
          } else {

          } */
          if (value.length > 100) {
            callback(new Error('您输入的长度不能超过100个字符'))
          } else {
            callback()
          }
        }, 100)
      }
      var validateNumAndLetter = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('此项不能为空'))
        } else {
          if (!TOOLS.checkNumAndLetter(value)) {
            callback(new Error('请输入数字和字母'))
          } else {
            callback()
          }
        }
      }
      var validateNumberIsNoRequired = (rule, value, callback) => {
        if (!TOOLS.checkNum(value)) {
          callback(new Error('请输入长度不超过10的数字值'))
        } else {
          callback()
        }
      }
      var validateTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号码不能为空'))
        } else {
          if (!TOOLS.checkTel(value)) {
            callback(new Error('手机号码格式不正确'))
          } else {
            callback()
          }
        }
      }
      var validateTelIsNoRequired = (rule, value, callback) => {
        if (!TOOLS.checkTelMaybeNull(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
//      var validateEmail = (rule, value, callback) => {
//        if (!value) {
//          return callback(new Error('邮箱不能为空'))
//        } else {
//          if (!TOOLS.checkEmail(value)) {
//            callback(new Error('邮箱格式不正确'))
//          } else {
//            callback()
//          }
//        }
//      }
      var validateEmailIsNoRequired = (rule, value, callback) => {
        if (!TOOLS.checkEmailMaybeNull(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          callback()
        }
      }
      var validatePerson = (rule, value, callback) => {
        if (!TOOLS.checkChineseName(value)) {
          callback(new Error('请填写中文'))
        } else {
          callback()
        }
      }
      var validatePersonIsNoRequired = (rule, value, callback) => {
        if (!TOOLS.checkChineseNameMaybeNull(value)) {
          callback(new Error('代理人姓名请填写中文'))
        } else {
          callback()
        }
      }
//      var validateIdNo = (rule, value, callback) => {
//        if (!value) {
//          return callback(new Error('身份证不能为空'))
//        } else {
//          if (!TOOLS.checkIdcard(value)) {
//            callback(new Error('身份证号不正确'))
//          } else {
//            callback()
//          }
//        }
//      }
      var validateIdNoIsNoRequired = (rule, value, callback) => {
        if (!TOOLS.checkIdcardMaybeNull(value)) {
          callback(new Error('身份证号不正确'))
        } else {
          callback()
        }
      }
      var validateBankCard = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('银行卡号不能为空'))
        } else {
          if (!TOOLS.checkBankCard(value)) {
            callback(new Error('银行卡号必须为30位以下的数字'))
          } else {
            callback()
          }
        }
      }
      var validateContributedCapital=(rule, value, callback) => {

        if (!TOOLS.decimalRate(value)) {
          callback(new Error('小数点后只能输入两位'))
        } else {
          if (value.length>10) {
            return callback(new Error('长度不能超过10位'))
          } else {

          }
        }
      }
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        businessLicenseCodeIsOnlyVisable: false,
        provinceOption: [],
        cityOption: [],
        bankOption: [],
        branchOption: [],
        branchOptionList: [],
        branchLoading: false,
        activeNames: ['1'],
        borrowerObj: {
          borrowerType: 10,
          //          企业资料
          borrowerName: '',
          businessLicenseCode: '',
          businessAddress: '',
//          proxyAddress: '',
          unitType: '',
          registeredCapital: '',
          contributedCapital: '',
          foundingTime: '',
          businessProvince: '',
          businessCity: '',
          workAddress: '',
          managementArea: '',
          postalCode: '',
          phone: '',
          fax: '',
          summary: '',
          //          法定代表人信息
          legalPerson: '',
          idNo: '',
          legalPersonMobile: '',
          address: '',
          creditInfo: '',
          //       股东信息
          shareholderInfo: '',
          //          公司代理人信息
          proxyPerson: '',
          proxyIdNo: '',
          proxyPersonMobile: '',
          proxyEmail: '',
          proxyAddress: '',
          //          账户信息
          mobile: '', // borrowerUser手机号
          accountName: '', // 开户人名称
          bankId: '', // 开户行总行id
          bankBranch: '', // 开户行分行名称
          bankCard: '', // 开户行卡号
          bankCardType: '', // 银行卡类型
          peopleBankCode: '', // 人行联行号
          //          附件资料
          fileList: [
            ['营业执照', ''],
            ['公司印章', ''],
            ['税务登记证', ''],
            ['经营许可证', ''],
            ['开户许可证', ''],
            ['组织架构图', ''],
            ['风险控制制度', ''],
            ['征信信息', ''],
            ['资产负债表', ''],
            ['公司章程', ''],
            ['行政处罚/诉讼信息', ''],
            ['合作协议', '']

          ],
          //          其他信息
          remark: ''
        },
        borrowerTypeOptions: TOOLS.fetchObj('commonObj').BorrowerType,
        bankCardTypeOptions: TOOLS.fetchObj('commonObj').BankCardType,
        rules: {
          // 企业资料
          borrowerName: [
            { required: true, validator: validateName, trigger: 'blur' }
          ],
          businessLicenseCode: [
            { required: true, validator: validateNumAndLetter, trigger: 'blur' }
          ],
          businessAddress: [
            { required: true, min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur' }
          ],
          unitType: [
            { required: true, message: '机构类型不能为空', trigger: 'change' }
          ],
          registeredCapital: [
            { required: true, message: '注册资本不能为空' },
            { validator: validateContributedCapital, trigger: 'blur' }
          ],
          contributedCapital: [
            { validator: validateContributedCapital, trigger: 'blur' }
          /*  { type: 'number',min: 0, max: 10000000000,message: '您输入的长度不能超过10个字符且为正整数',trigger: 'blur' } */
          ],
          foundingTime: [
            {required: true, message: '成立时间不能为空'}
          ],
          businessProvince: [
            { message: '请选择省份', trigger: 'change' }
          ],
          businessCity: [
            { message: '请选择市区', trigger: 'change' }
          ],
          workAddress: [
            { min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur' }
          ],
          managementArea: [
            { min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur' }
          ],
          postalCode: [
            { validator: validateNumberIsNoRequired, trigger: 'blur' }
          ],
          phone: [
            { validator: validateTelIsNoRequired, trigger: 'blur' }
          ],
          fax: [
            { validator: validateNumberIsNoRequired, trigger: 'blur' }
          ],
          summary: [
            { min: 0, max: 1000, message: '长度必须在1000个字符以内', trigger: 'blur' }
          ],
          //          法定代表人信息
          legalPerson: [
            { required: true, validator: validatePerson, trigger: 'blur' }
          ],
          idNo: [
            { validator: validateIdNoIsNoRequired, trigger: 'blur' }
          ],
          legalPersonMobile: [
            { validator: validateTelIsNoRequired, trigger: 'blur' }
          ],
          address: [
            { min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur' }
          ],
          creditInfo: [
            { min: 0, max: 1000, message: '长度必须在1000个字符以内', trigger: 'blur' }
          ],
          //          股东信息
          shareholderInfo: [
            { min: 0, max: 1000, message: '长度必须在1000个字符以内', trigger: 'blur' }
          ],
          //          公司代理人信息
          proxyPerson: [
            { validator: validatePersonIsNoRequired, trigger: 'blur' }
          ],
          proxyIdNo: [
            { validator: validateIdNoIsNoRequired, trigger: 'blur' }
          ],
          proxyPersonMobile: [
            { validator: validateTelIsNoRequired, trigger: 'blur' }
          ],
          proxyEmail: [
            { validator: validateEmailIsNoRequired, trigger: 'blur' }
          ],
          proxyAddress: [
            { min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur' }
          ],
          //          账户信息
          mobile: [// borrowerUser
            { required: true, validator: validateTel, trigger: 'blur' }
          ],
          accountName: [
            { required: true, validator: validateName, trigger: 'blur' }
          ],
          bankId: [
            { required: true, message: '请选择银行', trigger: 'change' }
          ],
          bankBranch: [
            { required: true, message: '请选择支行', trigger: 'blur change' }
          ],
          bankCard: [
            { required: true, validator: validateBankCard, trigger: 'blur' }
          ],
          bankCardType: [
            { required: true, message: '银行卡类型不能为空', trigger: 'change' }
          ],
          peopleBankCode: [
            { required: true, message: '人行号不能为空', trigger: '' }
          ],
          //        其他信息
          remark: [
            { min: 0, max: 1000, message: '长度必须在1000个字符以内', trigger: 'blur' }
          ]
        },
        borrowerId: TOOLS.getProID(this.$route.params.borrowerId)
      }
    },
    components: {
      breadcrumbNav,
      picUpload
    },
    mounted () {
      this.changeProvinceOption()
      this.getbankList()
      if (this.borrowerId != 0) {
        this.breadcrumName = '修改'
        API.$getBorrowerById(this.borrowerId, res => {
          this.borrowerObj = res.data
          if (this.borrowerObj.registeredCapital) {
            this.borrowerObj.registeredCapital = TOOLS.accDiv(this.borrowerObj.registeredCapital, 1000000)
          }
          if (this.borrowerObj.contributedCapital) {
            this.borrowerObj.contributedCapital = TOOLS.accDiv(this.borrowerObj.contributedCapital, 1000000)
          } else {
            this.borrowerObj.contributedCapital = ''
          }
          TOOLS.setBusinessLicenseCode(this.borrowerObj.businessLicenseCode)
        })
      } else {
        this.breadcrumName = '新增'
      }
    },
    methods: {
      // 检查营业执照/信用代码是否唯一
      checkBusinessLicenseCodeIsOnly (businessLicenseCode) {
        this.businessLicenseCodeIsOnlyVisable = false
        if (!TOOLS.checkNumAndLetter(businessLicenseCode)) {
          return
        }
        if (this.borrowerId != 0) {
          if (TOOLS.getBusinessLicenseCode() === this.borrowerObj.businessLicenseCode) {

          } else {
            this.getCheckBusinessLicenseCode(businessLicenseCode)
          }
        } else {
          this.getCheckBusinessLicenseCode(businessLicenseCode)
        }
      },
      // 获取检查营业执照/信用代码是否重复接口
      getCheckBusinessLicenseCode (businessLicenseCode) {
        API.$checkBusinessLicenseCode(businessLicenseCode, this.borrowerId, res => {
          if (res.success) {
            if (res.data) {
              this.businessLicenseCodeIsOnlyVisable = false
            } else {
              this.businessLicenseCodeIsOnlyVisable = true
            }
          } else {
          }
        })
      },
      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) { // msg返回为数组
        console.log(msg)
        for (var i = 0, len = this.borrowerObj.fileList.length; i < len; i++) {
          if (msg[0] === i) {
            this.borrowerObj.fileList[i][1] = msg[1]
          }
        }
      },
      // 获取省下列拉列表
      changeProvinceOption: function () {
        API.$queryAreaByParentId('', res => {
          if (res.success) {
            this.provinceOption = res.data
          } else {
            alert(res.resultMsg)
          }
        })
      },
      // 获取市下列拉列表
      changeCityOption: function (val) {
        API.$queryAreaByParentId(val, res => {
          this.cityOption = res.data
        })
      },
      // 开户可选的银行列表
      getbankList: function () {
        API.$getbankList(res => {
          this.bankOption = res.data
        })
      },
      // 获取支行模糊查询
      getBranchOption: function (bankBranch) {
        API.$searchBank(this.borrowerObj.bankId, bankBranch, res => {
        //            console.log(res);
          if (bankBranch !== '') {
            this.branchLoading = true
            this.branchOption = res.data
            this.branchOption = []
            setTimeout(() => {
              this.branchLoading = false
              this.branchOption = res.data
              this.borrowerObj.bankBranch = bankBranch
              if (this.branchOption != null) {
                for (let item of this.branchOption) {
                  if (item.branchBankName === this.borrowerObj.bankBranch) {
                    this.borrowerObj.peopleBankCode = item.renhanghao
                    break
                  } else {
                  //                  this.borrowerObj.peopleBankCode="";
                  }
                }
              }
            }, 200)
          } else {
            this.branchOption = []
          }
        })
      },
      //

      // 确认提交
      saveBorrower (formName) {
        if (this.businessLicenseCodeIsOnlyVisable) {
          return
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
          //            if(this.borrowerObj.fileList[0][1]==''){
          //              this.activeNames=['6'];
          //              this.firstValidateVisable=true;
          //              return;
          //            }else{
          //              this.firstValidateVisable=false;
          //            }
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            this.borrowerObj.registeredCapital = TOOLS.yuanToFen(this.borrowerObj.registeredCapital) * 10000
            this.borrowerObj.contributedCapital = TOOLS.yuanToFen(this.borrowerObj.contributedCapital) * 10000
            if (this.borrowerId == 0) {
              API.$borrowerAdd(this.borrowerObj, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success) {
                  this.back()
                } else {
                  this.savebtnDisabled = false
                  this.fullscreenLoading = false
                  alert(res.resultMsg)
                }
              })
            } else {
              this.borrowerObj.fileList.concat(this.$store.state.fileList)
              API.$borrowerUpdate(this.borrowerObj, res => {
                this.savebtnDisabled = false
                if (res.success) {
                  this.back()
                } else {
                  this.savebtnDisabled = false
                  this.fullscreenLoading = false
                  alert(res.resultMsg)
                }
              })
            }
          } else {
            this.activeNames = ['1', '2', '3', '4', '5', '6', '7']
            console.log('error submit!!')
            return false
          }
        })
      },
      back () {
        this.$router.go(-1)
      }

    }

  }
</script>
