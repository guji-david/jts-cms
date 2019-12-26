<template>
    <!--弹出添加礼品-->
      <div>
        <el-form>
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="红包名称：" labelWidth="100px" >
                <el-input type="text" v-model="redpacketSeach" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" >
              <el-button @click="redpacketTap">查询</el-button>
            </el-col>
            <el-col :span="3" >
              <el-button @click="redpacketSeach = ''">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="redpacketAlertTableData"
          type="expand"
          fit
          border
          @selection-change="handleSelectionChange2"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="50%"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="红包名称"
          >
          </el-table-column>
          <el-table-column
            prop="amount"
            :formatter='moneyFormat'
            label="金额(元)"
          >
          </el-table-column>
          <el-table-column
            prop="validLimit"
            label="有效期(天)"
          >
          </el-table-column>
          <!--需要转义一下-->
          <el-table-column
            prop="productType"
            :formatter="formatterProductType"
            label="限投产品类型"
          >
          </el-table-column>
          <el-table-column
            label="起投金额(元)"
          >
            <template scope="props" >
              <div class="table-line" >
                <ul>
                  <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.minAmount/100}}</li>
                </ul>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="投资产品最低期限(天)"
          >
            <template scope="props" >
              <div class="table-line" >
                <ul>
                  <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.limit}}</li>
                </ul>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
    <!--弹出添加礼品end-->
</template>
<script>
  import * as API from '../../../../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'

  export default {
    props: ['addSaveBtn', 'tableHide'],
    data () {
      return {
        redpacketAlertTableData: [],
        redpacketMultipleSelection: [], // 选择礼物的红包表
        totalCount: 1,
        redpacketSeach: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1
      }
    },
    watch: {
      addSaveBtn (val) {
        if (val) {
          this.$emit('childToFatherTransferEvent', {type: 'redpacket', val: this.redpacketMultipleSelection, date: new Date().getTime()})// ③组件内对myFilename变更后向外部发送事件通知
          this.redpacketMultipleSelection.length = 0
          this.$refs.multipleTable.clearSelection()
        }
      },
      tableHide (val) {
        if (val) {
          this.redpacketTap()
        } else {
          this.redpacketMultipleSelection.length = 0
          this.$refs.multipleTable.clearSelection()
        }
      }
    },
    mounted () { this.redpacketTap() },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 产品类型转换
      formatterProductType (val) {
        return TOOL.valueToLabelListStr(TOOL.fetchObj('commonObj').ProductType, JSON.parse(val.productType))
      },
      // 金额转换
      moneyFormat (row, column) {
        let money = row[column.property]
        return TOOL.fenToYuan(money)
      },
      // 单元格多行方法
      formatterRule (val) {
        return JSON.parse(val)
      },
      /* --------------------------------------------分页,查询,多选---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.redpacketTap()
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.redpacketTap()
      },
      // 添加红包的多选
      handleSelectionChange2 (val) {
        if (val.length > 0) {
          this.redpacketMultipleSelection = val
        }
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 请求红包接口
      redpacketTap () {
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'id': '',
          'name': this.redpacketSeach,
          'isDel': false
        }
        API.$queryRedpacket(obj, res => {
          this.redpacketAlertTableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>
<style scoped lang="less">
  @import "./giftRecord.less";
</style>
