<template>
  <div class="content-body test">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <div id="z-edit">
      <el-form label-width="220px">
        <el-form-item label="模板名称：">
          <span v-text="modeName"></span>
        </el-form-item>
        <div v-for="item in tableData">
          <el-form-item :label="item.channelName+'：'">
            <span v-text="item.url"></span>
          </el-form-item>
        </div>
      </el-form>

    </div>

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
    <div class="back-btn">
      <el-button @click="back()" type="primary" class="is-plain">返回</el-button>
    </div>
    </div>
</template>
  <style lang="less" scoped>
  @import "./TemplateDetail.less";
</style>
<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'
  export default {
    data () {
      return {
        modelId: TOOLS.getProID(this.$route.params.id),
        breadcrumName: '详情',
        tableData: [],
        totalCount: 0,
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        modeName: ''

      }
    },
    components: {
      breadcrumbNav
    },
    computed: {},
    mounted () {
      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {
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
      // 请求数据
      getTableList (pageNo, pageSize) {
        API.$templateChannels(this.modelId, pageNo, pageSize, res => {
          if (res.success) {
            this.modeName = res.data.name
            this.tableData = res.data.channels.list
            this.totalCount = res.data.channels.totalCount
          }
        })
      },
      // 返回
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>

