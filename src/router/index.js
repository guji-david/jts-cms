import Vue from 'vue'
import Router from 'vue-router'

import Login from '../pages/login/login.vue'
import FourTofour from '../components/fourTofour.vue'// 404
import Main from '../pages/main.vue'// main
import Welcome from '../components/welcome.vue'

// 资产管理>分支
// 资产管理>借款人账户管理
import Recordborrower from '../pages/assetManagement/borrower/record.vue'// 借款人录入
// const  Recordborrower =()=> import(  /*webpackChunkName:"Recordborrower"*/'../pages/assetManagement/borrower/record.vue')//借款人录入
import Approvalborrower from '../pages/assetManagement/borrower/approval.vue'// 借款人审核
import Listborrower from '../pages/assetManagement/borrower/list.vue'// 借款人列表
import Editborrower from '../pages/assetManagement/borrower/editborrower.vue'// 借款人编辑
import Detailborrower from '../pages/assetManagement/borrower/detailborrower.vue'// 借款人详情
import ApprovalDetailborrower from '../pages/assetManagement/borrower/approvalborrower.vue'// 借款人审核

// 资产管理>项目信息管理
import PublishPro from '../pages/assetManagement/projectInfo/publish.vue'// 发布项目
import ApprovalPro from '../pages/assetManagement/projectInfo/approval.vue'// 审核项目
import RecordPro from '../pages/assetManagement/projectInfo/record.vue'// 项目录入
import DetailsPro from '../pages/assetManagement/projectInfo/editProject/editborrower.vue'// 修改项目or新增项目
import PublishDetail from '../pages/assetManagement/projectInfo/detailProject/publshdetail.vue'// 发布页详情
import BankProEdit from '../pages/assetManagement/projectInfo/editProject/bankPaperEdit.vue'// 银行票据新增/修改
import ExportRebate from '../pages/assetManagement/projectInfo/editProject/exportRebate.vue'// 出口退税新增/修改
import BankPaperDetail from '../pages/assetManagement/projectInfo/detailProject/bankPaperDetail.vue'// 银行票据详情
import ExportRebateDetail from '../pages/assetManagement/projectInfo/detailProject/exportRebateDetail.vue'// 出口退税详情

// 资产管理>投标贷项目管理
import TBDPayPro from '../pages/assetManagement/touBiaoDaiPro/pay.vue'// 待支付项目
import TBDPayProDetail from '../pages/comComponents/detailPageComponents/detailProject/detailPageModel.vue'// 待支付项目详情
import TBDApprovalPro from '../pages/assetManagement/touBiaoDaiPro/approval.vue'// 待审核项目
import TBDEditImg from '../pages/assetManagement/touBiaoDaiPro/editImg.vue'// 待审核项目
import TBDpublishPro from '../pages/assetManagement/touBiaoDaiPro/publish.vue'// 待发布项目

// 运营管理>分支
// 运营管理>用户运营
import Message from '../pages/runManagement/userRun/messageManagement/message.vue'// 站内信
import AddMessage from '../pages/runManagement/userRun/messageManagement/addMessage.vue'// 站内信添加编辑
import MessageView from '../pages/runManagement/userRun/messageManagement/messageView.vue'// 站内信分页查询
import UserPresent from '../pages/runManagement/userRun/present/gift.vue'// 手动送礼品
import AddGift from '../pages/runManagement/userRun/present/giftRecord/giftRecord.vue'// 手动送礼品(新增)
import UserRecommend from '../pages/runManagement/userRecommend/userRecommend.vue'// 好友关系
import UserRecommendAdd from '../pages/runManagement/userRecommend/userRecommendAdd/userRecommendAdd.vue'// 新增好友关系
import ManualPoint from '../pages/runManagement/userRun/manualPoint/manualPoint.vue'// 手动送礼品列表
import ManualPointAdd from '../pages/runManagement/userRun/manualPoint/manualPointAdd.vue'// 手动送礼品(新增)
import ManualPointDetail from '../pages/runManagement/userRun/manualPoint/manualPointDetail.vue'// 手动送礼品(详情)

