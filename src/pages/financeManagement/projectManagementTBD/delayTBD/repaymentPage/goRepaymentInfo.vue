<template>
    <div id="content-body" class="content-body">
        <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
        <div id="z-edit">
            <el-form label-width="140px">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="还款信息" name="1">
                        <el-form-item>
                            <div class="isOverTime">
                                该项目延期还款（请注意延期利息的支付情况）
                            </div>
                        </el-form-item>
                        <el-form-item label="应还延期利息(元)：">
                            {{overdueAmount}}
                        </el-form-item>
                        <el-button @click="repay" style="padding: 8px 25px;margin-bottom: 20px;">还款</el-button>
                    </el-collapse-item>
                </el-collapse>
            </el-form>
        </div>
         <!-- 列表开始 -->
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="userMobile" label="手机号"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="overdueInterest" :formatter="moneyFormat" label="应还金额(元)"></el-table-column>
        </el-table>
        <!-- 列表结束 分页开始 -->
        <!-- 撤销的时候提示 -->
        <el-dialog title="提示"  :visible="repayDialogVisible" size="tiny" :modal="false" :before-close="repayCancelBtn">
            <p class="popTitle">{{popTitle}}</p>
            <p style="text-align:center">{{popMessage}} </p>
            <span slot="footer" class="dialog-footer">
              <span class="z-btn-span"><el-button type="primary" @click="repayBtn">确 定</el-button></span>
              <span class="z-btn-span"><el-button @click="repayCancelBtn">取 消</el-button></span>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import breadcrumbNav from "../../../../../components/nav/breadcrumb-nav.vue";
    import * as API from "../../../.././../store/api";
    import * as TOOLS from "../../../../../assets/js/tools";

    export default {
        name: 'GoRepaymentInfo',
        data() {
            return {
                repayDialogVisible: false,
                breadcrumName: '待还款',
                popTitle: '',
                popMessage: '',
                activeNames: ['1'],
                overdueAmount:'',
                totalCount: 0,
                currentPage: 1,
                pageNo: 1,
                pageSize: 9999,
                id: TOOLS.getProType(this.$route.params.id),
                tableData: [
                    {
                      userMobile: '15678903748',
                      userName: 'wangmo',
                      overdueInterest: '12345'
                    },
                    {
                      userMobile: '15123433748',
                      userName: '紫灵',
                      overdueInterest: '125'
                    }
                ]
            };
        },
        components: {
            breadcrumbNav,
        },
        beforeMount(){
            this.getTableList();//初始化数据
        },
        methods: {
            // 金额转换
            moneyFormat (row, column) {
                return TOOLS.fenToYuan(row[column.property])
            },
             /* --------------------------------------------页面事件----------------------------------------------------------- */
            getTableList(){
                let obj = {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    productOverdueId: this.id
                };
                API.$overdueRepayInfo(obj, res => {
                    this.tableData = res.data.basePageResult.list;
                    this.totalCount = res.data.basePageResult.totalCount;
                    this.overdueAmount = TOOLS.fenToYuan(res.data.overdueAmount);
                })
            },
            // 还款
            repay() {
                this.repayDialogVisible = true;
                this.popTitle = '该项目延期还款';
                this.popMessage = `请确认应支付的延期利息${this.overdueAmount}元已到还款账户！`;
            },
            // 还款确定按钮
            repayBtn () {
                this.repayDialogVisible = false;
                this.repayResult();//确定还款
            },
            // 还款放弃按钮
            repayCancelBtn () {
                this.repayDialogVisible = false
            },
            repayResult(){
                let obj = {id : this.id},
                    that = this;
                API.$overdueRepayGoBtn(obj,res => {
                    if(res.success){
                        this.$message({
                            message: '还款完成',
                            type: 'success',
                            center: true,
                            duration: 1000,
                            onClose: function(){
                                that.$router.go(-1)//返回延期还款待审核列表
                            }
                        });
                    }else{
                        this.$message({
                            message: res.resultMsg,
                            type: 'error',
                            duration: 2000
                        });
                    }
                })
            }

        }

    };
</script>
<style lang="less" scoped>
    .isOverTime{
        margin-left: -140px;
        // padding-left: 10px;
        margin-top: 20px;
        font-size: 16px;
        width: 340px;
        color: #FB4B45;

    }
    .popTitle{
        text-align: center;
        font-weight: 600;
        color: #FB4B45;
        padding-bottom: 20px;
    }
</style>
