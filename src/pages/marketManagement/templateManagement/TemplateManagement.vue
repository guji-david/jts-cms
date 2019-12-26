<template>
  <div class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="templateForm" :model="templateForm" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="模板名称：" prop="templateName">
                <el-input v-model="templateForm.templateName" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
              <el-form-item label="平台：" prop="type">
                <el-select name="type" v-model="templateForm.type">
                  <el-option v-for='x in typeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="渠道名称：" prop="channelName">
             <!-- <el-select
              v-model="templateForm.channelName"
              filterable
              remote
              placeholder="请输入关键词"
              :remote-method="channelPageQuery"
              :loading="loading"
              class="scopeSelect"
            >
              &lt;!&ndash;multiple&ndash;&gt;
              <el-option
                v-for="(item,index) in queryList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>-->
              <el-autocomplete
                class="scopeSelect"
                v-model="templateForm.channelName"
                :fetch-suggestions="channelPageQuery"
                placeholder="请输入内容"
                @select="channelQueryClick"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>


          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="status">
                <el-select name="status" v-model="templateForm.status">
                  <el-option v-for='x in statusOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" :push="1">
            <span class="z-btn-span"  v-if="disabledArray[0] === 'true'"><el-button type="primary" icon="search" @click="searchForm" >查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('templateForm')">重置</el-button> </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar">
      <span class="z-btn-span"  v-if="disabledArray[1] === 'true'"><el-button type="default" icon="plus" @click="addTemplateBtn">新增模板</el-button></span>
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      >
      <el-table-column
        label="模板编号"
        width="100px"
      >
        <template scope="props" >
          <div v-text="(props.$index+1)+(pageNo-1)*pageSize"></div>
        </template>
      </el-table-column>
      <el-table-column
        label="模板名称"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        :formatter="formatterType"
        label="平台"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDate"
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
        width="300px"
      >
        <template scope="scope">
          <el-row>
            <span v-if="disabledArray[3] === 'true'"> <el-button @click="editTemplate(scope.row)" type="text">编辑</el-button></span>
            <span > <el-button @click="viewTemplate(scope.row)" type="text">预览</el-button></span>
            <span v-if="disabledArray[2] === 'true'&&scope.row.status=='10'" > <el-button :disabled="(scope.row.id==activeId)&&statusDisabled" @click="toggleStatus(scope.row,20)"type="text">启用</el-button></span>
            <span v-if="disabledArray[2] === 'true'&&scope.row.status=='20'" > <el-button :disabled="(scope.row.id==activeId)&&statusDisabled"@click="toggleStatus(scope.row,10)"type="text">停用</el-button></span>
            <span v-if="disabledArray[4] === 'true'"> <el-button @click="templateDetail(scope.row)" type="text">查看详情</el-button></span>
          </el-row>


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

    <!-- 对话框 -->
    <!--选择产品-->
    <el-dialog
      title="创建模板的平台"
      size=""
      v-model="choiceTemplateVisable"
    >
      <div class="dialog-template">

        <div class="dialog-btn">
          <el-form :model="modelForm" label-width="200px" ref="modelForm" :rules="rules">
            <el-row>
                <div class="radio-group">
                  <span><el-radio class="radio" v-model="modelForm.platformType" label="20">H5模板</el-radio></span>
                  <span> <el-radio class="radio" v-model="modelForm.platformType" label="10">PC模板</el-radio></span>
                </div>
                <el-form-item label="输入模板名称：" prop="templateName">
                  <div class="inputWarp">
                    <el-input style="width: 80%"
                      v-model="modelForm.templateName"
                    ></el-input>
                  </div>
                </el-form-item>
                <div>
                  <el-button type="primary" @click="addTemplate('modelForm')">开始模板编辑</el-button>
                </div>

            </el-row>

          </el-form>

        </div>
      </div>
    </el-dialog>
  </div>
</template>