// 运营管理>礼品管理
import GiftRedpacket from '../pages/runManagement/giftManagement/redpacket/redpacket.vue'// 红包列表
import EditRedpacket from '../pages/runManagement/giftManagement/redpacket/editRedpacket.vue'// 红包列表编辑
import GiftCoupon from '../pages/runManagement/giftManagement/coupon/coupon.vue'// 加息券列表
import EditCoupon from '../pages/runManagement/giftManagement/coupon/editCoupon.vue'// 加息券列表编辑

// 运营管理>活动管理
import ActivityInfo from '../pages/runManagement/activityManagement/activity/activityInfo.vue'// 活动列表
import AddActivityInfo from '../pages/runManagement/activityManagement/activity/addActivityInfo.vue'// 活动列表新增
import EditActivityInfo from '../pages/runManagement/activityManagement/activity/editActivityInfo.vue'// 活动列表编辑
import AddBirthTemplate from '../pages/runManagement/activityManagement/birthTemplate/addBirthTemplate.vue'// 增加生日模版
import PointRuleList from '../pages/runManagement/activityManagement/pointRuleList/pointRuleList.vue'// 积分规则列表
import PointRuleAdd from '../pages/runManagement/activityManagement/pointRuleList/pointRuleAdd.vue'// 积分规则配置(新增 编辑)

// 运营管理>内容管理
import Ad from '../pages/runManagement/contentManagement/adManagement/ad.vue' // 广告位管理
import EditAd from '../pages/runManagement/contentManagement/adManagement/editAd.vue' // 广告位管理
import Bank from '../pages/runManagement/contentManagement/bankManagement/bank.vue' // 银行信息管理
import EditBank from '../pages/runManagement/contentManagement/bankManagement/editBank.vue' // 银行信息管理编辑
import News from '../pages/runManagement/contentManagement/newsManagement/news.vue' // 新闻管理
import Notice from '../pages/runManagement/contentManagement/noticeManagement/notice.vue' // 新闻管理
import EditNotice from '../pages/runManagement/contentManagement/noticeManagement/editNotice.vue' // 新闻管理
import Question from '../pages/runManagement/contentManagement/questionManagement/question.vue' // 问题管理
import EditQuestion from '../pages/runManagement/contentManagement/questionManagement/editQuestion.vue' // 问题编辑
import EditQuestionClass from '../pages/runManagement/contentManagement/questionManagement/editClass.vue' // 问题分类编辑
import EditNews from '../pages/runManagement/contentManagement/newsManagement/editNews.vue' // 新闻管理

// 运营管理>网站内容管理
import Calendar from '../pages/runManagement/netContentManagement/calendarManagement/calendar.vue' // 日历管理

// 财务管理>分支

// 财务管理>项目信息管理
import ProRepatment from '../pages/financeManagement/projectInfoManagement/proRepayment/repayment.vue' // 项目还款
import RepaymentPlant from '../pages/financeManagement/projectInfoManagement/proRepayment/repaymentPlant/repaymentPlant.vue'// 项目还款的详情页
import PaidOff from '../pages/financeManagement/projectInfoManagement/proPaidOff/PaidOff.vue'// 已还清项目
import PaidOffDetail from '../pages/financeManagement/projectInfoManagement/proPaidOff/PaidOffDetail/PaidOffDetail.vue'// 已还清项目
import ProMarking from '../pages/financeManagement/projectInfoManagement/projectMarking/projectMarking.vue'// 项目结标
import ProMarkingDetail from '../pages/financeManagement/projectInfoManagement/projectMarking/projectMarkingDetail/projectMarkingDetail.vue'// 结标详情
import CurrentLabel from '../pages/financeManagement/projectInfoManagement/currentLabel/currentLabel.vue'// 已流标项目
import CurrentLabelPage from '../pages/financeManagement/projectInfoManagement/currentLabel/currentLabelPage/currentLabelPage.vue'// 已流标项目详情

