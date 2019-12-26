<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="手机号：" prop="mobile">
                <el-input  v-model="form.mobile"placeholder="请输入手机号" type="tel"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="客户姓名：" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名"type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="是否开户：" prop="isOpen">
                <el-select name="type" v-model="form.isOpen">
                  <el-option v-for="x in IsXXXOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="开户类型：" prop="eCardType">
                <el-select name="type" v-model="form.eCardType">
                  <el-option v-for="x in eCardTypeOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="渠道号：" prop="source">
                <el-input v-model="form.source" placeholder="请输入渠道号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="注册时间：" prop="time">
                <el-date-picker
                  v-model="form.time"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="账户冻结状态：" prop="isFreezen">
                <el-select name="type" v-model="form.isFreezen">
                  <el-option v-for="x in freezFormatter" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16" >
            <div class="z-span-20" >
              <el-form-item>
                <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
                <span class="z-btn-span"><el-button  @click="resetForm('form')">重置</el-button></span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      style="width: 100%">
      <el-table-column
        label="手机号码"
      >
        <template scope="scope">
          <div @click="toDetail(scope.row)" class="linkColor">{{scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="客户姓名"
      >
      </el-table-column>
      <el-table-column
        prop="isOpen"
        :formatter='trueOrFalseFomatter'
        label="是否开户"
      >
      </el-table-column>
      <el-table-column
        prop="eCardType"
        :formatter='eCardTypeFomatter'
        label="开户类型"
      >
      </el-table-column>
      <el-table-column
        prop="source"
        label="渠道号"
      >
       <!-- <template scope="scope">
          <span v-if="!scope.row.source">自然用户</span>
        </template>-->
        <!--这里就先用template简答处理一下注册来源的字段-->
      </el-table-column>
      <el-table-column
        prop="riskRating"
        :formatter="riskRatingFomatter"
        label="测评结果"
      >
      </el-table-column>
     <!-- <el-table-column
        prop="isEffective"
        :formatter='trueOrFalseFomatter'
        label="测评结果是否有效"
      >
      </el-table-column>-->
      <el-table-column
        prop="time"
        :formatter="dateFormat"
        label="注册时间"
      >
      </el-table-column>
      <el-table-column
        prop="isFreezen"
        :formatter="FreezenFomatter"
        label="账户冻结状态"
      >
      </el-table-column>
      <el-table-column
        prop="loanTime"
        label="操作"
      >
        <template scope="scope">
          <el-button @click="resetPWD(scope.row)" type="text" v-if="disabledArray[1] === 'true'">重置登录密码</el-button>
          <el-button @click="alertConfirm(scope.row)" type="text" v-if="scope.row.isFreezen=='false'  && disabledArray[2] === 'true'">冻结账户</el-button>
          <!--<el-button @click="resetPWD(scope.row)" type="text" v-if="!scope.row.isFreezen">重置登陆密码</el-button>-->
          <el-button @click="alertConfirm(scope.row)" type="text" v-if="scope.row.isFreezen=='true' && disabledArray[2] === 'true'">解冻账户</el-button>
          <el-button @click="toggleEmployeeUser(scope.row)" type="text" v-if="scope.row.isEmployee == 'false' && disabledArray[3] === 'true'" >置为线下员工</el-button>
          <el-button @click="toggleEmployeeUser(scope.row)" type="text" v-if="scope.row.isEmployee == 'true' && disabledArray[3] === 'true'">置为普通用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表结束 -->

    <!-- 分页开始 -->
    <div class="z-pager" v-if="totalCount>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10,20,40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页结束 -->

    <el-dialog v-model="employeeUserVisable" title="提示"
    >
      <el-row style="text-align: center;width: 100%" >
        <div style="margin: 10px 0;font-size: 20px">{{popMsg}}</div>
        <div  style="text-align: center;margin: 0 120px" v-if="!isEmployee">
          <el-form :model="userForm" label-width="120px" :rules="rules" ref="userForm" >
            <el-form-item label="员工类型：" prop="userChannelType">
              <el-select name="type"v-model="userForm.userChannelType">
                <el-option v-for="x in userChannelTypeOptions" :value="x.source" :label="x.name" ></el-option>
              </el-select>
            </el-form-item>

          </el-form>
        </div>

      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="space-around">
          <el-button type="info" @click="employeeUserBtn('userForm')":disabled="employeeUserBtnDisabled" >确认</el-button>
          <el-button @click="employeeUserVisable = false" >取消</el-button>
        </el-row>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import { Loading } from 'element-ui'

export default {
    data () {
      return {
        breadcrumName: '',
        totalCount: 0,
        currentPage: 1,
        form: {
          mobile: '',
          name: '',
          isOpen: '',
          eCardType: '',
          source: '',
          time: [],
          timeend: '',
          timeStart: '',
          isFreezen: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        eCardTypeOptions: TOOL.fetchObj('commonObj').ECardType, // 这里是不对的,但是没有对应的数据使用
        isFreezenOptions: TOOL.fetchObj('commonObj').IsXXX, // 这里是不对的,但是没有对应的数据使用
        IsXXXOptions: TOOL.fetchObj('commonObj').IsXXX,
        riskRatingOptions: TOOL.fetchObj('commonObj').RiskRating,
        freezFormatter: [
          {
            label: '已冻结',
            value: 'true'
          },
          {
            label: '未冻结',
            value: 'false'
          }
        ], // 冻结状态的转义
        disabledArray: [], // 权限控制\1/查询,2/重置登录密码,3/解冻用户/解冻账户,4/置为普通用户/置为线下员工
        loadingFull: false,
        rowId: '', // 每行的id
        popMsg: '',
        employeeUserVisable: false,
        employeeUserBtnDisabled: false,
        userChannelTypeOptions: [],
        userForm: {
          userChannelType: ''
        },
        rules: {
          userChannelType: [
            { required: true, message: '员工类型不能为空', trigger: 'change' }
          ]
        },
        userId: '',
        //        userChannelType:"",
        isEmployee: '',
        isFreezen: false
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
          this.$store.commit('updataFunctionList', TOOL.getList('functionList'))
          return this.$store.state.functionList
        }
      }
    },
    beforeMount () {
      if (this.getFunctionList.length > 0) {
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '重置登录密码':
              this.disabledArray[1] = 'true'
              break
            case '解冻用户/解冻账户':
              this.disabledArray[2] = 'true'
              break
            case '置为普通用户/置为线下员工':
              this.disabledArray[3] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 是或否转换
      trueOrFalseFomatter (row, column) {
        return TOOL.valueToLabel(this.IsXXXOptions, row[column.property])
      },
      // 评测结果
      riskRatingFomatter (row, column) {
        return TOOL.valueToLabel(this.riskRatingOptions, row[column.property])
      },
      // 冻结状态转换
      FreezenFomatter (row, column) {
        return TOOL.valueToLabel(this.freezFormatter, row[column.property])
      },
      // 卡类型转换
      eCardTypeFomatter (row, column) {
        return TOOL.valueToLabel(this.eCardTypeOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTablelist()
      },

      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },

      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTablelist()
      },

      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTablelist()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 普通用户和线下员工切换
      toggleEmployeeUser (row) {
        this.userChannelTypeOptions = []
        let str = ''
        row.isEmployee === 'true' ? str = '是否置为普通用户?' : str = '是否置为线下员工?'
        row.isEmployee === 'true' ? this.isEmployee = true : this.isEmployee = false
        this.popMsg = str
        this.userId = row.userId
        this.employeeUserVisable = true
        API.$getOffLine(res => {
          let getOffLineList = res.list
          for (let i in getOffLineList) {
            this.userChannelTypeOptions.push({'name': getOffLineList[i].name, 'source': getOffLineList[i].source})
          }
        })
      },
      // 普通用户和线下员工切换确定按钮
      employeeUserBtn (formName) {
        if (!this.isEmployee) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.employeeUserAPI()
            } else {
              TOOL.log('error submit!!')
              return false
            }
          })
        } else {
          this.employeeUserAPI()
        }
      },
      // 普通用户和线下员工切换接口调用
      employeeUserAPI () {
        this.employeeUserBtnDisabled = true
        API.$employeeUser(this.userId, this.userForm.userChannelType, !this.isEmployee, res => {
          this.employeeUserBtnDisabled = false
          if (res.success) {
            this.employeeUserVisable = false
            this.getTablelist()
          } else {
            alert(res.resultMsg)
          }
        })
      },
      // 操作确认框//冻结
      alertConfirm (row) {
        let str = ''
        row.isFreezen === 'true' ? str = '是否确认执行解冻操作??' : str = '是否确认执行冻结操作??'
        row.isFreezen === 'true' ? this.isFreezen = true : this.isFreezen = false
        this.rowId = row.userId
        let element = this.$createElement
        this.$msgbox({
          title: ' ',
          message: element('h3', {style: 'text-align:center'}, str),
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let loadingInstance = Loading.service({fullscreen: true, lock: true})
              API.$freezenUser(this.rowId, !this.isFreezen, res => {
                loadingInstance.close()
                this.getTablelist()
              })
              done()
            } else {
              done()
            }
          }
        })
      },

      // 重置登陆密码
      resetPWD (row) {
        this.rowId = row.userId
        let str = '发送到手机'
        let element = this.$createElement
        this.$msgbox({
          title: '是否确认重置客户登录密码？',
          message: element('label', {style: 'text-align:center'}, str),
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          inputPattern: /^[1][34587][0-9]{9}$/,
          inputErrorMessage: '手机号格式不正确',
          showInput: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let loadingInstance = Loading.service({fullscreen: true, lock: true})
              this.resetAPI(instance.$children[2].currentValue, loadingInstance)
              done()
            } else {
              done()
            }
          }
        })
      },

      // 充值密码接口
      resetAPI (value, loadingInstance) {
        API.$resetUserPassword(this.rowId, value, res => {
          loadingInstance.close()
          if (res.success) {
            TOOL.msgBox(this, '重置成功')
          } else {
            TOOL.msgBox(this, res.resultMsg)
          }
        })
      },

      // 跳转详情
      toDetail (row) {
        TOOL.clearProData()
        this.$router.push({name: 'AccountInfoDetail', params: { mobile: row.mobile }})
      },
      // ajax请求
      getTablelist () {
        if (this.form.time.length) {
          if (this.form.time[0] && this.form.time[1]) {
            this.form.timeStart = +this.form.time[0]
            this.form.timeend = +this.form.time[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.timeStart = ''
            this.form.timeend = ''
          }
        } else {
          this.form.timeStart = ''
          this.form.timeend = ''
        }

        var obj = {
          'mobile': this.form.mobile,
          'name': this.form.name,
          'isOpen': this.form.isOpen,
          'eCardType': this.form.eCardType,
          'source': this.form.source,
          'timeEnd': this.form.timeend,
          'timeStart': this.form.timeStart,
          'isFreezen': this.form.isFreezen,
          'pageNo': this.pageNo,
          'pageSize': this.pageSize
        }
        API.$UserAccount(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .linkColor{
    color:#FF9900;
    cursor: pointer;
  }
</style>