<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'

  export default {
    data () {
      let validateTemplateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('模板名称不能为空'))
        } else if (value.length > 20) {
          callback(new Error('模板名称长度不能超过20'))
        } else if (!TOOLS.checkNoSpecialCode(value)) {
          callback(new Error('不能输入特殊符号'))
        } else {
          callback()
        }
      }
      return {
        breadcrumName: '',
        templateForm: {
          templateName: '', // 模板名称
          type: '', // 平台类型
          channelName: '', // 渠道名称
          status: ''// 状态
        },
        tableData: [],
        totalCount: 0,
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        statusOptions: [
          {label: '全部', value: ''},
          {label: '已启用', value: '20'},
          {label: '已停用', value: '10'}],
        typeOptions: [
          {label: '全部', value: ''},
          {label: 'H5模板', value: '20'},
          {label: 'PC模板', value: '10'}
        ],
        platformType: '10',
        disabledArray: [], // 权限控制\1/查询
        choiceTemplateVisable: false, // 选择平台类型弹出框
        tagsLenVisable: false, // 渠道选择提示
        tagsList: [], // 头部模糊搜索列表
        queryList: [], // 模糊查询数据
        loading: false,
        modelForm: {
          templateName: '',
          platformType: '10'
        },
        rules: {
          templateName: [
            {required: true, validator: validateTemplateName, trigger: 'blur'}
          ]
        },
        statusDisabled: false,
        activeId: -1
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
        let len = this.getFunctionList.length
        let i
        for (i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '新增模板':
              this.disabledArray[1] = 'true'
              break
            case '启用/停用':
              this.disabledArray[2] = 'true'
              break
            case '编辑':
              this.disabledArray[3] = 'true'
              break
            case '查看详情':
              this.disabledArray[4] = 'true'
              break
            case '预览':
              this.disabledArray[5] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {
      // 模糊查询
      channelPageQuery (queryString, cb) {
        API.$channelPageQuery({name: queryString}, res => {
          this.queryList = res.list
          for (let x of this.queryList) {
            x.value = x.name
          }
          let results = queryString ? this.queryList.filter(this.createStateFilter(queryString)) : this.queryList
          cb(results)
        })
      },
      // 下拉框筛选
      createStateFilter (queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      // 模糊查询点击
      channelQueryClick (query) {
        this.templateForm.channelName = query.name
      },

      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 时间格式化
      formatterDate (row, column) {
        var date = row[column.property]
        return TOOLS.normalTime(date)
      },
      // 平台转换
      formatterType (row, column) {
        return TOOLS.valueToLabel(this.typeOptions, row[column.property])
      },

      // 状态转换
      formatterStatus (row, column) {
        return TOOLS.valueToLabel(this.statusOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */

      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 这个是pageNo
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 切换状态
      toggleStatus (row, status) {
        this.activeId = row.id
        this.statusDisabled = true
        API.$templateChangeStatus(row.id, status, res => {
          let _this = this
          setTimeout(function () {
            _this.statusDisabled = false
            if (res.success) {
              _this.getTableList(_this.pageNo, _this.pageSize)
            }
          }, 100)
        })
      },
      // 跳转详情
      templateDetail (row) {
        this.$router.push({name: 'TemplateDetail', params: { type: row.type, id: row.id }})
      },

      // 跳转编辑页
      editTemplate (row) {
        TOOLS.clearProData()
        if (row.type === 10) {
          this.$router.push({name: 'EditTemplatePC', params: { type: row.type, id: row.id }})
        } else {
          this.$router.push({name: 'EditTemplateH5', params: { type: row.type, id: row.id }})
        }
      },

      // 模板预览
      viewTemplate (row) {
        console.log('run function viewTemplate')
        window.open(row.viewUrl)
      },

      // 跳转到不同的新增页面
      addTemplate (formName) {
        TOOLS.clearProData()
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.modelForm.platformType == 10) {
              this.$router.push({name: 'EditTemplatePC', params: {type: this.modelForm.platformType, id: 0, name: this.modelForm.templateName}})
            } else {
              this.$router.push({name: 'EditTemplateH5', params: {type: this.modelForm.platformType, id: 0, name: this.modelForm.templateName}})
            }
          } else {
            console.log(valid)
          }
        })
      },

      //  新增模板
      addTemplateBtn () {
        this.choiceTemplateVisable = true
      },

      // 请求数据
      getTableList (pageNo, pageSize) {
        let obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'templateName': this.templateForm.templateName, // 模板名称
          'type': this.templateForm.type, // 平台类型
          'channelName': this.templateForm.channelName, // 渠道名称
          'status': this.templateForm.status// 状态
        }
        API.$templateList(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }

    }
  }
</script>
<style lang="less" scope>
  @import "./TemplateManagement.less";
</style>
