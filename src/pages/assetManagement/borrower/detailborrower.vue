<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(x,index) in tabsList"
        :name="index+''"
        :label=x
      ></el-tab-pane>
    </el-tabs>
    <div id="z-edit">
      <el-form >
        <div  v-if="activeName==0">
          <el-form-item label="企业名称：">
            <span>{{borrowerObj.borrowerName}}</span>
          </el-form-item>
          <el-form-item label="营业执照/信用代码：">
            <span>{{borrowerObj.businessLicenseCode}}</span>
          </el-form-item>
          <!--<el-form-item label="税务登记号：">
            <span>{{borrowerObj.taxCode}}</span>
          </el-form-item>
          <el-form-item label="组织机构代码：">
            <span>{{borrowerObj.institutionCode}}</span>
          </el-form-item>
          <el-form-item label="经营许可证号：">
            <span>{{borrowerObj.businessPermit}}</span>
          </el-form-item>-->
          <el-form-item label="注册地址：">
            <span>{{borrowerObj.businessAddress}}</span>
          </el-form-item>
          <el-form-item label="机构类型：">
            <span>{{unitType}}</span>
          </el-form-item>
          <el-form-item label="注册资本：">
            <span>{{borrowerObj.registeredCapital}}万元</span>
          </el-form-item>
          <el-form-item label="实缴资本：">
            <span>{{borrowerObj.contributedCapital}}</span><span v-if="borrowerObj.contributedCapital!=null">万元</span>
          </el-form-item>
          <el-form-item label="成立时间：">
            <span>{{foundingTime}}</span>
          </el-form-item>
          <el-form-item label="所在地区：">
            <span>{{businessProvince}}{{businessCity}}</span>
          </el-form-item>
          <el-form-item label="公司办公地址：">
            <span>{{borrowerObj.workAddress}}</span>
          </el-form-item>
          <el-form-item label="经营区域：">
            <span>{{borrowerObj.managementArea}}</span>
          </el-form-item>
          <el-form-item label="邮政编码：">
            <span>{{borrowerObj.postalCode}}</span>
          </el-form-item>
          <el-form-item label="公司电话：">
            <span>{{borrowerObj.phone}}</span>
          </el-form-item>
          <el-form-item label="公司传真：">
            <span>{{borrowerObj.fax}}</span>
          </el-form-item>
          <el-form-item label="公司介绍：">
            <span>{{borrowerObj.summary}}</span>
          </el-form-item>
        </div>
        <div  v-if="activeName==1">
          <el-form-item label="姓名：">
            <span>{{borrowerObj.legalPerson}}</span>
          </el-form-item>
          <el-form-item label="身份证号：">
            <span>{{borrowerObj.idNo}}</span>
          </el-form-item>
          <el-form-item label="联系电话：">
            <span>{{borrowerObj.legalPersonMobile}}</span>
          </el-form-item>
          <el-form-item label="家庭住址：">
            <span>{{borrowerObj.address}}</span>
          </el-form-item>
          <el-form-item label="信用信息：">
            <span>{{borrowerObj.creditInfo}}</span>
          </el-form-item>
        </div>
        <div  v-if="activeName==2">
          <el-form-item label="股东信息：">
            <span>{{borrowerObj.shareholderInfo}}</span>
          </el-form-item>
        </div>
        <div v-if="activeName==3">
          <el-form-item label="姓名：">
            <span>{{borrowerObj.proxyPerson}}</span>
          </el-form-item>
          <el-form-item label="身份证号：">
            <span>{{borrowerObj.proxyIdNo}}</span>
          </el-form-item>
          <el-form-item label="联系电话：">
            <span>{{borrowerObj.proxyPersonMobile}}</span>
          </el-form-item>
          <el-form-item label="邮箱：">
            <span>{{borrowerObj.proxyEmail}}</span>
          </el-form-item>
          <el-form-item label="家庭住址：">
            <span>{{borrowerObj.proxyAddress}}</span>
          </el-form-item>
        </div>
        <div  v-if="activeName==4">
          <el-form-item label="最高可借额度(元)：">
            {{borrowerObj.accountBalance}}
          </el-form-item>
          <el-form-item label="剩余可借额度(元)：">
            {{borrowerObj.borrowerMaxTenderAmount}}
          </el-form-item>
        </div>
        <div  v-if="activeName==5">
          <!-- 列表开始 -->
          <el-table
            :data="tableData"
            border
          >

            <el-table-column
              prop="accountName"
              label="开户人名称"
            >

            </el-table-column>

            <el-table-column
              prop="bankName"
              label="开户银行"
            >
            </el-table-column>

            <el-table-column
              prop="bankBranch"
              label="开户支行"
            >
            </el-table-column>

            <el-table-column
              prop="accountType"
              :formatter="formatterAccountType"
              label="账户类型"
            >
            </el-table-column>

            <el-table-column
              prop="bankCard"
              label="银行卡号"
            >
            </el-table-column>
            <el-table-column
              prop="accountName"
              label="银行卡户名"
            >
            </el-table-column>
            <el-table-column
              prop="bankCardType"
              :formatter="formatterBankCardType"
              label="银行卡类型"
            >
            </el-table-column>
          </el-table>
          <!-- 列表结束 -->
          <!-- 分页开始 -->
          <div class="z-pager">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 20, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </div>
          <!-- 分页结束 -->
        </div>
        <div  v-if="activeName==6">

          <el-form-item :label="item[0]"type="flex"v-for="item in borrowerObj.fileList"  v-if="item[1]!=''">
            <img width="100px" height="80px":src="domain+item[1]" alt="">
          </el-form-item>

        </div>
        <div v-if="activeName==7">
          <el-form-item label="备注："prop="remark">
            <span>{{borrowerObj.remark}}</span>
          </el-form-item>
        </div>
        <div style="border-top: 1px solid #bfcbd9" v-if="type==1">
          <el-form :model="approvalData " ref="ruleForm" label-width="160px">
            <el-form-item label="审核结果：">
              <el-radio class="radio m2" v-model="approvalData.auditFlag " label="success">通过</el-radio>
              <el-radio class="radio m2" v-model="approvalData.auditFlag " label="refuse">未通过</el-radio>
            </el-form-item>
            <el-form-item label="审核意见："  prop="auditContent"
                          :rules="[
                   { required: true, message: '审核意见不能为空', trigger: 'blur' },
                  { min: 0, max: 200, message: '长度必须在200个字符以内', trigger: 'blur' }

                    ]"
            >
              <el-input
                type="textarea"
                :rows="8"
                placeholder="请输入审核意见"
                v-model="approvalData.auditContent ">
              </el-input>
            </el-form-item>

          </el-form>

        </div>
        <div style="padding:20px 0px 50px 0px; text-align:center"  v-if="type==1">
          <el-row :gutter="20" type="flex" justify="center">
            <el-button type="primary"
                       class="el-button el-button--primary marR10"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       @click="borrowerAudit('ruleForm')">保存</el-button>
            <el-button :plain="true"  @click="resetForm('ruleForm')" class="btn">取消</el-button>
          </el-row>

        </div>

        <div style="padding:20px 0px 50px 0px; text-align:center"  v-if="type!=1">
          <el-button :plain="true" style="margin-left: 10px" type="primary" size="" @click="back" class="btn">返回</el-button>
        </div>
      </el-form>
    </div>

    <!-- 批量操作没有选择任何列的时候提示 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span>{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
  @import "./detailborrower.less";

</style>
<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'

  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'
  export default {
    data () {
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        borrowerObj: {
          businessProvince: '',
          businessCity: ''
        },
        businessProvince: '',
        businessCity: '',
        bankName: '',
        bankCity: '',
        activeName:'0',
        approvalData: {
          auditFlag: 'refuse',
          auditContent: ''
        },
        domain: TOOLS.getDomain(),
        borrowerId: TOOLS.getProID(this.$route.params.borrowerId), // 借款人id
        type: TOOLS.getProType(this.$route.params.type),
        dialogVisible: false,
        msg: '',
        tabsList: [ '企业资料','法定代表人信息','股东信息','公司代理人信息','限额信息','银行卡信息','附件资料','其他信息'],
        tableData: [],
        currentPage: 1,
        pageNo: 1,
        pageSize: 5,
        totalCount: 0,
      }
    },

    computed: {
      // 计算属性的 getter 机构类型转换
      foundingTime: function () {
        return TOOLS.normalTimeDay(this.borrowerObj.foundingTime)
      },
      unitType: function () {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').BorrowerType, this.borrowerObj.unitType)
      },


    },

    components: {
      breadcrumbNav
    },

    mounted () {
      if (this.type == 0) {
        this.breadcrumName = '详情'
      } else {
        this.breadcrumName = '审核'
      }

      API.$getBorrowerById(this.borrowerId, res => {
        if (res.success) {
          this.borrowerObj = res.data
          if (this.borrowerObj.registeredCapital) {
            this.borrowerObj.registeredCapital = TOOLS.accDiv(this.borrowerObj.registeredCapital, 1000000)
          }
          if (this.borrowerObj.contributedCapital) {
            this.borrowerObj.contributedCapital = TOOLS.accDiv(this.borrowerObj.contributedCapital, 1000000)
          }

          this.borrowerObj.accountBalance = TOOLS.fenToYuan(this.borrowerObj.accountBalance)
          this.borrowerObj.borrowerMaxTenderAmount = this.borrowerObj.accountBalance - TOOLS.fenToYuan(this.borrowerObj.frozenBalance)
//          // 通过id获取银行名字
//          if (this.borrowerObj.bankId) {
//            API.$getBankNameById(this.borrowerObj.bankId, res => {
//              if (res.success) {
//                if (res.data) {
//                  this.bankName = res.data.name
//                } else {
//                  this.bankName = ''
//                }
//              } else {
//                this.dialogVisible = true
//              }
//            })
//          }

          // 获取企业资料所在地区省份
          if (this.borrowerObj.businessProvince) {
            API.$queryAreaById(this.borrowerObj.businessProvince, res => {
              if (res.success) {
                this.businessProvince = res.data.name
              } else {
                alert(res.resultMsg)
              }
            })
          }

          // 获取企业资料所在地区市区
          if (this.borrowerObj.businessCity) {
            API.$queryAreaById(this.borrowerObj.businessCity, res => {
              if (res.success) {
                this.businessCity = res.data.name
              } else {
                alert(res.resultMsg)
              }
            })
          }
        } else {
          this.dialogVisible = true
          this.msg = res.resultMsg
        }
      })
    },
    methods: {
//      tab切换
      handleClick(tab, event) {
        if(tab.name==5){
          this.getTablelist(this.pageNo, this.pageSize)
        }

      },
      getTablelist(pageNo, pageSize){
        let obj={
          'pageNo': pageNo,
          'pageSize': pageSize,
          id:this.borrowerId
        }
        API.$getPageAccountsByBorrowerId(obj, res => {
          if (res.success) {
            this.tableData = res.list
            this.totalCount = res.totalCount
          }


        })
      },
      // 更改每页多少条
      handleSizeChange (val) {
        this.pageSize = val
        this.getTablelist(this.pageNo, this.pageSize)
        TOOLS.log(`每页 ${val} 条`)
      },

      // 更改页码
      handleCurrentChange (val) {
        this.pageNo = val
        this.currentPage = val
        this.getTablelist(val, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      formatterBankCardType: function (row, column) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').BankCardType, row[column.property])
      },
      formatterAccountType:function (row, column) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').BorrowerAccountType, row[column.property])
      },
      // 借款人审核提交
      borrowerAudit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            API.$borrowerAudit(this.borrowerId, this.approvalData.auditFlag, this.approvalData.auditContent, res => {
              this.savebtnDisabled = false
              this.fullscreenLoading = false
              if (res.success) {
                this.back()
              } else {
                alert(res.resultMsg)
              }
            })
          } else {
            TOOLS.log('error submit!!')
            return false
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
