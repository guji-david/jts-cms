<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="推荐人：" prop="inviterUserMobile">
                <el-input v-model="form.inviterUserMobile"  type="tel"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="被推荐人：" prop="beInviterMobile">
                <el-input v-model="form.beInviterMobile"  type="tel"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="建立关系方式：" prop="recommendChannel">
                <el-select v-model="form.recommendChannel">
                  <el-option v-for="x in recommendChannelOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="创建时间：" prop="time">
                <el-date-picker
                  v-model="form.time"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="z-span-20">
              <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button></span>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="document" @click="toEditPage" v-if="disabledArray[1] === 'true'">建立好友关系</el-button></span>
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      style="width: 100%">
      <el-table-column
        prop="inviterUserMobile"
        label="推荐人"
      >
      </el-table-column>
      <el-table-column
        prop="beInviterMobile"
        label="被推荐人"
      >
      </el-table-column>
      <el-table-column
        prop="channel"
        :formatter="formatterRecommendChannel"
        label="建立关系方式"
      >
      </el-table-column>
      <el-table-column
        prop="remark"
        :formatter="formatterRemark"
        label="关联方式"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="dateFormat"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <el-button type="text" @click="delById(scope.row.id)" v-if="disabledArray[2] === 'true'">删除</el-button>
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
        :page-sizes="[5,10,20,40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页结束 -->

  </div>
</template>

<script>
  import * as API from '../../../store/api'
  import * as TOOL from '../../../assets/js/tools'
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'

  export default {
    data () {
      return {
        recommendChannelOptions: TOOL.fetchObj('commonObj').RecommendChannel,
        remarkOptions: TOOL.fetchObj('commonObj').CreateType,
        breadcrumName: '',
        totalCount: 0,
        currentPage: 1,
        form: {
          beInviterMobile: '', // 被推荐人手机号
          inviterUserMobile: '', // 推荐人手机号
          recommendChannel: '', // 建立关系方式
          timeEnd: '', // 结束时间
          timeStart: '', // 开始时间
          time: []// 范围时间
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: []// 权限控制\1/查询,2/建立好友关系,3/删除
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
    mounted () {
      if (this.getFunctionList.length > 0) {
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '建立好友关系':
              this.disabledArray[1] = 'true'
              break
            case '删除':
              this.disabledArray[2] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }

      this.getTablelist()
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 建立关系方式
      formatterRecommendChannel (row, column) {
        return TOOL.valueToLabel(this.recommendChannelOptions, row[column.property])
      },
      // 关联方式
      formatterRemark (row, column) {
        return TOOL.valueToLabel(this.remarkOptions, row[column.property])
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      queryDateChange () {
        if (this.form.time.length) {
          if (this.form.time[0] && this.form.time[1]) {
            this.form.timeStart = this.form.time[0].getTime()
            this.form.timeEnd = this.form.time[1].getTime() + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.timeStart = ''
            this.form.timeEnd = ''
          }
        } else {
          this.form.timeStart = ''
          this.form.timeEnd = ''
        }
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
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
      // 跳转删除页
      toEditPage () {
        this.$router.push({name: 'UserRecommendAdd'})
      },

      delById (id) {
        TOOL.alertConfirm(this, () => {
          API.$userRecommendDelById(id, res => {
            if (res.success) {
              this.getTablelist()
            } else {
              TOOL.alertConfirm(this, '', res.resultMsg)
            }
          })
        }, '您将删除好友关系, 是否继续?')
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTablelist()
      },
      getTablelist () {
        this.queryDateChange()
        var obj = {
          beInviterMobile: this.form.beInviterMobile, // 被推荐人手机号
          inviterUserMobile: this.form.inviterUserMobile, // 推荐人手机号
          recommendChannel: this.form.recommendChannel, // 建立关系方式
          timeEnd: this.form.timeEnd, // 结束时间
          timeStart: this.form.timeStart, // 开始时间
          pageSize: this.pageSize,
          pageNo: this.pageNo
        }
        API.$userRecommendQueryList(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>

<style lang="less" scope>
</style>