// 财务管理>项目资金管理
import FundLoan from '../pages/financeManagement/projectFund/productLoan.vue'// 项目放款/解冻
import DetailLoan from '../pages/financeManagement/projectFund/detailProductLoan.vue'// 项目放款/解冻-详情
import FundManager from '../pages/financeManagement/projectFund/loanManagement.vue'// 项目还款管理
import EditFundManager from '../pages/financeManagement/projectFund/EditloanManagement.vue'// 项目还款管理详情
import TradeDetail from '../pages/financeManagement/accountFund/tradeDetail.vue'// 平台基金交易明细
import BankDetail from '../pages/financeManagement/accountFund/bankDetail.vue'// 银行内部户资金明细
import AccountTransfer from '../pages/financeManagement/accountFund/transfer.vue'// 平台资金行内划拨列表
import EditTransfer from '../pages/financeManagement/accountFund/editTransfer.vue'// 平台资金行内划拨
import AccountStatus from '../pages/financeManagement/accountFund/status.vue'// 资金清算状态查询
import AccountHistory from '../pages/financeManagement/accountFund/accountHistory/accountHistory.vue'// 虚拟账户资金交易明细
import AddMoneyPage from '../pages/financeManagement/accountFund/accountHistory/addMoneyPage.vue'// 虚拟账户资金交易明细-手动加款
import ZhongJin from '../pages/financeManagement/accountFund/ZJAccount/zhongJin.vue'// 中金账户管理
import ZhongJinBalance from '../pages/financeManagement/accountFund/ZJBalanceAccount/zhongJinBalance.vue'// 中金账户管理

// 财务管理>对账管理
import FileManagement from '../pages/financeManagement/reconciliation/fileManagement/fileManagement.vue'
import DataSearch from '../pages/financeManagement/reconciliation/dataSearch.vue'
// import CustomerExpense from '../pages/financeManagement/reconciliation/customerExpense.vue'
// import Batch from '../pages/financeManagement/reconciliation/batch.vue'
// import BatchRepayment from '../pages/financeManagement/reconciliation/batchRepayment.vue'
// import Platform from '../pages/financeManagement/reconciliation/platform.vue'
// import MerchantReconciliation from '../pages/financeManagement/reconciliation/merchantReconciliation.vue'

// 财务管理>投标贷项目管理
import TBDProMarking from '../pages/financeManagement/projectManagementTBD/projectMarkingTBD/projectMarkingTBD.vue'// 待结标的项目
import TBDProMarkingDetail from '../pages/financeManagement/projectManagementTBD/projectMarkingTBD/projectMarkingDetail/projectMarkingDetailTBD.vue'// 待结标的项目详情
import TBDProRepatment from '../pages/financeManagement/projectManagementTBD/proRepaymentTBD/repaymentTBD.vue' // 待还款的项目
import TBDProRepatmentDetail from '../pages/financeManagement/projectManagementTBD/proRepaymentTBD/repaymentPlant/repaymentPlantTBD.vue'// 待还款的项目的详情页
import GoRepayDetail from '../pages/financeManagement/projectManagementTBD/proRepaymentTBD/goRepayDetail.vue'// 待还款的项目的去还款详情页
import TBDPaidOff from '../pages/financeManagement/projectManagementTBD/proPaidOffTBD/PaidOffTBD.vue'// 已完成项目
import TBDPaidOffDetail from '../pages/financeManagement/projectManagementTBD/proPaidOffTBD/PaidOffDetail/PaidOffDetailTBD.vue'// 已完成项目的详情
import TBDCurrentLabel from '../pages/financeManagement/projectManagementTBD/currentLabelTBD/currentLabelTBD.vue'// 已关闭项目
import TBDCurrentLabelSearchDetail from '../pages/financeManagement/projectManagementTBD/currentLabelTBD/searchDetail/searchDetailTBD.vue'// 已关闭项目查询详情
import TBDCurrentLabelDetail from '../pages/financeManagement/projectManagementTBD/currentLabelTBD/currentLabelPage/currentLabelPageTBD.vue'// 已关闭项目详情
import TBDHand from '../pages/financeManagement/projectManagementTBD/handTBD/handTBD.vue'// 待手动处理的项目
import TBDDelay from '../pages/financeManagement/projectManagementTBD/delayTBD/delayTBD.vue'// 延期还款的项目
import GoRepaymentInfo from '../pages/financeManagement/projectManagementTBD/delayTBD/repaymentPage/goRepaymentInfo.vue'// 延期还款的项目去还款
import DelayRepaymentInfo from '../pages/financeManagement/projectManagementTBD/delayTBD/repaymentPage/delayRepaymentInfo.vue'// 延期还款的项目详情页

