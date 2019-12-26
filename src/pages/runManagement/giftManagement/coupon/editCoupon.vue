<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form  :model="couponObj" label-width="160px" :rules="rules" ref="coupon">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="couponObj.name"></el-input>
        </el-form-item>
        <el-form-item label="额度(%)："prop="rate" >
          <el-input v-model.number="couponObj.rate"></el-input>
        </el-form-item>
        <el-form-item label="有效期(天)："prop="validLimit" >
          <el-input v-model.number="couponObj.validLimit"></el-input>
        </el-form-item>
        <el-form-item label="限投项目类型" prop="productType">
          <el-row>
            <el-col :span="3">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </el-col>
            <el-col :span="10">
              <el-checkbox-group v-model="couponObj.productType"  @change="handleCheckedProductTypesChange">
                <el-checkbox v-for="item in productTypeOptions"
                             :label="item.value"
                >{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-col>


          </el-row>

        </el-form-item>
        <el-form-item label="最高加息本金(元)： "prop="maxRateAmount" >
          <el-input v-model.number="couponObj.maxRateAmount"></el-input><span> &nbsp;0代表不限制</span>
        </el-form-item>
        <el-form-item label="最高加息时长(天)： "prop="maxRateLimit" >
          <el-input v-model.number="couponObj.maxRateLimit"></el-input><span> &nbsp;0代表不限制</span>
        </el-form-item>
        <el-form-item label="最低投资金额(元)： "prop="minInvestAmount" >
          <el-input v-model.number="couponObj.minInvestAmount"></el-input><span> &nbsp;0代表不限制</span>
        </el-form-item>
        <el-form-item label="最低投资期限(天)："prop="minInvestLimit" >
          <el-input v-model.number="couponObj.minInvestLimit"></el-input><span> &nbsp;0代表不限制</span>
        </el-form-item>
        <div class="btnDiv">
            <el-button type="primary" @click="saveCoupon('coupon')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       class="marR10"
            >确认</el-button>
          <el-button type="primary" @click="resetForm('coupon')":plain="true" >取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editCoupon.less";
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  import * as TOOLS from '../../../../assets/js/tools'
  import {$insertCoupon, $updateCouponById} from '../../../../store/api'

  export default {
    data () {
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        couponObj: {
          id: 0,
          name: '',
          rate: '',
          validLimit: '',
          productType: [],
          maxRateAmount: '',
          maxRateLimit: '',
          minInvestAmount: '',
          minInvestLimit: ''
        },
        rules: {
          name: [
            { required: true, message: '活动名称不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          rate: [
            {required: true, message: '额度不能为空'},
            { type: 'number', min: 0, max: 1000, message: '长度为不超过3的正整数', trigger: 'blur' }
          ],
          validLimit: [
            {required: true, message: '额度不能为空'},
            { type: 'number', min: 1, max: 1000, message: '长度为不超过3的正整数且不能0', trigger: 'blur' }
          ],
          productType: [
            { required: true, type: 'array', message: '请至少选择一种产品', trigger: 'change' }
          ],
          maxRateAmount: [
            {required: true, message: '最高加息本金不能为空'},
            { type: 'number', min: 0, max: 10000000000, message: '您输入的长度不能超过10个字符', trigger: 'blur' }
          ],
          maxRateLimit: [
            {required: true, message: '最高加息时长不能为空'},
            { type: 'number', min: 0, max: 1000, message: '长度为不超过3的正整数', trigger: 'blur' }
          ],
          minInvestAmount: [
            {required: true, message: '最低投资金额不能为空'},
            { type: 'number', min: 0, max: 10000000000, message: '您输入的长度不能超过10个字符', trigger: 'blur' }
          ],
          minInvestLimit: [
            {required: true, message: '最低投资期限不能为空'},
            { type: 'number', min: 0, max: 1000, message: '长度为不超过3的正整数', trigger: 'blur' }
          ]

        },
        productTypeOptions: '',
        productTypeALLValueList: '',
        checkAll: true,
        isIndeterminate: true,
        couponId: TOOLS.getProID(this.$route.params.couponId)
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
      if (this.couponId != 0) {
        this.breadcrumName = '编辑'
        this.couponObj = TOOLS.fetchObj('counponObj')

       /* let list = JSON.parse(this.couponObj.productType)
        for (let i = 0, len = list.length; i < len; i++) {
          if (list[i] === 'exportRebate') {
            list.splice(i, 1)
          }
        }
        this.couponObj.productType = list*/
        this.couponObj.productType = JSON.parse(this.couponObj.productType)

        this.couponObj.maxRateAmount = TOOLS.fenToYuan(this.couponObj.maxRateAmount)
        this.couponObj.minInvestAmount = TOOLS.fenToYuan(this.couponObj.minInvestAmount)
      } else {
        this.breadcrumName = '新增'
      }
    },
    methods: {
      // 限投产品类型-全选
      handleCheckAllChange (event) {
        this.isIndeterminate = false
        this.couponObj.productType = event.target.checked ? this.productTypeALLValueList : []
      },
      // 限投产品类型-单选checkbox
      handleCheckedProductTypesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.productTypeOptions.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.productTypeOptions.length
      },
      // 确认提交
      saveCoupon (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            this.couponObj.maxRateAmount = TOOLS.yuanToFen(this.couponObj.maxRateAmount)
            this.couponObj.minInvestAmount = TOOLS.yuanToFen(this.couponObj.minInvestAmount)
            if (this.couponId == 0) {
              $insertCoupon(this.couponObj, res => {
                if (res.success) {
                  this.savebtnDisabled = false
                  this.fullscreenLoading = false
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              $updateCouponById(this.couponObj, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                this.back()
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
