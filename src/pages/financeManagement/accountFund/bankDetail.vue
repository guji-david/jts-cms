<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit-detail">
      <el-form  :model="bankDetailObj" label-width="160px" :rules="rules" ref="bankDetail">
        <el-form-item label="来帐日期：" prop="transDate">
          <el-date-picker type="date" placeholder="选择日期" v-model="bankDetailObj.transDate">

          </el-date-picker>
        </el-form-item>
        <el-form-item label="内部户类型："prop="type" >
          <el-select name="type"v-model="bankDetailObj.type">
            <el-option v-for="x in platformAccountOptions" :value="x.value" :label="x.label" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否浙商卡："prop="flag">
          <el-radio class="radio m2" v-model="bankDetailObj.flag" label="0">是</el-radio>
          <el-radio class="radio m2" v-model="bankDetailObj.flag" label="1">否</el-radio>
        </el-form-item>
        <div >
          <el-row :gutter="20" type="flex" justify="center">
            <el-button type="primary" @click="checkBankDetail('bankDetail')" class="marR10">查询</el-button>
            <el-button type="primary" @click="resetForm('bankDetail')":plain="true" >重置</el-button>
          </el-row>

        </div>
      </el-form>
    </div>

    <!-- 对话框 -->
    <!-- 提示 -->
    <el-dialog title="" v-model="dataDialogVisible" size="large">
      <span v-if="!dataDialogloadVisible">{{popMsg}}</span>
      <div v-else="dataDialogloadVisible">

        <div class="dialog-head" >
          <el-row>
            <el-col :span="8">
                <span style="font-size: 1.5em">可用余额</span>
                <div style="padding: 5px 0">{{balance}}元</div>
            </el-col>
            <el-col :span="8">
                <span style="font-size: 1.5em">昨日余额</span>
                <div style="padding: 5px 0">{{lastBalance}}元</div>
            </el-col>
            <el-col :span="8">
                <span style="font-size: 1.5em">总笔数</span>
                <div style="padding: 5px 0">{{totalCount}}</div>
            </el-col>
          </el-row>

        </div>

        <!-- 列表开始 -->
        <el-table
          :data="tableData"
          border
          style="width: 100%"
         >

          <el-table-column
            prop="payerAcc"
            label="付款账户"
          >
          </el-table-column>
          <el-table-column
            prop="payerAccName"
            label="付款账户户名"
          >
          </el-table-column>
          <el-table-column
            prop="amount"
            :formatter="formatterAmount"
            label="金额"
          >
          </el-table-column>
          <el-table-column
            prop="transTime"
            label="交易时间"
          >
          </el-table-column>

          <el-table-column
            prop="pzh"
            label="凭证号"
          >
          </el-table-column>
          <el-table-column
            prop="addword"
            label="附言"
          >
          </el-table-column>
          <el-table-column
            prop="virtualAcc"
            label="项目虚拟账号"
          >
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
          >

          </el-table-column>
        </el-table>
        <!-- 列表结束 -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"
                   @click="dataDialogVisible = false"
                  v-if="searchBtnViable"

        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
  #z-edit-detail{
    margin-left: 50px;
    margin-top: 50px;
  }
  .dialog-head{
    padding: 20px 0;
    background: #eef1f6;
    color:#1f2d3d;
    text-align: center;
  }
 /* @import "editbankDetail.less";*/
</style>
<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'

  import * as TOOLS from '../../../assets/js/tools'
  import * as API from '../../../store/api'

  export default {
    data () {
//      var validateRate = (rule, value, callback) => {
//        if (!value) {
//          return callback(new Error('额度不能为空'))
//        }
//        setTimeout(() => {
//          if (!TOOLS.checkNum(value)) {
//            callback(new Error('请输入数字值'))
//          } else {
//            if (value.length > 10) {
//              callback(new Error('您输入的长度不能超过10个字符'))
//            } else {
//              callback()
//            }
//          }
//        }, 100)
//      }
      return {
        searchBtnViable: false,
        dataDialogVisible: false,
        dataDialogloadVisible: false,
        popMsg: '',
        tableData: [],
        balance: '',
        lastBalance: '',
        totalCount: '',
        breadcrumName: '',
        bankDetailObj: {
          transDate: '',
          type: '',
          flag: '0'
        },
        rules: {
          transDate: [
            { required: true, type: 'date', message: '来帐日期不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '内部户类型不能为空', trigger: 'blur' }
          ],
          flag: [
            { required: true, trigger: 'blur' }
          ]
        },
        platformAccountOptions: [
          {'label': '营销户(红利账户)', 'value': '222'},
          {'label': '平台内部户即项目虚拟户', 'value': '444'}
        ]
      }
    },
    components: {
      breadcrumbNav
    },

    computed: {
      getFunctionList () {
        if (this.$store.state.functionList.length > 0) {
          return this.$store.state.functionList
        } else {
          this.$store.commit('updataFunctionList', TOOLS.getList('functionList'))
          return this.$store.state.functionList
        }
      }
    },

    mounted () {
      if (this.getFunctionList.length > 0) {
        for (let i = 0, len = this.getFunctionList.length; i < len; i++) {
          if (this.getFunctionList[i].label === '查询') {
            this.searchBtnViable = true
          }
        }
      }

    /*  let platformAccountOptionsList=TOOLS.fetchObj("commonObj").JtsPlatformAccountID;
      platformAccountOptionsList.splice(0,1);
      this.platformAccountOptions=platformAccountOptionsList;
      console.log(" this.platformAccountOptions----->"+JSON.stringify( this.platformAccountOptions)); */
    },
    methods: {
      // 金额转换
      formatterAmount (val) {
        return TOOLS.fenToYuan(val.amount)
      },
      // 确认提交
      checkBankDetail (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.dataDialogVisible = true
            this.popMsg = '数据查询中，请稍后'
            var obj = {
              'transDate': this.bankDetailObj.transDate.getTime(),
              'type': this.bankDetailObj.type,
              'flag': this.bankDetailObj.flag
            }
            API.$searchBankInnerFundsDetail(obj, res => {
              if (res.success) {
                this.dataDialogloadVisible = true
                this.tableData = res.list
                if (this.tableData.length) {
                  for (let i = 0, len = this.tableData.length; i < len; i++) {
                    this.balance = TOOLS.fenToYuan(this.tableData[0].balance)
                    this.lastBalance = TOOLS.fenToYuan(this.tableData[0].lastBalance)
                    this.totalCount = this.tableData[0].totalCount
                  }
                }
                console.log(res)
              } else {
                this.dataDialogloadVisible = false
                this.popMsg = res.resultMsg
              }
            })
          }
        })
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 返回
      back () {
        this.$router.go(-1)
      }

    }

  }
</script>