// 市场管理>分支
import ChannelCustomer from '../pages/marketManagement/channelManagement/customer.vue'// 渠道商户管理
import EditCustomer from '../pages/marketManagement/channelManagement/editCustomer.vue'// 渠道商户管理(修改)
import AppAndroid from '../pages/marketManagement/appManagement/android/android.vue'// 安卓版本管理
import EditAndroid from '../pages/marketManagement/appManagement/android/editAndroid.vue'// 安卓版本管理(修改)
import AppIOS from '../pages/marketManagement/appManagement/IOS/IOS.vue'// IOS版本管理
import EditIOS from '../pages/marketManagement/appManagement/IOS/editIOS.vue'// IOS管理(修改)
import TemplateManagement from '../pages/marketManagement/templateManagement/TemplateManagement.vue'// 模版管理(列表)
import EditTemplateH5 from '../pages/marketManagement/templateManagement/EditTemplateH5.vue'// 模版管理H5(编辑)
import EditTemplatePC from '../pages/marketManagement/templateManagement/EditTemplatePC.vue'// 模版管理PC(编辑)
import TemplateDetail from '../pages/marketManagement/templateManagement/TemplateDetail.vue'// 模版管理PC(详情)

// 系统管理分支
// 系统管理>系统配置管理
import ConfigureParam from '../pages/systemManagement/configureManagement/param.vue'// 系统管理
import Editparam from '../pages/systemManagement/configureManagement/editparam.vue'// 系统管理(编辑)

// 用户管理>分支
// 用户管理>出借人交易管理
import BorrowerTrade from '../pages/userManagement/transactionManagement/trade/trade.vue'// 出借记录
import BorrowerBonusQuery from '../pages/userManagement/transactionManagement/bonusQuery/bonusQuery.vue'// 红利查询
import Recharge from '../pages/userManagement/transactionManagement/recharge/recharge.vue'// 充值记录
import Withdrawals from '../pages/userManagement/transactionManagement/withdrawals/withdrawals.vue'// 提现记录
import TenderFreeze from '../pages/userManagement/transactionManagement/tenderFreeze/tenderFreeze.vue'// 出借解冻记录
import TenderLoan from '../pages/userManagement/transactionManagement/tenderLoan/tenderLoan.vue'// 放款记录
import Payment from '../pages/userManagement/transactionManagement/payment/payment.vue'// 回款记录
import PayDetail from '../pages/userManagement/transactionManagement/payment/payDetail.vue'// 回款记录详情
import CashAward from '../pages/userManagement/transactionManagement/cashAward/cashAward.vue'// 现金奖励查询
import CashDetail from '../pages/userManagement/transactionManagement/cashAward/cashDetail.vue'// 现金奖励查询详情
import PointRecord from '../pages/userManagement/transactionManagement/pointRecord/pointRecord.vue'// 积分记录查询
import ChangeBank from '../pages/userManagement/transactionManagement/changeBank/changeBank.vue'// 变更银行卡记录

// 用户管理>出借人账户管理
import AccountInfoManagement from '../pages/userManagement/accountInfo/accountInfoManagement/accountInfoManagement.vue'// 出借人信息管理
import AccountInfoDetail from '../pages/userManagement/accountInfo/accountInfoManagement/accountInfoDetail/accountInfoDetail.vue'// 出借人信息管理详情

