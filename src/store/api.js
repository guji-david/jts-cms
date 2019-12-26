import axios from 'axios'
import * as TOOLS from '../assets/js/tools.js'

let getTimestamp = new Date().getTime()// 当前时间
const API_HOST = process.env.API_ROOT//  "/api/console"
const PC_HOST = process.env.PC_ROOT
/**
 * 发送网络请求 host为API_HOST
 */
let catchName = 0

export function postRequest (action, obj, successFun, errorFun) {
  let exp = new Date()
  exp.setTime(exp.getTime() + 1800000)// 每次调用后的token有效期为半个小时

  if (window.sessionStorage['Console-token']) { // 如果cookie的console-token存在的话
    axios.defaults.headers.common['Console-token'] = window.sessionStorage['Console-token']
  }
  axios.post(API_HOST + action + '?timestamp=' + getTimestamp, obj)// URL已增加时间戳
    .then(function (response) {
      if (response.data.resultMsg === '用户token失效') {
        catchName++// 防止catch时多次弹出
        TOOLS.confirmfun('token失效,请退出重新登录!', catchName)
      }
      // if(document.cookie.indexOf ('Console-token') < 0){//如果cookie的console-token不存在的话
      if (!window.sessionStorage['Console-token']) { // 如果cookie的console-token不存在的话
        if (action === '/gateway/user/login' || action === '/gateway/user/getCode') {
          if (!response.data.data) {
            successFun(response.data)
            return
          }
        }
        if (!response.data.data.user.token) {
          catchName++// 防止catch时多次弹出
          TOOLS.confirmfun('token失效,请退出重新登录!', catchName)
        } else {
          // document.cookie='Console-token=' + response.data.data.user.token+";expires=" + exp.toUTCString() +";path=/";//加了过期时间和路径
          window.sessionStorage['Console-token'] = response.data.data.user.token
        }
      }

      if (typeof (response.data.data) === 'string' && (/^[[\],:{}\s]*$/).test(response.data.data)) {
        successFun(JSON.parse(response.data.data))
      } else {
        successFun(response.data)
      }
    })
    .catch(function (error) {
      console.error('console-error.config', error, error.config)

      catchName++// 防止catch时多次弹出
      if (API_HOST !== '/api/console') { // 判断是否是开发环境
        console.log('Request canceled11111', error.message)
        errorFun ? errorFun(error) : TOOLS.confirmfun('网络错误', catchName)
      }
    })
}

/* ------------------------------------------------------0.公共接口----------------------------------------------------------------- */

// 公共接口-----------------------------------------------------------------------开始
/*******************************************************************************
 * 图片上传
 */
export function $updataPic (obj, souceFun, errorFun) {
  console.log(obj)
  postRequest('/gateway/oss/signature', {'contentType': obj.fileType}, res => {
    console.log('res', res.data)
    if (res.success) {
      var format = obj.fileType
      var base64 = obj.base64
      var code = window.atob(base64)
      var aBuffer = new window.ArrayBuffer(code.length)
      var uBuffer = new window.Uint8Array(aBuffer)

      /* console.info([aBuffer]);
       console.info(uBuffer);
       console.info(uBuffer.buffer);
       console.info(uBuffer.buffer==aBuffer); //true */

      for (var i = 0; i < code.length; i++) {
        uBuffer[i] = code.charCodeAt(i) & 0xff
      }

      // 创建新的axios服务,以便于增加headers
      let newAjax = axios.create()
      newAjax.defaults.headers = {'x-oss-meta-author': res.data.userId, 'Content-Type': res.data.contentType}
      newAjax.put(res.data.url, new Blob([uBuffer], {type: format}))
        .then(function () {
          souceFun(res)
        })
        .catch(function (error) {
          errorFun(error)
        })
    }
  }, errorFun)
}

/*******************************************************************************
 * 文件下载
 *
 */
export function $download (id) {
  location.replace(`${API_HOST}/gateway/logbank/downloadFileGetOne?id=${id}&console-token=${window.sessionStorage['Console-token']}`)
}

/*******************************************************************************
 * 文件下载(解密后)
 *
 */
export function $downloadDec (id, url) {
  location.replace(`${API_HOST}${url}?id=${id}&console-token=${window.sessionStorage['Console-token']}`)
}

/*******************************************************************************
 * 文件下载2
 *
 */
export function $downloadFile (title, url, json) {
  location.replace(`${API_HOST}${url}?${title}=${encodeURI(JSON.stringify(json))}&console-token=${window.sessionStorage['Console-token']}`)
}

/*******************************************************************************
 * 文件预览
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $toPC (type, id) {
  let typeURL = ''
  if (type === 'bankPaper') {
    typeURL = 'piaojudai'
  } else if (type === 'exportRebate') {
    typeURL = 'jingyingdai'
  }
  window.open(`${PC_HOST}/${typeURL}/${id}.html`)
}

/*******************************************************************************
 * 模版预览
 *
 */
export function $viewTemplate (id) {
  window.open()
}

/*******************************************************************************
 * 登陆获取验证码
 *
 * @param email
 *            电话号码
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $downVerifyCode (email, souceFun, errorFun) {
  postRequest('/gateway/user/getCode', {
    'email': email
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 用户登录
 *
 * @param email
 *            电话号码
 * @param pwd
 *            密码
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $login (email, pwd, code, souceFun, errorFun) {
  postRequest('/gateway/user/login', {
    'email': email,
    'pwd': pwd,
    'code': code
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 公共接口
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $commonDataInit (souceFun, errorFun) {
  postRequest('/gateway/common/init', {}, souceFun, errorFun)
}

// 公共接口-----------------------------------------------------------------------结束
/* ------------------------------------------------------1.资产管理----------------------------------------------------------------- */

