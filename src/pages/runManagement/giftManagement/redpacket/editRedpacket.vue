<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form  :model="redpacketObj " label-width="160px" ref="ruleForm">
        <el-form-item label="名称："
                      prop="name"
                      :rules="[
                        { required: true, message: '活动名称不能为空', trigger: 'blur' },
                        { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
                      ]">
          <el-input v-model="redpacketObj.name"></el-input>
        </el-form-item>
        <el-form-item label="金额(元)："
                      prop="amount"
                      :rules="[
                        { required: true, message: '金额不能为空'},
                        { type: 'number',min: 0, max: 10000000000,message: '金额不能超过10000000000'}
                      ]" >
          <el-input v-model.number="redpacketObj.amount"></el-input>
        </el-form-item>
        <el-form-item label="有效期(天)："
                      prop="validLimit"
                      :rules="[
                        { required: true, message: '有效期不能为空'},
                        { type: 'number',min: 0, max: 1000,message: '有效期天数不能超过1000'}

                      ]">
          <el-input v-model.number="redpacketObj .validLimit "></el-input>
        </el-form-item>
        <el-form-item label="限投项目类型："
                      prop="productType"
                      :rules="[
                           { required: true, type: 'array', message:'请至少选择一种产品',trigger: 'change' }
                      ]">
          <el-row>
            <el-col :span="3">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </el-col>
            <el-col :span="10">
              <el-checkbox-group v-model="redpacketObj.productType"  @change="handleCheckedProductTypesChange">
                <el-checkbox v-for="item in productTypeOptions"
                             :label="item.value"
                >{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-col>


          </el-row>
        </el-form-item>

        <el-form-item >
          <el-row :gutter="11">
            <el-col :span="9" >
             <span class="z-input-span">*</span> 起投金额(元)
            </el-col>
            <el-col :span="9">
              <span class="z-input-span">*</span>投资产品最低期限(天)
            </el-col>
            <el-col :span="6">
                操作
            </el-col>
          </el-row>
        </el-form-item>
        <div v-for="(domain,index) in  redpacketObj.rule">
          <el-row>
            <el-col :span="9">
              <el-form-item
                :prop="'rule.' + index + '.minAmount'"
                :rules="[
                  { required: true, message: '起投金额不能为空'},
                  { type: 'number',min: 0, max: 100000000,message: '起投金额必须为长度不超过8的正整数'}
                ]">
                <el-input v-model.number="domain.minAmount"></el-input><span> &nbsp;0代表不限制</span>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item
                :prop="'rule.'+index+'.limit'"
                :rules="[
                  { required: true, message: '投资产品最低期限不能为空'},
                  { type: 'number',min: 0, max: 1000,message: '最低期限的长度为不超过3的正整数'}
                ]">
                <el-input v-model.number="domain.limit"></el-input><span> &nbsp;0代表不限制</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button @click.prevent="removeDomain(domain)" v-if="index>0">删除</el-button>
            </el-col>
          </el-row>


        </div>
        <el-form-item label="">
          <el-button @click="addDomain" type="primary" :disabled="(redpacketObj.rule.length>1)">新增规则</el-button>
        </el-form-item>

        <div>
          <el-row :gutter="20" type="flex" justify="center">
          <el-button type="primary" @click="saveRedpacket('ruleForm')"
                     :disabled="savebtnDisabled"
                     v-loading.fullscreen.lock="fullscreenLoading">确认</el-button>
          <el-button style="margin-left: 10px"@click="resetForm('ruleForm')">取消</el-button>
          </el-row>
        </div>
      </el-form>
    </div>
    <!-- 对话框 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span >{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="removeDomainBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->
  </div>


</template>
<style lang="less" scoped>
  @import "editRedpacket.less";
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  import * as TOOLS from '../../../../assets/js/tools'
  import {$insertRedpacket, $updateRedpacketById} from '../../../../store/api'
  export default {
    data () {
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        redpacketObj: {
          id: 0,
          name: '',
          amount: '',
          productType: [],
          validLimit: '',
          rule: [
            { minAmount: '',
              limit: ''}
          ]
        },
        productTypeOptions: '',
        productTypeALLValueList: '',
        checkAll: true,
        isIndeterminate: true,
        redpacketId: TOOLS.getProID(this.$route.params.redpacketId),
        dialogVisible: false,
        msg: '',
        activeIndex: ''
      }
    },
    components: {
      breadcrumbNav
    },

    mounted () {
      // 对产品类型进行处理
      let productTypeOptionsList = TOOLS.fetchObj('commonObj').ProductType
      productTypeOptionsList.splice(0, 1)
      this.productTypeOptions = productTypeOptionsList
      this.productTypeALLValueList = TOOLS.getValueList(this.productTypeOptions)
      if (this.redpacketId != 0) {
        this.breadcrumName = '编辑'
        this.redpacketObj = TOOLS.fetchObj('redpacketObj')
        this.redpacketObj.rule = JSON.parse(this.redpacketObj.rule)
       /* let list = JSON.parse(this.redpacketObj.productType)
        for (let i = 0, len = list.length; i < len; i++) {
          if (list[i] === 'exportRebate') {
            list.splice(i, 1)
          }
        }
        this.redpacketObj.productType = list*/
        this.redpacketObj.productType=JSON.parse(this.redpacketObj.productType)
        for (let item of this.redpacketObj.rule) {
          item.minAmount = TOOLS.fenToYuan(item.minAmount)
        }
        this.redpacketObj.amount = TOOLS.fenToYuan(this.redpacketObj.amount)
      } else {
        this.breadcrumName = '新增'
      }
    },
    methods: {
      // 限投产品类型-全选
      handleCheckAllChange (event) {
        this.isIndeterminate = false
        this.redpacketObj.productType = event.target.checked ? this.productTypeALLValueList : []
      },
      // 限投产品类型-单选checkbox
      handleCheckedProductTypesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.productTypeOptions.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.productTypeOptions.length
      },
      addDomain () {
        this.redpacketObj.rule.push({
          minAmount: '',
          limit: ''
        })
      },
      removeDomain (item) {
        this.dialogVisible = true
        this.msg = '确定删除此条记录吗？'
        this.activeIndex = this.redpacketObj.rule.indexOf(item)
      },
      removeDomainBtn () {
        this.dialogVisible = false
        if (this.activeIndex !== -1) {
          this.redpacketObj.rule.splice(this.activeIndex, 1)
        }
      },
      // 确认提交
      saveRedpacket (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            this.redpacketObj.amount = TOOLS.yuanToFen(this.redpacketObj.amount)
            for (let item of this.redpacketObj.rule) {
              item.minAmount = TOOLS.yuanToFen(item.minAmount)
            }
            if (this.redpacketId == 0) {
              $insertRedpacket(this.redpacketObj, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              $updateRedpacketById(this.redpacketObj, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            }
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