import WhitelistingSetting from '../pages/userManagement/accountInfo/whitelistingSetting/whitelistingSetting.vue'//  投标贷白名单
import AddUserCsv from '../pages/userManagement/accountInfo/whitelistingSetting/addUserCsv.vue'//  新增投标贷白名单
// 测试 记得删掉
import PublishInfo from '../pages/comComponents/detailPageComponents/publishInfo.vue'
import RepayInfo from '../pages/comComponents/detailPageComponents/repayInfo.vue'
import UnfreezeInfo from '../pages/comComponents/detailPageComponents/unfreezeInfo.vue'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [

    {
      path: '/',
      name: 'Default',
      component: Login
    },

    {
      path: '/login',
      name: 'Login',
      component: Login
    },

    {
      path: '/main',
      component: Main,
      children: [
        {
          path: '/',
          name: 'subRouterMain',
          component: Welcome
        },
        /* -------------------------------1.资产管理------------------------------------ */
        // 资产管理>借款人账户管理
        {
          path: '/assets/borrower/record',
          name: 'BorrowerRecord',
          component: Recordborrower
        },
        {
          path: '/assets/borrower/approval',
          name: 'BorrowerApproval',
          component: Approvalborrower
        },
        {
          path: '/assets/borrower/approvalDetailborrower',
          name: 'ApprovalDetailborrower',
          component: ApprovalDetailborrower
        },
        {
          path: '/assets/borrower/list',
          name: 'BorrowerList',
          component: Listborrower
        },
        {
          path: '/editborrower',
          name: 'Editborrower',
          component: Editborrower
        },
        {
          path: '/detailborrower',
          name: 'Detailborrower',
          component: Detailborrower
        },
        // 资产管理>项目信息管理
        {
          path: '/assets/projectInfo/record',
          name: 'RecordPro',
          component: RecordPro
        },
        {
          path: '/assets/projectInfo/approval',
          name: 'ApprovalPro',
          component: ApprovalPro
        },
        // 资产管理>项目信息管理>金宝理新增修改
        {
          path: '/detailsPro',
          name: 'DetailsPro',
          component: DetailsPro
        },
        // 资产管理>项目信息管理>票据新增修改
        {
          path: '/bankproedit',
          name: 'BankProEdit',
          component: BankProEdit
        },
        {
          path: '/assets/projectInfo/bankpaperdetail',
          name: 'BankPaperDetail',
          component: BankPaperDetail
        },
        // 资产管理>项目信息管理>出口退税新增修改
        {
          path: '/exportRebate',
          name: 'ExportRebate',
          component: ExportRebate
        },
        {
          path: '/assets/projectInfo/exportrebatedetail',
          name: 'ExportRebateDetail',
          component: ExportRebateDetail
        },
        {
          path: '/assets/projectInfo/publish',
          name: 'PublishPro',
          component: PublishPro
        },
        {
          path: '/projectInfo/publish/publishdetail',
          name: 'PublishDetail',
          component: PublishDetail
        },

        // 资产管理>投标贷项目管理>待支付的项目
        {
          path: '/assets/touBiaoDaiPro/pay',
          name: 'TBDPayPro',
          component: TBDPayPro
        },
        // 资产管理>投标贷项目管理>待支付的项目详情
        {
          path: '/assets/touBiaoDaiPro/paydetail',
          name: 'TBDPayProDetail',
          component: TBDPayProDetail
        },
        // 资产管理>投标贷项目管理>待审核的项目
        {
          path: '/assets/touBiaoDaiPro/approval',
          name: 'TBDApprovalPro',
          component: TBDApprovalPro
        },
        {
          path: '/assets/touBiaoDaiPro/approval/editImg',
          name: 'TBDEditImg',
          component: TBDEditImg
        },
        // 资产管理>投标贷项目管理>待发布的项目
        {
          path: '/assets/touBiaoDaiPro/publish',
          name: 'TBDpublishPro',
          component: TBDpublishPro
        },

        /* -------------------------------2.市场管理------------------------------------ */
        // 市场管理>模板管理
        {
          path: '/market/templateManagement/list',
          name: 'TemplateManagement',
          component: TemplateManagement
        },
        {
          path: '/templateManagement/editTemplateH5',
          name: 'EditTemplateH5',
          component: EditTemplateH5
        },
        {
          path: '/templateManagement/editTemplatePC',
          name: 'EditTemplatePC',
          component: EditTemplatePC
        },
        {
          path: '/templateManagement/templateDetail',
          name: 'TemplateDetail',
          component: TemplateDetail
        },
        // 市场管理>渠道商户管理
        {
          path: '/market/channel/customer',
          name: 'ChannelCustomer',
          component: ChannelCustomer
        },
        {
          path: '/editCustomer',
          name: 'EditCustomer',
          component: EditCustomer
        },
        {
          path: '/market/app/android',
          name: 'AppAndroid',
          component: AppAndroid
        },
        // 市场管理>app版本管理
        {
          path: '/editAndroid',
          name: 'EditAndroid',
          component: EditAndroid
        },
        {
          path: '/market/app/IOS',
          name: 'AppIOS',
          component: AppIOS
        },
        {
          path: '/editIOS',
          name: 'EditIOS',
          component: EditIOS
        },

        /* -------------------------------3.运营管理------------------------------------ */
        // 运营管理>用户运营>手动送礼品
        {
          path: '/run/user/present',
          name: 'UserPresent',
          component: UserPresent
        },
        {
          path: '/run/user/present/addGift',
          name: 'AddGift',
          component: AddGift
        },
        // 运营管理>用户运营>站内信
        {
          path: '/run/message/message',
          name: 'Message',
          component: Message
        },
        {
          path: '/run/message/addMessage',
          name: 'AddMessage',
          component: AddMessage
        },
        {
          path: '/messageView',
          name: 'MessageView',
          component: MessageView
        },
        // 运营管理>用户运营>好友关系
        { path: '/runManagement/userRecommend',
          name: 'UserRecommend',
          component: UserRecommend
        },
        { path: '/runManagement/userRecommend/UserRecommendAdd',
          name: 'UserRecommendAdd',
          component: UserRecommendAdd
        },
        // 运营管理>用户运营>手动送积分
        { path: '/runManagement/manualPoint',
          name: 'ManualPoint',
          component: ManualPoint
        },

        {
          path: '/runManagement/manualPoint/manualPointAdd',
          name: 'ManualPointAdd',
          component: ManualPointAdd
        },
        {
          path: '/runManagement/manualPoint/manualPointDetail',
          name: 'ManualPointDetail',
          component: ManualPointDetail
        },
        // 运营管理-礼品管理
        {
          path: '/run/gift/redpacket',
          name: 'GiftRedpacket',
          component: GiftRedpacket
        },
        {
          path: '/editRedpacket',
          name: 'EditRedpacket',
          component: EditRedpacket
        },
        {
          path: '/run/gift/coupon',
          name: 'GiftCoupon',
          component: GiftCoupon
        },
        { path: '/editCoupon',
          name: 'EditCoupon',
          component: EditCoupon
        },
        // 运营管理>活动管理>活动信息管理
        {
          path: '/run/activity/activityInfo',
          name: 'ActivityInfo',
          component: ActivityInfo
        },
        { path: '/addActivityInfo',
          name: 'AddActivityInfo',
          component: AddActivityInfo
        },
        { path: '/editActivityInfo',
          name: 'EditActivityInfo',
          component: EditActivityInfo
        },
        // 运营管理>活动管理>生日活动模板
        {
          path: '/run/birthTemplate/addBirthTemplate',
          name: 'AddBirthTemplate',
          component: AddBirthTemplate
        },
        // 运营管理>活动管理>积分配置规则
        {
          path: '/run/pointRule/pointRuleList',
          name: 'PointRuleList',
          component: PointRuleList
        },
        {
          path: '/run/pointRule/pointRuleAdd',
          name: 'PointRuleAdd',
          component: PointRuleAdd
        },
        // 运营管理>内容管理>新闻咨询
        {
          path: '/run/newsmanage/news',
          name: 'News',
          component: News
        },
        {
          path: '/run/newsmanage/editNews',
          name: 'EditNews',
          component: EditNews
        },
        // 运营管理>内容管理>网站公告
        {
          path: '/run/noticemanage/notice',
          name: 'Notice',
          component: Notice
        },
        {
          path: '/run/noticemanage/editNotice',
          name: 'EditNotice',
          component: EditNotice
        },
        // 运营管理>内容管理>广告位
        {
          path: '/run/admanage/ad',
          name: 'Ad',
          component: Ad
        },
        {
          path: '/run/admanage/editAd',
          name: 'EditAd',
          component: EditAd
        },
        // 运营管理>内容管理>银行信息
        {
          path: '/run/bankmanage/bank',
          name: 'Bank',
          component: Bank
        },
        {
          path: '/editBank',
          name: 'EditBank',
          component: EditBank
        },
        // 运营管理>内容管理>问题
        {
          path: '/run/question/question',
          name: 'Question',
          component: Question
        },
        {
          path: '/run/question/editQuestion',
          name: 'EditQuestion',
          component: EditQuestion
        },
        {
          path: '/run/question/editQuestionClass',
          name: 'EditQuestionClass',
          component: EditQuestionClass
        },

        // 日历管理
        {
          path: '/run/netContent/calendar',
          name: 'Calendar',
          component: Calendar
        },

        /* -------------------------------5.财务管理------------------------------------ */
        // 财务管理>项目信息管理
        {
          path: '/finance/proinfo/ProMarking',
          name: 'ProMarking',
          component: ProMarking
        },
        {
          path: '/finance/proinfo/ProMarking/ProMarkingDetail',
          name: 'ProMarkingDetail',
          component: ProMarkingDetail
        },
        {
          path: '/finance/proinfo/prorepayment',
          name: 'ProRepatment',
          component: ProRepatment
        },
        {
          path: '/finance/proinfo/prorepayment/repaymentPlant',
          name: 'RepaymentPlant',
          component: RepaymentPlant
        },
        {
          path: '/finance/proinfo/propaidoff',
          name: 'PaidOff',
          component: PaidOff
        },
        {
          path: '/finance/proinfo/propaidoff/paidoffdetail',
          name: 'PaidOffDetail',
          component: PaidOffDetail
        },
        {
          path: '/finance/proinfo/CurrentLabel',
          name: 'CurrentLabel',
          component: CurrentLabel
        },
        {
          path: '/finance/proinfo/CurrentLabel/CurrentLabelPage',
          name: 'CurrentLabelPage',
          component: CurrentLabelPage
        },
        // 财务管理>项目基金管理
        {
          path: '/finance/fund/loan',
          name: 'FundLoan',
          component: FundLoan
        },
        {
          path: '/detailLoan',
          name: 'DetailLoan',
          component: DetailLoan
        },
        {
          path: '/finance/fund/manager',
          name: 'FundManager',
          component: FundManager
        },
        {
          path: '/detailFundManager',
          name: 'EditFundManager',
          component: EditFundManager
        },
        // 财务管理>账户资金管理
        {
          path: '/finance/account/tradeDetail',
          name: 'TradeDetail',
          component: TradeDetail
        },
        {
          path: '/finance/account/bankDetail',
          name: 'BankDetail',
          component: BankDetail
        },
        {
          path: '/finance/account/status',
          name: 'AccountStatus',
          component: AccountStatus
        },
        {
          path: '/finance/account/AccountHistory',
          name: 'AccountHistory',
          component: AccountHistory
        },
        {
          path: '/addMoneyPage',
          name: 'AddMoneyPage',
          component: AddMoneyPage
        },
        {
          path: '/finance/account/transfer',
          name: 'AccountTransfer',
          component: AccountTransfer
        },
        {
          path: '/editTransfer',
          name: 'EditTransfer',
          component: EditTransfer
        },
        {
          path: '/finance/account/zhongJin',
          name: 'ZhongJin',
          component: ZhongJin
        },
        {
          path: '/finance/account/zhongJinBalance',
          name: 'ZhongJinBalance',
          component: ZhongJinBalance
        },
        // 财务管理>对账管理
        {
          path: '/reconciliation/file/management',
          name: 'FileManagement',
          component: FileManagement
        },
        {
          path: '/reconciliation/data/search',
          name: 'DataSearch',
          component: DataSearch
        },
        // 财务管理>投标贷项目管理
        {
          path: '/finance/projectManagement/TBDProMarking',
          name: 'TBDProMarking',
          component: TBDProMarking
        },
        {
          path: '/finance/projectManagement/TBDProMarking/detail',
          name: 'TBDProMarkingDetail',
          component: TBDProMarkingDetail
        },
        {
          path: '/finance/projectManagement/TBDProrepayment',
          name: 'TBDProRepatment',
          component: TBDProRepatment
        },
        {
          path: '/TBDProrepayment/goRepayDetail',
          name: 'GoRepayDetail',
          component: GoRepayDetail
        },
        {
          path: '/finance/projectManagement/TBDProrepayment/detail',
          name: 'TBDProRepatmentDetail',
          component: TBDProRepatmentDetail
        },
        {
          path: '/finance/projectManagement/TBDPaidOff',
          name: 'TBDPaidOff',
          component: TBDPaidOff
        },
        {
          path: '/finance/projectManagement/TBDPaidOff/detail',
          name: 'TBDPaidOffDetail',
          component: TBDPaidOffDetail
        },
        {
          path: '/finance/projectManagement/TBDCurrentLabel',
          name: 'TBDCurrentLabel',
          component: TBDCurrentLabel
        },
        {
          path: '/finance/projectManagement/TBDCurrentLabel/searchDetail',
          name: 'TBDCurrentLabelSearchDetail',
          component: TBDCurrentLabelSearchDetail
        },
        {
          path: '/finance/projectManagement/TBDCurrentLabel/detail',
          name: 'TBDCurrentLabelDetail',
          component: TBDCurrentLabelDetail
        },

        {
          path: '/finance/projectManagement/TBDHand',
          name: 'TBDHand',
          component: TBDHand
        },
        {
          path: '/finance/projectManagement/TBDDelay',
          name: 'TBDDelay',
          component: TBDDelay
        },
        {
          path: '/finance/projectManagement/TBDDelay/goRepaymentInfo',
          name: 'GoRepaymentInfo',
          component: GoRepaymentInfo
        },
        {
          path: '/finance/projectManagement/TBDDelay/delayRepaymentInfo',
          name: 'DelayRepaymentInfo',
          component: DelayRepaymentInfo
        },
        /* -------------------------------5.系统管理------------------------------------ */
        {
          path: '/system/configure/param',
          name: 'ConfigureParam',
          component: ConfigureParam
        },
        {
          path: '/editparam',
          name: 'Editparam',
          component: Editparam
        },
        /* -------------------------------6.用户管理------------------------------------ */
        // 用户管理>出借人账户管理
        {
          path: '/user/borrower/accountinfomanagement',
          name: 'AccountInfoManagement',
          component: AccountInfoManagement
        },
        {
          path: '/accountinfo/InfoDetail',
          name: 'AccountInfoDetail',
          component: AccountInfoDetail
        },
        {
          path: '/user/borrower/whitelistingSetting',
          name: 'WhitelistingSetting',
          component: WhitelistingSetting
        },
        {
          path: '/whitelistingSetting/add',
          name: 'AddUserCsv',
          component: AddUserCsv
        },
        // 用户管理>出借人交易管理
        {
          path: '/user/borrower/recharge',
          name: 'Recharge',
          component: Recharge
        },
        {
          path: '/user/borrower/withdrawals',
          name: 'Withdrawals',
          component: Withdrawals
        },
        {
          path: '/user/borrower/trade',
          name: 'BorrowerTrade',
          component: BorrowerTrade
        },
        {
          path: '/user/borrower/tenderFreeze',
          name: 'TenderFreeze',
          component: TenderFreeze
        },
        {
          path: '/user/borrower/tenderLoan',
          name: 'TenderLoan',
          component: TenderLoan
        },
        {
          path: '/user/borrower/payment',
          name: 'Payment',
          component: Payment
        },

        {
          path: '/borrower/payDetail',
          name: 'PayDetail',
          component: PayDetail
        },

        {
          path: '/user/borrower/bonusquery',
          name: 'BorrowerBonusQuery',
          component: BorrowerBonusQuery
        },
        {
          path: '/user/borrower/cashAward',
          name: 'CashAward',
          component: CashAward
        },
        {
          path: '/cashAward/cashDetail',
          name: 'CashDetail',
          component: CashDetail
        },
        {
          path: '/user/borrower/pointRecord',
          name: 'PointRecord',
          component: PointRecord
        },
        {
          path: '/user/borrower/changeBank',
          name: 'ChangeBank',
          component: ChangeBank
        },
        {
          path: '/publishInfo',
          name: 'PublishInfo',
          component: PublishInfo
        },
        {
          path: '/repayInfo',
          name: 'RepayInfo',
          component: RepayInfo
        },
        {
          path: '/unfreezeInfo',
          name: 'UnfreezeInfo',
          component: UnfreezeInfo
        }

      ]
    },
    {
      path: '*',
      name: 'FourTofour',
      component: FourTofour
    }

  ]
})

export default router
