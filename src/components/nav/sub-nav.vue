<template>
  <div id="sub-nav" v-show="unfould[0]">
    <div id="sub-nav-list">
      <el-scrollbar
        tag="ul"
        wrap-class="sub-nav_wrap"
        view-class="sub-item-list">
        <el-tree :data="subnavData" :props="defaultProps" @node-click="handleNodeClick" highlight-current></el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "./sub-nav.less";
</style>
<script>
  import * as TOOLS from '../../assets/js/tools.js'

  export default {
    data () {
      return {
        subnavData: [],
        index: 0,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    components: {
    },
    methods: {
      handleNodeClick (e) {
        if (e.children.length === 0) {
          this.$store.commit('updateActiveIndex', 0)
          this.$store.commit('addTag', { label: e.label, router: e.router, id: e.id })
          this.$store.commit('addBreadcrumb', e.id)
          this.$store.commit('addFunctionList', e.id)
          this.$router.push({path: e.router})
        }
      }
    },
    mounted () {
      TOOLS.clacScrollHeight('sub-item-list', 70)
      this.subnavData = TOOLS.getList('subnavData')
    },
    computed: {
      unfould () {
        return [
          this.$store.state.unfold,
          this.$store.state.mWidth,
          this.$store.state.menuClass
        ]
      }
    }
  }
</script>
