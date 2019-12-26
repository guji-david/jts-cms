<template>
    <el-row>
      <el-col :span="24">
        <div class="z-breadcrumb-content">
          <el-breadcrumb separator=">">
            <el-breadcrumb-item v-for="item in getBreadCrumbData">
              <span @click="goRouter(item.router)">{{item.label}}</span>
             <!-- <router-link :to="item.router" :key="item.id" :data-id="item.id">{{item.label}}</router-link>-->
            </el-breadcrumb-item>
            <div v-if="breadcrumName!==''" >
              <div v-if="breadcrumNameList.length>=2">
                <el-breadcrumb-item v-for="(item,index) in breadcrumNameList">
                  <span @click="back(index)">{{item}}</span>
                </el-breadcrumb-item>
              </div>
              <div v-else>
                <el-breadcrumb-item v-for="(item,index) in breadcrumNameList">
                  <span>{{item}}</span>
                </el-breadcrumb-item>
              </div>
            </div>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>
</template>
<style lang="less">
  .z-breadcrumb-content{
    padding:10px;
    border-bottom: 1px solid #00AA88;
    margin-bottom: 2px;
  }
</style>
<script>
  import {getList} from '../../assets/js/tools.js'
  export default {
    name: 'breadcrumbNav',
    props: ['breadcrumName'],
    data () {
      return {
      }
    },
    computed: {
      getBreadCrumbData () {
        if (this.$store.state.breadcrumb.length > 0) {
        //            console.log("this.$store.state.breadcrumb------>"+JSON.stringify(this.$store.state.breadcrumb));
          return this.$store.state.breadcrumb
        } else {
          this.$store.commit('updataBreadcrumb', getList('breadcrumb'))
          return this.$store.state.breadcrumb
        }
      },
      breadcrumNameList () {
        return this.breadcrumName.split('!!')
      }

    },
    mounted () {
    },
    methods: {
      goRouter (router) {
        this.$router.push({path: router})
      },
      back (index) {
        if (!index) {
          this.$router.go(-1)
        }
      }
    }
  }
</script>