// 借款人管理------------------------------------------------------------------------开始
/*******************************************************************************
 * 添加借款人
 *
 * @param Obj
 *            借款人对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $borrowerAdd (obj, souceFun, errorFun) {
  postRequest('/gateway/borrower/add', obj, souceFun, errorFun)
}

/*******************************************************************************

 * 修改借款人
 *
 * @param Obj
 *            借款人对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $borrowerUpdate (obj, souceFun, errorFun) {
  postRequest('/gateway/borrower/update', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 模糊搜索分行名称
 *
 * @param Obj
 *            借款人对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $searchBank (bankCode, branchBankName, souceFun, errorFun) {
  postRequest('/gateway/bank/searchBank', {
    'bankCode': bankCode,
    'branchBankName': branchBankName
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 银行信息查询
 *
 * @param Obj
 *            借款人对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getBankNameById (id, souceFun, errorFun) {
  postRequest('/gateway/bank/get/by/code', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 银行信息查询
 *
 * @param Obj
 *            银行信息对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $updateBank (obj, souceFun, errorFun) {
  postRequest('/gateway/bank/update', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 审核借款人
 *
 * @param borrowerId
 *            借款人id
 * @param auditFlag
 *            审核状态
 * @param auditContent
 *            审核原因
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $borrowerAudit (borrowerId, auditFlag, auditContent, souceFun, errorFun) {
  postRequest('/gateway/borrower/audit', {
    'borrowerId': borrowerId,
    'auditFlag': auditFlag,
    'auditContent': auditContent
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 批量删除借款人信息及相关信息
 *
 * @param ids
 *            借款人id数组
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $borrowerDelete (idArr, souceFun, errorFun) {
  postRequest('/gateway/borrower/delete', {
    'ids': idArr
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 批量提交审核
 *
 * @param ids
 *            借款人id数组
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $borrowerToAudit (idArr, souceFun, errorFun) {
  postRequest('/gateway/borrower/toAudit', {
    'ids': idArr
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 冻结借款人
 *
 * @param borrowerId
 *             借款人ID ,
 * @param freezeCause
 *             冻结原因 ,
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $borrowerFreeze (borrowerId, freezeCause, isFreeze, souceFun, errorFun) {
  postRequest('/gateway/borrower/freeze', {
    'borrowerId': borrowerId,
    'freezeCause': freezeCause,
    'isFreeze': isFreeze
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 根据borrowerId获得borrower
 *
 * @param borrowerId
 *             借款人ID ,
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getBorrowerById (borrowerId, souceFun, errorFun) {
  postRequest('/gateway/borrower/getBorrowerById', {
    'borrowerId': borrowerId
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 根据borrowerId查询账户列表
 *
 * @param borrowerId
 *             借款人ID ,
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getPageAccountsByBorrowerId (obj, souceFun, errorFun) {
  postRequest('/gateway/borrower/getPageAccountsByBorrowerId',obj, souceFun, errorFun)
}




/*******************************************************************************
 * 判断mobile是否重复
 *
 * @param mobile
 *             账户信息下的手机号,
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $checkMobile (mobile, souceFun, errorFun) {
  postRequest('/gateway/borrower/checkMobile', {
    'mobile': mobile
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 判断businessLicenseCode是否重复(true不重复)
 *
 * @param businessLicenseCode
 *             账户信息下的营业执照/信用代码,
 * @param id
 *             借款人id,
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $checkBusinessLicenseCode (businessLicenseCode, id, souceFun, errorFun) {
  postRequest('/gateway/borrower/checkBusinessLicenseCode', {
    'businessLicenseCode': businessLicenseCode,
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 模糊查询借款人信息录入列表
 *
 * @param obj
 *             查询条件 ,
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $borrowerPageQueryAdd (obj, souceFun, errorFun) {
  postRequest('/gateway/borrower/pageQueryAdd', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 模糊查询借款人信息审核列表
 *
 * @param obj
 *             查询条件 ,
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $borrowerPageQueryAudit (obj, souceFun, errorFun) {
  postRequest('/gateway/borrower/pageQueryAudit', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 模糊查询借款人信息停用列表
 *
 * @param obj
 *             查询条件 ,
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $borrowerPageQueryFreeze (obj, souceFun, errorFun) {
  postRequest('/gateway/borrower/pageQueryFreeze', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 城市级联列表
 *
 * @param str
 *             城市的id，而不是parentId,默认传"string"
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $queryAreaByParentId (parentId, souceFun, errorFun) {
  postRequest('/gateway/biz/queryAreaByParentId', {'parentId': parentId}, souceFun, errorFun)
}

/*******************************************************************************
 * 通过id获取城市名称
 *
 * @param str
 *             城市的id，而不是parentId,"
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $queryAreaById (id, souceFun, errorFun) {
  postRequest('/gateway/biz/queryAreaById', {'id': id}, souceFun, errorFun)
}

/*******************************************************************************
 * 项目发布
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $Publish (obj, souceFun, errorFun) {
  postRequest('/gateway/product/publish', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 项目审核
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $Approve (obj, souceFun, errorFun) {
  postRequest('/gateway/product/approve', [obj], souceFun, errorFun)
}

// 中招项目标的管理------------------------------------------------------------------------开始
/**
 * 中招项目/项目管理/取消待支付弹窗
 * @param souceFun 成功回调I
 * @param errorFun 失败回调A
 */
export function $cancelType (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/nopay/cancel/type', obj, souceFun, errorFun)
}

/**
 * 中招项目/财务管理/待还款项目详情
 * @param souceFun 成功回调I
 * @param errorFun 失败回调A
 */
export function $noRepayInfo (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/noRepay/info', obj, souceFun, errorFun)
}

/**
 * 中招项目/财务管理/已完成 项目详情
 * @param souceFun 成功回调I
 * @param errorFun 失败回调A
 */
export function $repayDetail (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/repay/detail', obj, souceFun, errorFun)
}

/**
 * 中招项目/财务管理/待结标 项目详情
 * @param souceFun 成功回调I
 * @param errorFun 失败回调A
 */
export function $noloanInfo (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/noloan/info', obj, souceFun, errorFun)
}

/**
 * 中招项目取消待支付
 * @param souceFun 成功回调
 * @param errorFun 失败回调A
 */
