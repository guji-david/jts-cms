<template>
    <div id="content-body" class="content-body">
        <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
        <div id="z-edit">
            <el-form label-width="140px">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="还款信息" name="1">
                        <el-form-item label="已还延期利息(元)：">
                            {{overdueAmount}}
                        </el-form-item>
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
    </div>
</template>
<script>
    import breadcrumbNav from "../../../../../components/nav/breadcrumb-nav.vue";
    import * as API from "../../../.././../store/api";
    import * as TOOLS from "../../../../../assets/js/tools";

    export default {
        name: 'DelayRepaymentInfo',
        data() {
            return {
                breadcrumName: '延期还款详情', 
                activeNames: ['1'],
                overdueAmount:'',
                totalCount: 0,
                currentPage: 1,
                pageNo: 1,
                pageSize: 9999,
                id: TOOLS.getProType(this.$route.params.id),
                tableData: []
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
            }
        }

    };
</script>
