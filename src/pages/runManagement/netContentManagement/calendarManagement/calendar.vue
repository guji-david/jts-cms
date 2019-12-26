<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <div class="calendarBox">

      <div class="calendarAside">
        <div>
          <i class="el-icon-arrow-left pointer" @click="clickYear('left')" ></i>
          <span>{{year}}</span>
          <i class="el-icon-arrow-right pointer" @click="clickYear('right')" ></i>
        </div>

        <template v-for="x in 12">
          <div :class="[ (x == month)? 'asideActive' : '']" @click="clickMonth(x)" class="pointer">{{x}}月</div>
        </template>

      </div>

      <div class="calendarTable">
        <div v-for="(x,i) in calendarData">

          <template v-for="(z,index) in x">
            <div
              v-if="disabledArray[0] && index>0 "
              :class="[ z && z.vacation == 10 ? 'calendarWork pointer' : '',z && z.vacation == 20 ? 'calendarActive pointer' : '']"
              @click="clickDay(i,index,z && z.day)"
            >{{z && z.day}}
            </div>

            <div
              v-else-if="!disabledArray[0] && index>0 "
              :class="[ z && z.vacation == 10 ? 'calendarWork ' : '',z && z.vacation == 20 ? 'calendarActive ' : '']"
            >{{z && z.day}}
            </div>

            <div v-else="">{{z}}</div>
          </template>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  export default {
    data () {
      var dateNow = new Date()// 本地获取时间信息
      return {
        breadcrumName: '', // 面包屑
        calendarData: [['日'], ['一'], ['二'], ['三'], ['四'], ['五'], ['六']],
        year: dateNow.getFullYear(),
        month: dateNow.getMonth() + 1,
        thisMonthDay: new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0).getDate(), // 这个到后面应该用api传过来的
        firstDay: new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, 1).getDay(),
        nullDate: {
          day: '',
          month: '',
          vacation: '',
          week: '',
          year: ''
        },
        disabledArray: []// 权限控制\1/假期设置---日期按钮
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
            case '假期设置':
              this.disabledArray[0] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }

      this.ajaxDate()
    },
    methods: {
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // day点击事件
      clickDay (i, index, data) {
        if (data) {
          this.calendarData[i][index].vacation = this.calendarData[i][index].vacation === 10 ? 20 : 10
          this.updateVacation(this.calendarData[i][index])
        }
      },
      // 月点击事件
      clickMonth (moth) {
        this.month = moth
        this.ajaxDate()
      },

      // 年点击事件
      clickYear (direction) {
        direction === 'left' ? this.year-- : this.year++
        this.ajaxDate()
      },

      // 设置是否假期ajax
      updateVacation (obj) {
        API.$updateVacation(obj, res => {
          if (!res.success) {
            obj.vacation = obj.vacation === 10 ? 20 : 10
          }
        })
      },

      // 日期请求ajax
      ajaxDate () {
        this.calendarData = [['日'], ['一'], ['二'], ['三'], ['四'], ['五'], ['六']]
        API.$getOneMonth({year: this.year, month: this.month}, res => {
          this.firstDay = res.data[0].week === 7 ? 0 : res.data[0].week// 重新为本月第一天周几赋值
          this.thisMonthDay = res.data.length// 重新为本月天数赋值
          let dateLen = (this.thisMonthDay + this.firstDay) % 7 ? this.thisMonthDay + 7 - (this.thisMonthDay + this.firstDay) % 7 : this.thisMonthDay
          for (let i = 0; i < dateLen; i++) {
            if (i < this.firstDay) {
              this.calendarData[i].push(this.nullDate)
            }
            if (i < this.thisMonthDay) {
              this.calendarData[(i + this.firstDay) % 7].push(res.data[i])
            } else {
              this.calendarData[(i + this.firstDay) % 7].push(this.nullDate)
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .calendarBox {
    display: flex;
    margin-top: 2%;
  }

  .calendarAside {
    width: 10%;
    padding: 0 2%;
    display: flex;
    flex-direction: column;
    & > div {
      flex: 1;
      width: 100%;
      margin: 2% 0;
      text-align: center;
      padding: 5% 0;
      background: #D7D7D7;
    }
    & > div:nth-child(1) {
      padding: 15% 0;
      background: #F2F2F2;
      display: flex;
      justify-content: space-around;
      align-items: center;
      & > span {
        font-size: 18px;
      }
    }
    & > .asideActive {
      background: #afddff;
    }
  }

  .calendarTable {
    width: 80%;
    display: flex;
    border: 1px solid #F4F4F4;
    & > div {
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & > div {
        width: 80%;
        flex: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 5%;
        border: 1px solid #F4F4F4;
      }
      & > div:nth-child(1) {
        border: none;
        flex: 1;
      }
    }
  }

  .afterStyle{
    position: absolute;
    left: 0;
    top: 0;
    padding: 8px;
  }

  .calendarActive,.calendarWork {
    position: relative;
  }
  .calendarActive{
    background: #afddff;
  }
  .calendarActive::after{
    content: '休';
    background: #00AA88;
    color: #f0f0f0;
    .afterStyle;
  }
  .calendarWork::after{
    content: '班';
    .afterStyle;
    background: #F4F4F4;
  }
  .pointer{
    cursor: pointer;
  }
</style>
