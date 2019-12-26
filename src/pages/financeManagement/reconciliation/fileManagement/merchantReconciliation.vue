<template>
  <div id="content-body" class="content-body">
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="交易日期：" prop="dealTime">
                <el-date-picker
                  v-model="form.dealTime"
                  type="daterange"
                  placeholder="选择交易日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0]=== 'true'">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar">
      <!--<span class="z-btn-span"><el-button type="default" icon="document" @click="downLoadBTN">下载</el-button></span>-->
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        prop="dealTime"
        :formatter="dateFormat"
        label="交易日期"
      >
      </el-table-column>
     <!-- <el-table-column
        prop="fileName"
        label="文件名称"
      >
      </el-table-column>
      <el-table-column
        prop=""
        label="备注"
      >
      </el-table-column>-->
      <el-table-column
        prop=""
        label="下载"
      >
        <template scope="scope">
          <!--<el-button @click="downLoadBTN(scope.row.id)" type="text" v-if="disabledArray[1] === 'true'">下载原文件</el-button>-->
          <el-button @click="downLoadDec(scope.row.id)" type="text" v-if="disabledArray[1] === 'true'">下载</el-button>
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
  </div>
</template>
<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        multipleSelection: [],
        totalCount: 0,
        currentPage: 1,
        form: {
          sendDateE: '',
          sendDateS: '',
          dealTime: []
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        test: '',
        disabledArray: []// 权限控制\1/查询,2/下载
      }
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
            case '出入账-查询':
              this.disabledArray[0] = 'true'
              break
            case '出入账-下载':
              this.disabledArray[1] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      timeChange () {
        if (this.form.dealTime.length) {
          if (this.form.dealTime[0] && this.form.dealTime[1]) {
            this.form.sendDateS = +this.form.dealTime[0]
            this.form.sendDateE = +this.form.dealTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.sendDateS = ''
            this.form.sendDateE = ''
          }
        } else {
          this.form.sendDateS = ''
          this.form.sendDateE = ''
        }
      },
      // 时间格式化
      dateFormat: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTimeDay(date)
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是多选的
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageSize, this.pageNo)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageSize, this.pageNo)
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageSize, this.pageNo)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 请求数据
      getTableList (pageSize, pageNo) {
        this.timeChange()
        var obj = {
          'pageSize': pageSize,
          'pageNo': pageNo,
          'sendDateE': this.form.sendDateE,
          'sendDateS': this.form.sendDateS
        }
        API.$pageQueryBIOTFNotify(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 下载接口
      downLoadBTN (id) {
        API.$download(id)
      //        location.replace('http://127.0.0.1:8080/console/gateway/logbank/downloadFileGet?ids=27622537075243136269454857994241&console-token=0aa78296-2f85-4582-a827-05f2c4c62ad1')
      },
      downLoadDec (id) {
        API.$downloadDec(id, '/gateway/logbank/downloadFileGetOneDecBIOTF')
      }

      /* DownURL(strRemoteURL, strLocalURL) {
        try {
          var xmlHTTP = new XMLHttpRequest ("Microsoft.XMLHTTP");
          xmlHTTP.onreadystatechange = function(){
            if(xmlHTTP.readyState == 4){
              if((xmlHTTP.status >= 200 && xmlHTTP.status<300) || xmlHTTP.status == 304){  //200 表示相应成功 304 表示缓存中存在请求的资源
                // 对响应的信息写在回调函数里面
                var str = xmlHTTP.status+' '+xmlHTTP.responseText;
              }
              else{
                return 'request is unsucessful '+xmlHTTP.status;
              }
            }
          };
          xmlHTTP.open("POST", "http://127.0.0.1:8080/console/gateway/logbank/downloadFile", false);
          xmlHTTP.send(JSON.stringify());
          var adodbStream = new XMLHttpRequest ("ADODB.Stream");
          adodbStream.Type = 1;
          //1=adTypeBinary
          adodbStream.Open();
          adodbStream.write(xmlHTTP.responseBody);
          adodbStream.SaveToFile('http://127.0.0.1:8080/console/gateway/logbank/downloadFile', 2);
          adodbStream.Close();
          adodbStream = null;
          xmlHTTP = null;
        } catch (e) {
          window.confirm("下载URL出错!");
        }
        window.confirm("下载完成.");
      }, */
      /* createXHR() {
        if(typeof XMLHttpRequest != 'undefined'){
          return new XMLHttpRequest();
        }
        else if(typeof ActiveXObject != 'undefined'){
          if(typeof arguments.callee.activeXString != 'string'){
            var versions = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0' ,'MSXML2.XMLHttp'], // ie browser different vesions
              i,len;
            for(i=0,len=versions.length; i<len;i++){
              try{
                new ActiveXObject(versions[i]);
                arguments.callee.activeXString = versions[i];
                break;
              }
              catch(ex){
                // jump
              }
            }
          }
          return new ActiveXObject(arguments.callee.activeXString);

        }
        else{
          throw new Error('No XHR object available.');
        }
      } */
    }
  }
</script>