export function $nopayCancel (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/nopay/cancel', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 财务管理>投标贷项目信息管理>待结标项目
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $noloanList (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/noloan/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 财务管理>投标贷项目信息管理>已完成的项目
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $paidOffList (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/repay/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 财务管理>投标贷项目信息管理>已关闭的项目
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $currentLabel (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/closed/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 /**
 * 中招项目------已关闭项目详情
 * @param souceFun 成功回调
 * @param errorFun 失败回调A
 */
export function $closeDetail (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/closed/closeDetail', obj, souceFun, errorFun)
}

/**
 * 中招项目待发布列表接口
 * @param souceFun 成功回调
 * @param errorFun 失败回调A
 */
export function $nopublishList (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/nopublish/list', obj, souceFun, errorFun)
}

/**
 * 中招项目待还款列表接口
 * @param souceFun 成功回调
 * @param errorFun 失败回调A
 */
export function $noRepayList (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/noRepay/list', obj, souceFun, errorFun)
}

/**
 * 中招项目去还款列表接口
 * @param souceFun 成功回调
 * @param errorFun 失败回调A
 */
export function $repayInfo (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/repay/info', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 中招项目审核接口
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调A
 */
export function $nopublishInfo (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/nopublish/info', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 中招项目审核接口
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调A
 */
export function $productAudit (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/audit', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 中招项目审核详情涂鸦
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $productDoodle (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/doodle', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 中招项目审核详情
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $noauditInfo (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/noaudit/info', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 中招项目审核列表
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $noauditList (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/noaudit/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 中招项目支付详情
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $nopayInfo (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/nopay/info', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 中招项目支付列表
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $nopayList (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/nopay/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 获取手动项目列表
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $manualList (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/manual/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 划转手续费
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $manualBalance (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/manual/balance', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 退还剩余资金
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $manualRefunds (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/manual/refunds', obj, souceFun, errorFun)
}
/*******************************************************************************
 * 延期还款的项目列表-未还款
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $overdueUnrepayList (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/overdue/unrepay/list', obj, souceFun, errorFun)
}
/*******************************************************************************
 * 延期还款的项目列表-已还款
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $overdueRepayList (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/overdue/repay/list', obj, souceFun, errorFun)
}
/*******************************************************************************
 * 延期还款的项目－项目详情页
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $overdueRepayInfo (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/overdue/overdueProductDetail', obj, souceFun, errorFun)
}
/*******************************************************************************
 * 延期还款的项目未还款－去还款详情页－还款按钮接口
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $overdueRepayGoBtn (obj, souceFun, errorFun) {
  postRequest('/gateway/zhongzhao/product/overdue/repay', obj, souceFun, errorFun)
}

/* ------------------------------------------------------2.市场管理----------------------------------------------------------------- */

// 市场管理------------------------------------------------------------------------开始
/** *****************************************************************************模版
 * 模板列表分页查询
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $templateList (obj, souceFun, errorFun) {
  postRequest('/gateway/template/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 模板启用停用
 *
 * @param id
 *
 * @param status
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $templateChangeStatus (id, status, souceFun, errorFun) {
  postRequest('/gateway/template/changeStatus', {
    'id': id,
    'status': status
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 模板顺序保存
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $templateItemSave (obj, souceFun, errorFun) {
  postRequest('/gateway/template/item/save', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 渠道模块属性查询
 *
 * @param itemId 模块id
 *
 * @param templateId 渠道模板id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $templateItemValueQuery (itemId, templateId, souceFun, errorFun) {
  setTimeout(function () {
    postRequest('/gateway/template/item/value/query', {
      'itemId': itemId,
      'templateId': templateId
    }, souceFun, errorFun)
  }, 50)
}

/*******************************************************************************
 * 渠道模版选项属性值保存及修改
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $templateItemValueSave (obj, souceFun, errorFun) {
  postRequest('/gateway/template/item/value/save', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 模板渠道详情列表
 *
 * @param id
 *
 * @param pageNo 页码
 *
 * @param pageSize 页数
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $templateChannels (id, pageNo, pageSize, souceFun, errorFun) {
  postRequest('/gateway/template/channels', {
    'id': id,
    'pageNo': pageNo,
    'pageSize': pageSize
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 模板修改准备信息
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $templateEdit (id, souceFun, errorFun) {
  postRequest('/gateway/template/edit', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 模板新建初始化
 *
 * @param type
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $templateInit (type, name, souceFun, errorFun) {
  postRequest('/gateway/template/init', {
    'type': type,
    'name': name
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 模板名称和渠道号保存
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $templateNameSave (obj, souceFun, errorFun) {
  postRequest('/gateway/template/name/save', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 合作渠道分页查询
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $channelPageQuery (obj, souceFun, errorFun) {
  postRequest('/gateway/channel/pageQuery', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 合作渠道商户对象增加
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $channelAdd (obj, souceFun, errorFun) {
  postRequest('/gateway/channel/add', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 合作渠道商户-判断source是否重复(true不重复)
 *
 * @param source
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $checkSource (source, souceFun, errorFun) {
  postRequest('/gateway/channel/checkSource', {
    'source': source
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 合作渠道商户对象修改
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $channelUpdate (obj, souceFun, errorFun) {
  postRequest('/gateway/channel/update', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 通过id获取商户对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $channelQueryById (id, souceFun, errorFun) {
  postRequest('/gateway/channel/queryById', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 通过id删除对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $channelDel (id, souceFun, errorFun) {
  postRequest('/gateway/channel/delete', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * android版本分页查询
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $androidPageQuery (obj, souceFun, errorFun) {
  postRequest('/gateway/android/pageQuery', obj, souceFun, errorFun)
}

/*******************************************************************************
 * android版本对象增加
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $androidAdd (obj, souceFun, errorFun) {
  postRequest('/gateway/android/add', obj, souceFun, errorFun)
}


/*******************************************************************************
 * 通过id获取对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $androidQueryById (id, souceFun, errorFun) {
  postRequest('/gateway/android/queryById', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 通过id删除对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $androidDel (id, souceFun, errorFun) {
  postRequest('/gateway/android/delete', {
    'id': id
  }, souceFun, errorFun)
}
/*******************************************************************************
 * 更新状态
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $androidUpdate (id, souceFun, errorFun) {
  postRequest('/gateway/android/update', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * IOS版本分页查询
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $iosPageQuery (obj, souceFun, errorFun) {
  postRequest('/gateway/ios/pageQuery', obj, souceFun, errorFun)
}

/*******************************************************************************
 * IOS对象增加
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $iosAdd (obj, souceFun, errorFun) {
  postRequest('/gateway/ios/add', obj, souceFun, errorFun)
}



/*******************************************************************************
 * 通过id获取ios对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $iosQueryById (id, souceFun, errorFun) {
  postRequest('/gateway/ios/queryById', {
    'id': id
  }, souceFun, errorFun)
}
/*******************************************************************************
 * 通过id 预览
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $iosUpdate (id, souceFun, errorFun) {
  postRequest('/gateway/ios/update', {
    'id': id
  }, souceFun, errorFun)
}
/*******************************************************************************
 * 通过id删除对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $iosDel (id, souceFun, errorFun) {
  postRequest('/gateway/ios/delete', {
    'id': id
  }, souceFun, errorFun)
}
// 市场管理------------------------------------------------------------------------结束
/* ------------------------------------------------------3.运营管理----------------------------------------------------------------- */

// 运营管理------------------------------------------------------------------------开始
/*******************************************************************************
 * 手动送礼品获取批次号
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getBatchNo (souceFun, errorFun) {
  postRequest('/gateway/userGift/getBatchNo', {}, souceFun, errorFun)
}

/*******************************************************************************
 * 手动添加礼品页的详情判断下面表格路由
 *
 * @param row
 *            电话号码
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $giftType (type, batchNo, pageNo, pageSize, souceFun, errorFun) {
  let url
  if (type === 'coupon') {
    url = '/gateway/userGift/queryCouponByBatchno'
    console.log(batchNo)
  } else if (type === 'redpacket') {
    url = '/gateway/userGift/queryRedpacketByBatchno'
    console.log(batchNo)
  }
  postRequest(url, {'batchNo': batchNo, 'pageNo': pageNo, 'pageSize': pageSize}, souceFun, errorFun)
}

/*******************************************************************************
 * 手动添加礼品发送礼品
 *
 * @param row
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $sendGift (sendWay, couponBatchNo, redpacketBatchNo, sendReason, totalCouponCount, totalCouponId, totalRedpacketCount, totalRedpacketId, sendWayStr, souceFun, errorFun) {
  if (sendWay === 'userId') {
    postRequest('/gateway/userGift/sendCouponByUserIds', {
      couponBatchNo: couponBatchNo,
      redpacketBatchNo: redpacketBatchNo,
      sendReason: sendReason,
      totalCouponCount: totalCouponCount,
      totalCouponId: totalCouponId,
      totalRedpacketCount: totalRedpacketCount,
      totalRedpacketId: totalRedpacketId,
      userId: sendWayStr
    }, souceFun, errorFun)
  } else if (sendWay === 'base64') {
    postRequest('/gateway/userGift/sendGiftByCsv', {
      couponBatchNo: couponBatchNo,
      redpacketBatchNo: redpacketBatchNo,
      sendReason: sendReason,
      totalCouponCount: totalCouponCount,
      totalCouponId: totalCouponId,
      totalRedpacketCount: totalRedpacketCount,
      totalRedpacketId: totalRedpacketId,
      base64: sendWayStr
    }, souceFun, errorFun)
  } else if (sendWay === 'all') {
    postRequest('/gateway/userGift/sendGiftAllUser', {
      couponBatchNo: couponBatchNo,
      redpacketBatchNo: redpacketBatchNo,
      sendReason: sendReason,
      totalCouponCount: totalCouponCount,
      totalCouponId: totalCouponId,
      totalRedpacketCount: totalRedpacketCount,
      totalRedpacketId: totalRedpacketId
    }, souceFun, errorFun)
  }
}

/*******************************************************************************
 * 新增好友关系
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $userRecommendAdd (obj, souceFun, errorFun) {
  postRequest('/gateway/userRecommend/add', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 好友关系管理删除
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $userRecommendDelById (id, souceFun, errorFun) {
  postRequest('/gateway/userRecommend/delById', {'id': id}, souceFun, errorFun)
}

/*******************************************************************************
 * 好友关系管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $userRecommendQueryList (obj, souceFun, errorFun) {
  postRequest('/gateway/userRecommend/queryList', obj, souceFun, errorFun)
}

/*******************************************************************************
 *  手动送积分列表
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pointBatchList (obj, souceFun, errorFun) {
  postRequest('/gateway/point/batch/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 *  导入CSV用户发送积分
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pointSendPointByCsv (base64, sendReason, souceFun, errorFun) {
  postRequest('/gateway/point/sendPointByCsv', {
    'base64': base64,
    'sendReason': sendReason
  }, souceFun, errorFun)
}

/*******************************************************************************
 *  手动送积分列表详情
 *
 * @param id
 *            页数
 * @param id
 *            页数
 * @param pageNo
 *            页码
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pointBatchRecordList (id, pageSize, pageNo, souceFun, errorFun) {
  postRequest('/gateway/point/batch/record/list', {
    'id': id,
    'pageSize': pageSize,
    'pageNo': pageNo
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 获取红包查询(列表)-王鑫
 *
 * @param pageNo
 *            页码
 * @param pageSize
 *            每页显示几个
 * @param obj
 *            红包对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $queryRedpacket (obj, souceFun, errorFun) {
  postRequest('/gateway/bizGift/queryRedpacket', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 新建红包
 *
 * @param name
 *            电话号码
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $insertRedpacket (obj, souceFun, errorFun) {
  postRequest('/gateway/bizGift/insertRedpacket', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 修改红包
 *
 * @param id
 *            红包的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $updateRedpacketById (obj, souceFun, errorFun) {
  postRequest('/gateway/bizGift/updateRedpacketById', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 删除红包
 *
 * @param id
 *            红包的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $delRedpacketById (id, souceFun, errorFun) {
  postRequest('/gateway/bizGift/delRedpacketById', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 获取加息券查询(列表)
 *
 * @param pageNo
 *            页码
 * @param pageSize
 *            每页显示几个
 * @param name
 *            加息券名称
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $queryCouponTeng (pageNo, pageSize, souceFun, errorFun) {
  postRequest('/gateway/bizGift/queryCoupon', {
    'pageNo': pageNo,
    'pageSize': pageSize,
    'isDel': false
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 获取加息券查询(列表)--王鑫
 *
 * @param obj
 *            加息券对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */

export function $queryCoupon (obj, souceFun, errorFun) {
  postRequest('/gateway/bizGift/queryCoupon', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 新建加息券
 *
 * @param obj
 *            加息券对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $insertCoupon (obj, souceFun, errorFun) {
  postRequest('/gateway/bizGift/insertCoupon', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 删除广告位
 *
 * @param id
 *            红包的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $delAd (id, souceFun, errorFun) {
  postRequest('/gateway/advertise/delete', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 删除广告位
 *
 * @param id
 *            红包的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $delNotice (id, souceFun, errorFun) {
  postRequest('/gateway/bulletin/delete', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 更改广告位状态
 *
 * @param id
 *            红包的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $changeAd (id, dataStatus, souceFun, errorFun) {
  postRequest('/gateway/advertise/validAdvertise', {
    'id': id,
    'dataStatus': dataStatus
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 新增广告位
 *
 * @param id
 *            红包的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $addAd (obj, souceFun, errorFun) {
  postRequest('/gateway/advertise/save', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 获取新闻查询(列表)
 *
 * @param pageNo
 *            页码
 * @param pageSize
 *            每页显示几个
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $searchNotice (obj, souceFun, errorFun) {
  postRequest('/gateway/bulletin/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 新增广告位
 *
 * @param id
 *            红包的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $addNotice (obj, souceFun, errorFun) {
  postRequest('/gateway/bulletin/save', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 修改公告
 *
 * @param id
 *            红包的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $updateNotice (obj, souceFun, errorFun) {
  postRequest('/gateway/bulletin/update', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 修改广告位
 *
 * @param id
 *            红包的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $updateAd (obj, souceFun, errorFun) {
  postRequest('/gateway/advertise/update', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 获取银行列表

 */
export function $searchBankList (obj, souceFun, errorFun) {
  postRequest('/gateway/bank/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 获取银行列表

 */
export function $updateLimit (souceFun, errorFun) {
  postRequest('/gateway/bank/updateBankLimitation', {}, souceFun, errorFun)
}

/*******************************************************************************
 * 修改加息券
 *
 * @param id
 *            加息券的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $updateCouponById (obj, souceFun, errorFun) {
  postRequest('/gateway/bizGift/updateCouponById', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 删除加息券
 *
 * @param id
 *            加息券的id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $delCouponById (id, souceFun, errorFun) {
  postRequest('/gateway/bizGift/delCouponById', {
    'id': id
  }, souceFun, errorFun)
}

/** *****************************************************************************活动开始
 * 分页查询
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $queryActivity (obj, souceFun, errorFun) {
  postRequest('/gateway/activity/pageQuery', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 活动对象增加
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $activityAdd (obj, souceFun, errorFun) {
  postRequest('/gateway/activity/add', obj, souceFun, errorFun)
}

/*******************************************************************************
 * code 联动 rule
 *
 * @param code
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $activityGetRulesByCode (code, souceFun, errorFun) {
  postRequest('/gateway/activity/rulesByCode', {
    'code': code
  }, souceFun, errorFun)
}

/** *****************************************************************************暂时没使用
 * 判断code是否重复
 *
 * @param code
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $activityCheckCode (code, souceFun, errorFun) {
  postRequest('/gateway/activity/checkCode', {
    'code': code
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 活动对象修改
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $activityUpdate (obj, souceFun, errorFun) {
  postRequest('/gateway/activity/update', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 通过id获取对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $activityQueryById (id, souceFun, errorFun) {
  postRequest('/gateway/activity/queryById', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 通过id删除对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $delActivityById (id, souceFun, errorFun) {
  postRequest('/gateway/activity/delete', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 增加生日模版
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $bizBirthdayInsert (obj, souceFun, errorFun) {
  postRequest('/gateway/bizBirthday/insert', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 根据主键更新生日模板
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $bizBirthdayUpdateById (obj, souceFun, errorFun) {
  postRequest('/gateway/bizBirthday/updateById', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 获取生日模版
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $bizBirthdayQuery (souceFun, errorFun) {
  postRequest('/gateway/bizBirthday/query', {}, souceFun, errorFun)
}

/*******************************************************************************
 * 积分规则配置列表查询
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pointChannelConfigList (obj, souceFun, errorFun) {
  postRequest('/gateway/point/channel/config/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 积分规则配置-新增
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pointChannelConfigInsert (obj, souceFun, errorFun) {
  postRequest('/gateway/point/channel/config/insert', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 积分规则配置-编辑
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pointChannelConfigEdit (obj, souceFun, errorFun) {
  postRequest('/gateway/point/channel/config/edit', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 积分规则配置-状态启用停用
 *
 * @param id
 *         id
 * @param status
 *         状态(10 否 ,20 是)
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pointChannelConfigChange (id, status, souceFun, errorFun) {
  postRequest('/gateway/point/channel/config/change', {
    'id': id,
    'status': status
  }, souceFun, errorFun)
}

/** *****************************************************************************站内信开始
 * 站内信分页查询
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $queryMessage (obj, souceFun, errorFun) {
  postRequest('/gateway/message/pageQuery', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 站内信分页查询发送结果
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $queryMessageView (obj, souceFun, errorFun) {
  postRequest('/gateway/message/pageQueryView', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 手机号码查询
 *
 * @param mobiles
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getUserByMobiles (mobiles, souceFun, errorFun) {
  postRequest('/gateway/userGift/getUserByMobiles', {
    'mobiles': mobiles
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 站内信对象预览
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $messageAddView (obj, souceFun, errorFun) {
  postRequest('/gateway/message/addView', obj, souceFun, errorFun)
}

/** *****************************************************************************站内信结束
 * 站内信对象增加
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $messageAdd (obj, souceFun, errorFun) {
  postRequest('/gateway/message/add', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 获取广告位(列表)
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $searchAd (pageNo, pageSize, name, platform, channel, dataStatus, souceFun, errorFun) {
  postRequest('/gateway/advertise/list', {
    'pageNo': pageNo,
    'pageSize': pageSize,
    'name': name,
    'platform': platform,
    'channel': channel,
    'dataStatus': dataStatus
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 获取新闻查询(列表)
 *
 * @param pageNo
 *            页码
 * @param pageSize
 *            每页显示几个
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $searchNews (obj, souceFun, errorFun) {
  postRequest('/gateway/news/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 获取子栏目列表
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getNewsCategoryOptions (souceFun, errorFun) {
  postRequest('/gateway/news/newsCategory', {}, souceFun, errorFun)
}

/*******************************************************************************
 * 改变新闻状态
 * @param id
 *            选中id
 * @param status
 *            更改为状态
 * @param errorFun
 *            失败回调
 * @param errorFun
 *            失败回调
 */
export function $changeNews (id, status, souceFun, errorFun) {
  postRequest('/gateway/news/changeRecommended', {
    'id': id,
    'status': status
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 改变银行卡状态
 * @param id
 *            选中id
 * @param status
 *            更改为状态
 * @param errorFun
 *            失败回调
 * @param errorFun
 *            失败回调
 */
export function $changeBankStatus (id, status, souceFun, errorFun) {
  postRequest('/gateway/bank/update/status', {
    'id': id,
    'status': status
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 改变公告置顶

 */
export function $noticeTop (id, souceFun, errorFun) {
  postRequest('/gateway/bulletin/changeIsTop', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 添加新闻
 */
export function $addNews (form, souceFun, errorFun) {
  postRequest('/gateway/news/save', {
    'topic': form.topic,
    'types': form.types,
    'publishStatus': form.publishStatus,
    'keywords': form.keywords,
    'descriptions': form.descriptions,
    'content': form.content,
    'source': form.source,
    'sourceUrl': form.sourceUrl,
    'brief': form.brief,
    'sourceLogo': form.sourceLogo,
    'coverImgAlt': form.coverImgAlt,
    'reportDate': form.reportDate,
    'author': form.author
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 修改新闻
 */
export function $updateNews (form, souceFun, errorFun) {
  postRequest('/gateway/news/update', {
    'topic': form.topic,
    'types': form.types,
    'publishStatus': form.publishStatus,
    'id': form.id,
    'keywords': form.keywords,
    'descriptions': form.descriptions,
    'content': form.content,
    'source': form.source,
    'sourceUrl': form.sourceUrl,
    'brief': form.brief,
    'sourceLogo': form.sourceLogo,
    'coverImgAlt': form.coverImgAlt,
    'reportDate': form.reportDate,
    'author': form.author
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 删除新闻
 */
export function $delNews (id, souceFun, errorFun) {
  postRequest('/gateway/news/delete', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 获取问题查询(列表)
 *
 * @param pageNo
 *            页码
 * @param pageSize
 *            每页显示几个
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $searchQuestion (obj, souceFun, errorFun) {
  postRequest('/gateway/bizProblem/queryProblem', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 添加问题
 */
export function $addQuestion (form, souceFun, errorFun) {
  postRequest('/gateway/bizProblem/inserteProblem', {
    'answer': form.answer,
    'hotSequence': form.hotSequence,
    'isHot': form.isHot,
    'problemCategoryId': form.problemCategoryId,
    'seqnum': form.seqnum,
    'topic': form.topic,
    'publishStatus': form.publishStatus
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 修改问题
 */
export function $updateQuestion (form, souceFun, errorFun) {
  postRequest('/gateway/bizProblem/updateProblem', {
    'answer': form.answer,
    'hotSequence': form.hotSequence,
    'isHot': form.isHot,
    'problemCategoryId': form.problemCategoryId,
    'seqnum': form.seqnum,
    'topic': form.topic,
    'publishStatus': form.publishStatus,
    'id': form.id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 删除问题
 */
export function $delQuestion (id, souceFun, errorFun) {
  postRequest('/gateway/bizProblem/delProblem', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 获取问题分类查询(列表)
 *
 * @param pageNo
 *            页码
 * @param pageSize
 *            每页显示几个
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $searchQuestionClass (pageNo, pageSize, form, souceFun, errorFun) {
  postRequest('/gateway/bizProblem/queryProblemCategory', {
    'description': form.description,
    // "parentId":form.parentId,
    'seqnum': form.seqnum,
    'name ': form.name

  }, souceFun, errorFun)
}

/*******************************************************************************
 * 添加问题分类
 */
export function $addQuestionClass (form, souceFun, errorFun) {
  postRequest('/gateway/bizProblem/inserteProblemCategory', {
    'description': form.description,
    // "parentId":form.parentId,
    'seqnum': form.seqnum,
    'picUrl': form.picUrl,
    'picMouseUrl': form.picMouseUrl,
    'name': form.name
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 修改问题分类
 */
export function $updateQuestionClass (form, souceFun, errorFun) {
  postRequest('/gateway/bizProblem/updateProblemCategory', {
    'name': form.name,
    'description': form.description,
    // "parentId":form.parentId ,
    'seqnum': form.seqnum,
    'picUrl': form.picUrl,
    'picMouseUrl': form.picMouseUrl,
    'id': form.id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 删除问题分类
 */
export function $delQuestionClass (id, souceFun, errorFun) {
  postRequest('/gateway/bizProblem/delProblemCategory', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 查询问题分类
 */
export function $questionClassList (souceFun, errorFun) {
  postRequest('/gateway/bizProblem/queryWPC', {}, souceFun, errorFun)
}

/*******************************************************************************
 * 日历节假日接口--------获取一个月的数据
 */
export function $getOneMonth (obj, souceFun, errorFun) {
  postRequest('/gateway/calendar/getOneMonth', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 日历节假日接口--------设置是否假期
 */
export function $updateVacation (obj, souceFun, errorFun) {
  postRequest('/gateway/calendar/updateVacation', obj, souceFun, errorFun)
}

// 运营管理------------------------------------------------------------------------结束
/* ------------------------------------------------------4.财务管理----------------------------------------------------------------- */

// 财务管理------------------------------------------------------------------------开始

/** *****************************************************************************王鑫
 * 行内资金划拨,虚拟账户资金明细共用接口
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $financeListPage (obj, souceFun, errorFun) {
  postRequest('/gateway/finance/listPage', obj, souceFun, errorFun)
}

/** *****************************************************************************王鑫
 * 行内资金划拨-划转
 *
 * @param fundTransferType
 *            转账类型
 * @param amount
 *            金额
 * @param remark
 *            备注
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $financeInnerTransferRequest (fundTransferType, amount, remark, souceFun, errorFun) {
  postRequest('/gateway/finance/innerTransferRequest', {
    'fundTransferType': fundTransferType,
    'amount': amount,
    'remark': remark
  }, souceFun, errorFun)
}

/** *****************************************************************************王鑫
 * 中金账户管理>入账管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryPay (obj, souceFun, errorFun) {
  postRequest('/gateway/pay/pageQueryPay', obj, souceFun, errorFun)
}

/** *****************************************************************************王鑫
 * 中金账户管理>分账管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryBalance (obj, souceFun, errorFun) {
  postRequest('/gateway/pay/pageQueryBalance', obj, souceFun, errorFun)
}

/** *****************************************************************************王鑫
 * 中金账户管理>退款管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryRefunds (obj, souceFun, errorFun) {
  postRequest('/gateway/pay/pageQueryRefunds', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 中金账户管理>手动退款管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $refunds (obj, souceFun, errorFun) {
  postRequest('/gateway/pay/refunds', obj, souceFun, errorFun)
}
/*******************************************************************************
 * 中金差额账户管理>入账管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryOverduePay (obj, souceFun, errorFun) {
  postRequest('/gateway/pay/pageQueryOverduePay', obj, souceFun, errorFun)
}
/*******************************************************************************
 * 中金差额账户管理>分账管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $balanceOverdueQuery(obj, souceFun, errorFun) {
  postRequest('/gateway/pay/balance/overdue/query', obj, souceFun, errorFun)
}

/** *****************************************************************************王鑫
 * 分页查询平台资金交易明细（流水）
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryTradeFlow (obj, souceFun, errorFun) {
  postRequest('/gateway/finance/pageQueryTradeFlow', obj, souceFun, errorFun)
}

/** *****************************************************************************王鑫
 * 充值资金清算状态查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $financeSearchRechargeSts (qingsuanDate, souceFun, errorFun) {
  postRequest('/gateway/finance/searchRechargeSts', {
    'qingsuanDate': qingsuanDate
  }, souceFun, errorFun)
}

/** *****************************************************************************王鑫
 * 银行内部户资金明细查询
 *
 * @param obj
 *            对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $searchBankInnerFundsDetail (obj, souceFun, errorFun) {
  postRequest('/gateway/finance/searchBankInnerFundsDetail', obj, souceFun, errorFun)
}

/** *****************************************************************************放款_王鑫
 * 项目放款信息列表查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $productLoanList (obj, souceFun, errorFun) {
  postRequest('/gateway/product/loan/manager/list', obj, souceFun, errorFun)
}

/** *****************************************************************************放款管理_王鑫
 * 手动执行还款对账流水
 *
 * @param productId
 *            产品id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $tradeTederFixLoan (productId, souceFun, errorFun) {
  postRequest('/gateway/tradeTeder/fix/loan', {
    'productId': productId
  }, souceFun, errorFun)
}

/** *****************************************************************************放款_王鑫
 * 项目放款明细信息查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $productLoanPageList (obj, souceFun, errorFun) {
  postRequest('/gateway/product/loan/page/list', obj, souceFun, errorFun)
}

/** *****************************************************************************放款_王鑫
 * 统计一个项目的放款金额单元格
 *
 * @param productId
 *            产品id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $loanRealitySumCellData (productId, souceFun, errorFun) {
  postRequest('/gateway/product/loan/reality/sum', {
    'productId': productId
  }, souceFun, errorFun)
}

/** *****************************************************************************放款_王鑫
 * 统计一个项目的总募集金额
 *
 * @param productId
 *            产品id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $loanTenderSumCellData (productId, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/tender/sum', {
    'productId': productId
  }, souceFun, errorFun)
}

/** *****************************************************************************放款_王鑫
 * 统计一个项目的使用红包金额单元格
 *
 * @param productId
 *            产品id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $loanRedpacketSumCellData (productId, souceFun, errorFun) {
  postRequest('/gateway/product/loan/redpacket/sum', {
    'productId': productId
  }, souceFun, errorFun)
}

/** *****************************************************************************放款_王鑫
 * 统计一个项目放款成功笔数单元格
 *
 * @param productId
 *            产品id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $loanSuccessCountCellData (productId, souceFun, errorFun) {
  postRequest('/gateway/product/loan/success/count', {
    'productId': productId
  }, souceFun, errorFun)
}

/** *****************************************************************************还款_王鑫
 * 所有还款计划信息检索
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $repaymentPlanListManager (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/period/list', obj, souceFun, errorFun)
}

/** *****************************************************************************还款_王鑫
 * 手动执行还款对账流水
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $repaymentFixRepayment (productId, issue, souceFun, errorFun) {
  postRequest('/gateway/repayment/fixRepayment', {
    'productId': productId,
    'issue': issue
  }, souceFun, errorFun)
}

/** *****************************************************************************还款_王鑫
 * 统计一期还款总额
 *
 * @param productId
 *            产品Id
 * @param term
 *            产品期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $periodRepayAmountCellData (productId, term, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/repay/amount', {
    'productId': productId,
    'term': term
  }, souceFun, errorFun)
}

/** *****************************************************************************还款_王鑫
 * 统计一期还款本金
 *
 * @param productId
 *            产品Id
 * @param term
 *            产品期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $periodPrincipalAmountCellData (productId, term, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/principal/amount', {
    'productId': productId,
    'term': term
  }, souceFun, errorFun)
}

/** *****************************************************************************还款_王鑫
 * 统计一期还款利息
 *
 * @param productId
 *            产品Id
 * @param term
 *            产品期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $periodInterestAmountCellData (productId, term, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/interest/amount', {
    'productId': productId,
    'term': term
  }, souceFun, errorFun)
}

/** *****************************************************************************还款_王鑫
 * 统计一期加息总额
 *
 * @param productId
 *            产品Id
 * @param term
 *            产品期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $periodCouponAmountCellData (productId, term, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/coupon/amount', {
    'productId': productId,
    'term': term
  }, souceFun, errorFun)
}

/** *****************************************************************************还款_王鑫
 * 统计一期投资人手续费
 *
 * @param productId
 *            产品Id
 * @param term
 *            产品期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $periodFeeAmountCellData (productId, term, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/fee/amount', {
    'productId': productId,
    'term': term
  }, souceFun, errorFun)
}

/** *****************************************************************************还款_王鑫
 * 统计一期投资人还款状态
 *
 * @param productId
 *            产品Id
 * @param term
 *            产品期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $periodStatusCellData (productId, term, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/status', {
    'productId': productId,
    'term': term
  }, souceFun, errorFun)
}

/** *****************************************************************************还款_王鑫
 * 获取一个项目某一期的所有还款信息
 *
 * @param obj
 *            产品obj
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $periodDetailList (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/detail/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 行内资金划拨等虚拟账户信息
 *
 * @param accountType
 *            accountType
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $virtualAccountTotalMessage (accountType, souceFun, errorFun) {
  postRequest('/gateway/finance/virtualAccountTotalMessage', {
    'accountType': accountType
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 查询银行 开户可选的银行列表
 *
 * @param Obj
 *            {}
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getbankList (souceFun, errorFun) {
  postRequest('/gateway/bank/bankList', {}, souceFun, errorFun)
}

/*******************************************************************************
 * 公司平台所属账户手动充值
 *
 * @param Obj
 *            obj
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $rechargeForSelfAccount (accountCode, amount, bankSerialNo, imgUrl, souceFun, errorFun) {
  postRequest('/gateway/finance/reconciliationManage/rechargeForSelfAccount', {
    'accountCode': accountCode,
    'amount': amount,
    'bankSerialNo': bankSerialNo,
    'imgUrl': imgUrl
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 还款计划>还款计划的还款按钮
 *
 * productId
 *          产品id
 * term
 *      期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $repaymentButton (num, id, term, souceFun, errorFun) {
  postRequest('/gateway/repayment/plan/execute', {
    'flag': num,
    'productId': id,
    'term': term
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 还款计划>每一期的还款账户类型-也就是那两个接口
 *
 * productId
 *          产品id
 * term
 *      期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $repaymentPeriodAccount (id, term, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/account', {
    'productId': id,
    'term': term
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 还款计划>每一期的还款状态
 *
 * productId
 *          产品id
 * term
 *      期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $repaymentPeriodStatus (id, num, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/status', {
    'productId': id,
    'term': num
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 去还款页面主体还款期数请求
 *
 * @param productId
 *            产品id
 * @param repayPlanDate
 *            计划还款日期
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $repaymentDetailList (productId, repayPlanDate, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/detail/list', {
    'productId': productId,
    'repayPlanDate': repayPlanDate
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 去还款页面头部还款期数请求
 *
 * @param id
 *            id
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $repaymentPlanList (id, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/list', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 显示单元格内数据-募集笔数一流标的
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $tenderCountFlow (row, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/tender/count/flow', {'productId': row.id}, souceFun, errorFun)
}

/*******************************************************************************
 * 显示单元格内数据-募集笔数已结清的
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $tenderCount (row, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/tender/count', {'productId': row.id}, souceFun, errorFun)
}

/*******************************************************************************
 * 显示单元格内数据-募集金额已结清
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $tenderSum (row, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/tender/sum', {'productId': row.id}, souceFun, errorFun)
}

/*******************************************************************************
 * 显示单元格内数据-募集金额已流标
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $tenderSumFlow (row, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/tender/sum/flow', {'productId': row.id}, souceFun, errorFun)
}

/*******************************************************************************
 * 显示单元格内数据-已还总金额
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $showAlreadyData (row, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/already/amount', {'productId': row.id}, souceFun, errorFun)
}

/*******************************************************************************
 * 显示单元格内数据-应还总金额
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $showShouldData (row, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/should/amount', {'productId': row.id}, souceFun, errorFun)
}

/*******************************************************************************
 * 显示单元格内数据-待还总金额
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $showWaitingData (row, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/waiting/amount', {'productId': row.id}, souceFun, errorFun)
}

// 财务管理------------------------------------------------------------------------结束

/* ------------------------------------------------------5.系统管理----------------------------------------------------------------- */

// 系统管理------------------------------------------------------------------------开始
/*******************************************************************************
 * 系统初始配置分页查询
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $sysPageQuery (obj, souceFun, errorFun) {
  postRequest('/gateway/sys/pageQuery', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 系统初始配置对象增加
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $sysAdd (obj, souceFun, errorFun) {
  postRequest('/gateway/sys/add', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 系统初始配置对象修改
 *
 * @param obj
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $sysUpdate (obj, souceFun, errorFun) {
  postRequest('/gateway/sys/update', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 判断key是否重复(true不重复)
 *
 * @param bizKey
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $sysCheckKey (bizKey, souceFun, errorFun) {
  postRequest('/gateway/sys/checkKey', {
    'bizKey': bizKey
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 通过id获取对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $sysQueryById (id, souceFun, errorFun) {
  postRequest('/gateway/sys/queryById', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 通过id删除对象
 *
 * @param id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $sysDel (id, souceFun, errorFun) {
  postRequest('/gateway/sys/delete', {
    'id': id
  }, souceFun, errorFun)
}
// 系统管理------------------------------------------------------------------------结束
/* ------------------------------------------------------6.用户管理----------------------------------------------------------------- */
/*******************************************************************************
 * 出借人账户管理 - 账户信息管理 -查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $UserAccount (obj, souceFun, errorFun) {
  postRequest('/gateway/getUserAccount', obj, souceFun, errorFun)
}
/*******************************************************************************
 * 出借人账户管理 -  账户信息管理 - 获取线下渠道信息
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getOffLine (souceFun, errorFun) {
  postRequest('/gateway/channel/getOffLine', {}, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人账户管理 -  账户信息管理 - 置为线下员工或职为普通用户
 *
 * @param userId
 *            userId
 * @param userChannelType
 *            userChannelType
 * @param isEmployee
 *            isEmployee
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $employeeUser (userId, userChannelType, isEmployee, souceFun, errorFun) {
  postRequest('/gateway/employeeUser', {
    'userId': userId,
    'userChannelType': userChannelType,
    'isEmployee': isEmployee
  }, souceFun, errorFun)
}
/*******************************************************************************
 * 出借人账户管理 -  账户信息管理 - 重置密码接口
 *
 * @param id
 *            id
 * @param isFreezen
 *            isFreezen
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $freezenUser (id, isFreezen, souceFun, errorFun) {
  postRequest('/gateway/freezenUser', {'id': id, 'isFreezen': isFreezen}, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人账户管理 -  账户信息管理 - 重置密码接口
 *
 * @param id
 *            id
 * @param mobile
 *            mobile
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $resetUserPassword (id, mobile, souceFun, errorFun) {
  postRequest('/gateway/resetUserPassword', {'id': id, 'mobile': mobile}, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人账户管理 - 白名单设置 - 投标贷白名单
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $UserQuery (obj, souceFun, errorFun) {
  postRequest('/gateway/product/user/query', obj, souceFun, errorFun)
}
/*******************************************************************************
 * 出借人账户管理 - 白名单设置 - 投标贷白名单 -启用/停用
 * @param id
 *            选中id
 * @param status
 *            更改为状态
 * @param type
 *            区别单条和全部 10 更新单条记录 20更新全部记录
 * @param errorFun
 *            失败回调
 * @param errorFun
 *            失败回调
 */
export function $changeUserStatus (id, status,type, souceFun, errorFun) {
  postRequest('/gateway/product/user/statusChange', {
    'id': id,
    'status': status,
    'type': type
  }, souceFun, errorFun)
}
/*******************************************************************************
 *  出借人账户管理 - 白名单设置 - 投标贷白名单-导入CSV用户
 *
 * @param base64
 *            base64
 * @param status
 *            状态 10 无效 20 有效
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $importByCsv (base64, status, souceFun, errorFun) {
  postRequest('/gateway/product/user/importByCsv', {
    'base64': base64,
    'status': status
  }, souceFun, errorFun)
}

/*******************************************************************************
 *  出借人账户管理 - 白名单设置 - 更新缓存
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $updateCache (souceFun, errorFun) {
  postRequest('/gateway/product/user/updateCache',{}, souceFun, errorFun)
}

/*******************************************************************************
 * 查询可用项目名称
 *
 * @param type
 *            type
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getProductName (type, souceFun, errorFun) {
  postRequest('/gateway/product/getProductName', {'type': type}, souceFun, errorFun)
}



/*******************************************************************************
 * 出借人交易管理-回款记录 导出
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getTenderLoanExport (obj, souceFun, errorFun) {
  postRequest('/gateway/tradeTeder/getTenderLoanExport', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人交易管理-回款记录 导出
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getRepaymentExport (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/getRepaymentExport', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 对账管理>文件下载
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $logbankDownloadFile (obj, souceFun, errorFun) {
  postRequest('/gateway/logbank/downloadFile', obj, souceFun, errorFun)
}



/*******************************************************************************
 * 发布页停用接口
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $stopProduct (id, souceFun, errorFun) {
  postRequest('/gateway/product/stopProduct', {'id': id}, souceFun, errorFun)
}

/*******************************************************************************
 * 批量还款分页查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $flowDetailList (obj, souceFun, errorFun) {
  postRequest('/gateway/product/trade/flow/detail/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 批量还款分页查询(截标)
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryBRFNotify (obj, souceFun, errorFun) {
  postRequest('/gateway/logbank/pageQueryBRFNotify', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 内部户交易明细分页查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryINFNotify (obj, souceFun, errorFun) {
  postRequest('/gateway/logbank/pageQueryINFNotify', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 对账管理之平台分账对账文件分页查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $logbankPageQueryBPFNotify (obj, souceFun, errorFun) {
  postRequest('/gateway/logbank/pageQueryBPFNotify', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 商户出入对账
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryBIOTFNotify (obj, souceFun, errorFun) {
  postRequest('/gateway/logbank/pageQueryBIOTFNotify', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 批量放款分页查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryBTFNotify (obj, souceFun, errorFun) {
  postRequest('/gateway/logbank/pageQueryBTFNotify', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 开销户分页查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryBCNotify (obj, souceFun, errorFun) {
  postRequest('/gateway/logbank/pageQueryBCNotify', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 对账数据查询
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryBIOTFNotifyData (obj, souceFun, errorFun) {
  postRequest('/gateway/logbank/pageQueryBIOTFNotifyData', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 查询某一期下的详情列表-还款/已还款
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $extendList (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/period/detail/extend/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 已流标的项目检索管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $flowList (mobile, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/flow/list', {'mobile': mobile}, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理个人详情
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $GetUserAccountBank (mobile, souceFun, errorFun) {
  postRequest('/gateway/bank/getUserAccountBank', {'mobile': mobile}, souceFun, errorFun)
}

/*******************************************************************************
 * 项目还款(还款中的)的项目检索管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $repayingList (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/repaying/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 已流标的项目检索管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $productFlowList (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/flow/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 已结清的项目检索管理
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $repayList (obj, str, souceFun, errorFun) {
  obj['tenderStatus'] = str
  postRequest('/gateway/repayment/product/repay/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 获取结标的列表
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $managerList (obj, souceFun, errorFun) {
  postRequest('/gateway/product/closing/manager/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 获取募集统计信息/在结标中使用
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $tenderStat (str, souceFun, errorFun) {
  postRequest('/gateway/product/closing/tender/stat', {'productId': str}, souceFun, errorFun)
}

/*******************************************************************************
 * 获取项目详情的信息/也在结标中使用
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $productGet (str, souceFun, errorFun) {
  postRequest('/gateway/product/get', {'id': str}, souceFun, errorFun)
}

/*******************************************************************************
 * 获取项目结标
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $closingOver (loanResult, id, souceFun, errorFun) {
  postRequest('/gateway/product/closing/over', {'loanResult': loanResult, 'productId': id}, souceFun, errorFun)
}

/*******************************************************************************
 * 获取项目结标流程记录/状态
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $closingFlow (str, souceFun, errorFun) {
  postRequest('/gateway/product/closing/flow', {'productId': str}, souceFun, errorFun)
}

/*******************************************************************************
 * 还款计划
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $planGenerate (str, souceFun, errorFun) {
  postRequest('/gateway/repayment/plan/generate', {'id': str}, souceFun, errorFun)
}

/*******************************************************************************
 * 项目放款
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $raisingTransfer (str, souceFun, errorFun) {
  postRequest('/gateway/product/closing/raising/transfer', {'productId': str}, souceFun, errorFun)
}

/*******************************************************************************
 * 计算募集期利息
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $interestGenerate (str, souceFun, errorFun) {
  postRequest('/gateway/product/closing/raising/interest/generate', {'productId': str}, souceFun, errorFun)
}


/*******************************************************************************
 * 财务管理展示列表
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $FinanceList (obj, str, souceFun, errorFun) {
  obj['tenderStatus'] = str
  obj['auditStatus'] = 'success'
  postRequest('/gateway/product/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 项目募集金额
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $TenderSum (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/tender/sum', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 项目募集笔数
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $TenderCount (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/product/tender/count', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>回款记录查询
 *
 * productId
 *          产品id
 * term
 *      期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $Payment (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/getRepayment', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>回款记录查询>回款详情
 *
 * productId
 *          产品id
 * term
 *      期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $PaymentDetail (obj, souceFun, errorFun) {
  postRequest('/gateway/repayment/getRepaymentDetailByOrderNo', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>出借解冻记录查询
 *
 * productId
 *          产品id
 * term
 *      期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $tenderFreeze (obj, souceFun, errorFun) {
  postRequest('/gateway/tradeTeder/getTenderFreeze', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>放款记录查询
 *
 * productId
 *          产品id
 * term
 *      期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $getTenderLoan (obj, souceFun, errorFun) {
  postRequest('/gateway/tradeTeder/getTenderLoan', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>出借人记录
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $tradeRecord (obj, souceFun, errorFun) {
  postRequest('/gateway/tradeTeder/getTender', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>充值记录>在线充值
 *
 * @param obj
 *            在线充值对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $queryRecharge (obj, souceFun, errorFun) {
  postRequest('/gateway/tradeAccountFlow/queryRecharge', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>充值记录>网银转账
 *
 * @param obj
 *            在线充值对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pageQueryTransferInNotify (obj, souceFun, errorFun) {
  postRequest('/gateway/logbank/pageQueryTransferInNotify', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>提现
 *
 * productId
 *          产品id
 * term
 *      期数
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $queryWithdraw (obj, souceFun, errorFun) {
  postRequest('/gateway/tradeAccountFlow/queryWithdraw', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>红利查询>红包查询
 *
 * obj
 *      对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $redpacketSeach (obj, souceFun, errorFun) {
  postRequest('/gateway/userGift/getUserPacket', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>红利查询>加息劵查询
 *
 * obj
 *      对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $couponSeach (obj, souceFun, errorFun) {
  postRequest('/gateway/userGift/getUserCoupon', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>红利查询>投资奖励金查询
 *
 * obj
 *      对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $TenderInterestSeach (obj, souceFun, errorFun) {
  postRequest('/gateway/tradeTeder/getTenderInterest', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>红利查询>现金查询
 *
 * obj
 *      对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $summaryQuery (obj, souceFun, errorFun) {
  postRequest('/gateway/userProfit/summary/query', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>现金奖励查询
 *
 * obj
 *      对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $userProfitQuery (obj, souceFun, errorFun) {
  postRequest('/gateway/userProfit/query', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>现金奖励查询
 *
 * obj
 *      对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $userProfitDetails (obj, souceFun, errorFun) {
  postRequest('/gateway/userProfit/details', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>积分记录查询
 *
 * obj
 *      对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pointTaskList (obj, souceFun, errorFun) {
  postRequest('/gateway/point/task/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>积分记录列表数据
 *
 * obj
 *      对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $pointList (obj, souceFun, errorFun) {
  postRequest('/gateway/point/list', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>兑换记录列表数据
 *
 * obj
 *      对象
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $recordConsumelist (obj, souceFun, errorFun) {
  postRequest('/gateway/point/record/consumelist', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>兑换记录列表数据>跟新状态
 *
 * @param ordernum
 *            兑吧订单号
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $recordUpdateStatus (ordernum, souceFun, errorFun) {
  postRequest('/gateway/point/record/updateStatus', {
    'id': ordernum
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>变更银行卡记录列表
 *
 * obj    对象
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $changeBankQueryList (obj, souceFun, errorFun) {
  postRequest('/gateway/changeBank/queryList', obj, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>变更银行卡记录 更新状态
 *
 * id    操作id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $changeBankUpdateStatus (id, souceFun, errorFun) {
  postRequest('/gateway/changeBank/updateStatus', {
    'id': id
  }, souceFun, errorFun)
}

/*******************************************************************************
 * 出借人管理>变更银行卡记录 置为失败
 *
 * id    操作id
 *
 * @param souceFun
 *            成功回调
 * @param errorFun
 *            失败回调
 */
export function $changeBankSetFailure (id, souceFun, errorFun) {
  postRequest('/gateway/changeBank/setFailure', {
    'id': id
  }, souceFun, errorFun)
}
