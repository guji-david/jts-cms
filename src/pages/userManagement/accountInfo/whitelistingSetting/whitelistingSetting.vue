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
                <el-input v-model="form.mobile"  type="text" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="所属：" prop="source">
                <el-input v-model="form.source"  type="tel" placeholder="请输入所属"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0]">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button></span>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="my-z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="plus" @click="addUserCsv" v-if="disabledArray[1]">新增</el-button></span>
      <span class="z-btn-span"><el-button type="text"  @click="updateCache" v-if="disabledArray[2]">更新缓存</el-button></span>
    </div>
    <div class="my-z-tool-bar" v-if="disabledArray[3]">
      <div class="my-el-button" :class="{myElButtonActive:activeIndex==index}"v-for="(item,index) in shiftTabList" @click="shiftBtn(index)">{{item}}</div>
    </div>
    <div class="z-tool-bar"v-if="disabledArray[3]">
      <span class="z-btn-span":class="{hidden:activeIndex==1}"style="margin-left: 20px;" >
        <el-button  type="text"  @click="allChangeStatusBtn(0)" >全部启用</el-button></span>
      <span class="z-btn-span":class="{hidden:activeIndex==2}" style="margin-left: 40px;">
        <el-button  type="text"  @click="allChangeStatusBtn(1)" >全部停用</el-button></span>
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      style="width: 100%">
      <el-table-column
        label="手机号"
      >
        <template scope="scope">
          <div @click="toDetail(scope.row)" class="linkColor">{{scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="source"
        label="所属"
      >
      </el-table-column>

      <el-table-column
        prop="createTime"
        :formatter="formatUpdateTime"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="formatterStatus"
        label="状态"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <el-row>
            <span v-if="scope.row.status==10"> <el-button @click="toggleChangeStatus(scope.row,20)" type="text" v-if="disabledArray[4] ">启用</el-button></span>
            <span v-if="scope.row.status==20"> <el-button @click="toggleChangeStatus(scope.row,10)"type="text" v-if="disabledArray[4]">停用</el-button></span>
          </el-row>
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

    <!-- 对话框 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span >{{msg}}</span>
      <span slot="footer" class="dialog-footer" v-if="btnVisable">
        <el-button type="default" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toggleChangeStatusBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->

  </div>
</template>

<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  export default {
    data () {
      return {
        breadcrumName: '投标贷白名单',
        totalCount: 0,
        currentPage: 1,
        form: {
          mobile: '',
          source: '', // 所属
          status: '', // 状态
        },
        shiftTabList:['全部', '启用', '停用'],
        activeIndex:0,
        statusOptions: [
          {
            label: '启用',
            value: 20
          },
          {
            label: '停用',
            value: 10
          }
        ],
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: [],// 权限控制
        dialogVisible: false,
        msg: '',
        activeId: '',
        activeStatus: '',
        activeType: '',//10 更新单条记录 20更新全部记录
        btnVisable:true
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
              this.disabledArray[0] = true
              break
            case '新增':
              this.disabledArray[1] = true
              break
            case '更新缓存':
              this.disabledArray[2] = true
              break
            case '全部':
              this.disabledArray[3] = true
              break
            case '启用/停用':
              this.disabledArray[4] = true
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getTablelist()
    },
    methods: {
      // 跳转详情
      toDetail (row) {
        TOOL.clearProData()
        this.$router.push({name: 'AccountInfoDetail', params: { mobile: row.mobile }})
      },
      /* --------------------------------------------格式转换----------------------------------------------------------- */

      // 状态转换
      formatterStatus (val) {
        return TOOL.valueToLabel(this.statusOptions, val.status)
      },
      // 时间转换
      formatUpdateTime (val) {
        return TOOL.normalTime(val.createTime)
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
        this.getTablelist()
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
      //  新增白名单
      addUserCsv () {
        this.$router.push({ name: 'AddUserCsv' })
      },
      //  更新缓存
      updateCache () {
        API.$updateCache(res => {
          this.dialogVisible = true
          if(res.data){
            this.btnVisable = false
            this.msg ='缓存更新成功！'
            setTimeout(() => {
              this.dialogVisible = false
            }, 1000)
          }else{
            this.btnVisable = false
            this.msg =res.resultMsg
            setTimeout(() => {
              this.dialogVisible = false
            }, 1000)
          }
        })
      },
      // 切换tab
      shiftBtn(index){
        this.activeIndex=index;
        this.$refs['form'].resetFields();
        if(index==1){
          this.form.status=20
        }else if(index==2){
          this.form.status=10
        }else {
          this.form.status=''
        }
        this.getTablelist()
      },
      //全部转换按钮
      allChangeStatusBtn(index){
        this.btnVisable = true;
        this.activeId='';
        this.activeType=20;
        if(!!index){
          this.activeStatus=10;
        }else{
          this.activeStatus=20;
        }
        this.msg = this.activeStatus==20 ? '您确定 全部启用 此条数据？' : '您确定 全部停用 此条数据？'
        this.dialogVisible=true;
      },
      // 切换是否停用
      toggleChangeStatus (row, status) {
        this.activeId = row.id
        this.activeStatus = status
        this.msg = status==20 ? '您确定 启用 此条数据？' : '您确定 停用 此条数据？'
        this.activeType=10;
        this.dialogVisible = true
        this.btnVisable = true
      },
      //      切换是否停用 二次确认按钮
      toggleChangeStatusBtn () {
        API.$changeUserStatus(this.activeId, this.activeStatus,this.activeType, res => {
          setTimeout(() => {
            this.getTablelist()
            this.dialogVisible = false;
          }, 100)

        })
      },
      //获取列表
      getTablelist () {
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'mobile': this.form.mobile,
          'source': this.form.source,
          'status': this.form.status,
        }
        API.$UserQuery(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

    }
  }
</script>

<style lang="less" scoped>
  .hidden{
    visibility: hidden;
  }
  .linkColor{
    color:#FF9900;
    cursor: pointer;
  }
  .my-z-tool-bar{
    height: 45px;
    line-height: 45px;
    padding: 10px 10px 10px 0px;
  }
  .my-el-button{
    transition: background 0.5s ease-in, color 0.3s ease-out;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background-color: #dfe6ec;
    border: 1px solid #bfcbd9;
    color: #1f2d3d;
    margin-right:5px ;
    padding: 15px 50px;
    outline: 0;
    text-align: center;
  }
  .my-el-button:hover,.myElButtonActive{
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
  }
</style>
