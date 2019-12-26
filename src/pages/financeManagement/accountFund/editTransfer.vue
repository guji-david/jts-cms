<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="search-box-transfer">
      <el-form  :model="transferObj" label-width="160px" :rules="rules" ref="transfer">
        <el-row type="flex">
          <el-col :span="16">
            <el-form-item label="资金划转类型：" prop="fundTransferType">
              <el-select name="type"v-model="transferObj.fundTransferType">
                <el-option v-for="x in fundTransferTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row type="flex">
          <el-col :span="16">
            <el-form-item label="付款金额：" prop="amount">
              <el-input v-model.number="transferObj.amount"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row type="flex">
          <el-col :span="16">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model.trim="transferObj.remark"></el-input>
            </el-form-item>
          </el-col>

        </el-row>


        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-button type="primary" :disabled="savebtnDisabled" @click="queryTransfer('transfer')" class="marR10">确认</el-button>
            <el-button type="primary" @click="resetForm('transfer')":plain="true" >取消</el-button>
          </el-row>
        </div>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 对话框 -->
    <!-- 批量操作没有选择任何列的时候提示 -->
    <el-dialog title="提示" v-model="transferDialogVisible" size="tiny">
      <span>{{transferStr}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog()">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>



<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
//  import * as TOOLS from '../../../assets/js/tools'

  export default {
    data () {
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        fundTransferTypeOptions: [
          {'label': '平台自有资金账户划拨至过渡户', 'value': '1'},
          {'label': '平台自有资金账户划拨至营销户', 'value': '3'},
          {'label': '营销户划拨至平台自有资金账户', 'value': '4'}
        ],
        transferObj: {
          fundTransferType: '',
          amount: '',
          remark: ''
        },
        rules: {
          fundTransferType: [
            { required: true, message: '资金划转类型不能为空', trigger: 'blur' }
          ],
          amount: [
            {required: true, message: '付款金额不能为空'},
            {type: 'number', min: 0, max: 10000000000, message: '长度为不超过10的正整数'}
          ]
        },
        transferStr: '',
        transferDialogVisible: false
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      this.breadcrumName = '新增'
    /* let fundTransferTypeOptionsList=TOOLS.fetchObj("commonObj").FundTransferType;
    fundTransferTypeOptionsList.splice(0,1);
    this.fundTransferTypeOptions=fundTransferTypeOptionsList; */
    },
    methods: {
      closeDialog () {
        this.transferDialogVisible = false
        this.savebtnDisabled = false
      },
      // 确认
      queryTransfer (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            API.$financeInnerTransferRequest(this.transferObj.fundTransferType, this.transferObj.amount, this.transferObj.remark, res => {
              this.transferDialogVisible = true
              this.fullscreenLoading = false
              if (res.success) {
                this.transferStr = res.data.stt
              //                  this.back();
              } else {
                this.transferStr = res.resultMsg
              }
            }
            )
          }
        })
      },
      // 返回
      back () {
        this.$router.go(-1)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.back()
      }
    }
  }
</script>
<style lang="less" scope>
  .el-select{
    /*width: 100%;*/
  }
  .search-box-transfer{
    margin: 100px;

  }
</style>
