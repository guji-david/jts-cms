<template>
  <div id="content-body" class="content-body">
    <div v-if="!comVisable">
      <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    </div>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="couponForm" label-width="120px"  ref="couponForm" onsubmit="return false">
        <el-row>
          <el-col :span="8" v-if="!comVisable">
            <div class="z-span-20">
              <el-form-item label="加息券ID：" prop="id">
                <el-input v-model.trim="couponForm.id"
                          placeholder="请输入加息券ID"
                          @keyup.enter.native="searchForm()">

                </el-input>
              </el-form-item>
            </div>

          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="加息券名称：" prop="name">
                <el-input v-model.trim="couponForm.name"
                          placeholder="请输入加息券名称"
                          @keyup.enter.native="searchForm()">

                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"><el-button type="primary" icon="search"@click="searchForm()"v-if="searchBtnViable">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('couponForm')">重置</el-button> </span>
            </div>
          </el-col>

        </el-row>

      </el-form>
    </div>
    <!-- 搜索结束 -->

    <div class="z-tool-bar" v-if="!comVisable">
      <span class="z-btn-span"><el-button type="primary" icon="plus"@click="addCoupon"v-if="addBtnViable">新增</el-button></span>
    </div>

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        fixed
        type="selection"
        v-if="comVisable"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        v-if="!comVisable"
       >
      </el-table-column>
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
        width="125">
      </el-table-column>
      <el-table-column
        prop="maxRateAmount"
        label="最高加息本金(元)"
        :formatter="formatterMaxRateAmount"
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
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatterDate"
       >
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
        v-if="!comVisable"
      >
        <template scope="scope">
          <div id="cellCoupon">
            <el-button @click="editCoupon(scope.row)"type="text" v-if="updateBtnViable">编辑</el-button>
            <el-button @click="delCoupon(scope.$index,scope.row)"type="text" v-if="delBtnViable">删除</el-button>
          </div>

        </template>
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

    <!-- 删除的时候提示 -->
    <el-dialog title="提示" v-model="delDialogVisible" size="tiny" :show-close="false">
      <span>{{popMessage}} <em style="color: #ff4949;"v-if="dataIsNotDeleteVisable">此条数据不能删除</em></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="delCancelBtn">取 消</el-button>
        <el-button type="primary" @click="delCouponBtn":disabled="delDisabled">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scope>
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import {$queryCoupon, $delCouponById} from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    props: ['comVisable'],
    data () {
      return {
        searchBtnViable: false,
        addBtnViable: false,
        updateBtnViable: false,
        delBtnViable: false,
        delDisabled: false,
        myComVisable: this.comVisable,
        dataIsNotDeleteVisable: false,
        popMessage: '',
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        updataDialogVisible: false,
        delDialogVisible: false,
        couponForm: {
          id: '',
          name: '',
          isDel: false
        },
        tableData: [],
        currentId: 0,
        currentIndex: 0
      }
    },
    watch: {
      comVisable (val) {
        this.myComVisable = val
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
          if (this.getFunctionList[i].label === '新增') {
            this.addBtnViable = true
          }
          if (this.getFunctionList[i].label === '编辑') {
            this.updateBtnViable = true
          }
          if (this.getFunctionList[i].label === '删除') {
            this.delBtnViable = true
          }
        }
      }
      this.getCouponList(this.pageNo, this.pageSize)
    },
    methods: {
      // 产品类型转换
      formatterProductType (val) {
        return TOOLS.valueToLabelListStr(TOOLS.fetchObj('commonObj').ProductType, JSON.parse(val.productType))
      },
      // 最高加息本金转换
      formatterMaxRateAmount (val) {
        return TOOLS.fenToYuan(val.maxRateAmount)
      },
      // 最低投资金额转换
      formatterMinInvestAmount (val) {
        return TOOLS.fenToYuan(val.minInvestAmount)
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },
      // 获取加息券列表
      getCouponList (pageNo, pageSize) {
        let obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'id': this.couponForm.id,
          'name': this.couponForm.name,
          'isDel': this.couponForm.isDel
        }
        $queryCoupon(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
        TOOLS.log('this.multipleSelection', this.multipleSelection)
        this.$emit('childToFatherTransferEvent', val)
      },
      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getCouponList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getCouponList(this.pageNo, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getCouponList(this.pageNo, this.pageSize)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //  新增红包
      addCoupon () {
        TOOLS.clearProData()
        this.$router.push({name: 'EditCoupon', params: { couponId: 0 }})
      },
      // 编辑
      editCoupon (row) {
        TOOLS.clearProData()
        TOOLS.saveObj('counponObj', row)
        this.$router.push({name: 'EditCoupon', params: {couponId: row.id}})
      },
      // 删除
      delCoupon (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
        this.popMessage = '确定要删除选择的数据？'
      },
      // 删除确定按钮
      delCouponBtn () {
        this.delDisabled = false
        this.dataIsNotDeleteVisable = false
        $delCouponById(this.currentId, res => {
          if (res.success) {
            this.tableData.splice(this.currentIndex, 1)
            this.delDisabled = false
            this.delDialogVisible = false
            this.getCouponList(this.pageNo, this.pageSize)
          } else {
            this.delDisabled = true
            this.dataIsNotDeleteVisable = true
            this.popMessage = res.resultMsg
            this.delDialogVisible = true
          }
        })
      },
      // 删除放弃按钮
      delCancelBtn () {
        this.delDisabled = false
        this.delDialogVisible = false
        this.dataIsNotDeleteVisable = false
      }
    }
  }
</script>
