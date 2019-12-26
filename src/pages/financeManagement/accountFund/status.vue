<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="search-box-status">
      <el-form  :model="statusObj" label-width="160px" :rules="rules" ref="status">
        <el-row type="flex">
          <el-col :span="8">
            <el-form-item label="充值日期：" prop="qingsuanDate">
              <el-date-picker
                v-model="statusObj.qingsuanDate"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item label="">
             <div>1、查询T日充值资金在T+1日的清算状态</div>
             <div>2、仅在工作日清算</div>
            </el-form-item>
          </el-col>

        </el-row>


        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-button type="primary" @click="queryStatus('status')"v-if="searchBtnViable" class="marR10">查询</el-button>
            <el-button type="primary" @click="resetForm('status')":plain="true" >重置</el-button>
          </el-row>
        </div>

      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 对话框 -->
    <!-- 提示 -->
    <el-dialog title="清算状态" v-model="statusDialogVisible" size="small">
      <span v-if="!statusDialogloadVisible">数据查询中...</span>
      <span v-else="statusDialogloadVisible">{{statusStr}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="statusDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>



<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'

  export default {
    data () {
      return {
        searchBtnViable: false,
        breadcrumName: '',
        statusObj: {
          qingsuanDate: ''
        },
        rules: {
          qingsuanDate: [
            { required: true, type: 'date', message: '充值日期不能为空', trigger: 'blur' }
          ]
        },
        statusStr: '' || '状态为空',
        statusDialogVisible: false,
        statusDialogloadVisible: false

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
    },
    methods: {
      queryStatus (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.statusDialogVisible = true
            API.$financeSearchRechargeSts(this.statusObj.qingsuanDate.getTime(), res => {
              this.statusDialogloadVisible = true
              if (res.success) {
                this.statusStr = (res.data.stt == 1) ? '成功' : '失败'
              } else {
                this.statusStr = '数据查询超时，请重试。'
              }
            }
            )
          }
        })
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style lang="less" scope>
  .search-box-status{
    margin: 100px;

  }
</style>
