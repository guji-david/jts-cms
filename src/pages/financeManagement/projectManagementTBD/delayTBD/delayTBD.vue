<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <el-tabs v-model="activeName">
        <el-tab-pane label="待还款" name="first">
            <NoRepayment></NoRepayment>
        </el-tab-pane>
        <el-tab-pane label="已还款" name="second">
            <AlreadyRepayment></AlreadyRepayment>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import breadcrumbNav from "../../../../components/nav/breadcrumb-nav.vue";
import NoRepayment from './noRepayment.vue'
import AlreadyRepayment from './alreadyRepayment.vue'
import * as API from "../../.././../store/api";
import * as TOOL from "../../../../assets/js/tools";

export default {
    data() {
        return {
            activeName: 'first',
            breadcrumName: '',     
        };
    },
    components: {
        breadcrumbNav,
        NoRepayment,
        AlreadyRepayment
    },
    computed: {
        getFunctionList() {
            if (this.$store.state.functionList.length > 0) {
                return this.$store.state.functionList;
            } else {
                this.$store.commit("updataFunctionList", TOOL.getList("functionList"));
                return this.$store.state.functionList;
            }
        }
    },

};
</script>

