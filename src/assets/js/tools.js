import Number from '../../../node_modules/accuratecalculation/index.js'

//      将数据批量提交使用的ids对象
// m 为 this.multipleSelection
export function idsFun (m) {
  var delArr = []
  for (var x of m) {
    delArr.push(x.id)
  }
  return delArr
}

//      将数据批量提交使用的ids对象
// m 为 this.multipleSelection
export function idsGet (m) {
  var delArr = []
  for (var x of m) {
    delArr.push(x.id)
  }
  let str = delArr.join('|')
  return str
}

// 起息日到期日,项目期限换算
export function timeLimitFormat (startDate, limitDate) {
  if (startDate && limitDate) {
    let dateArr = ['', '', '']
    let d = new Date(startDate)// 修改页面返回的是毫秒数，所以转换一下
    if (d && limitDate.toString() != '') {
      dateArr[0] = d.getFullYear()
      dateArr[1] = d.getMonth()
      dateArr[2] = d.getDate() + limitDate * 1
      return normalTime(new Date(dateArr[0], dateArr[1], dateArr[2]))
    }
  } else {

  }
}

// 起息日到期日,项目期限换算天截至
export function timeLimitFormatDay (startDate, limitDate) {
  if (startDate && limitDate) {
    let dateArr = ['', '', '']
    let d = new Date(startDate)// 修改页面返回的是毫秒数，所以转换一下
    if (d && limitDate.toString() != '') {
      dateArr[0] = d.getFullYear()
      dateArr[1] = d.getMonth()
      dateArr[2] = d.getDate() + limitDate * 1
      return normalTimeDay(new Date(dateArr[0], dateArr[1], dateArr[2]))
    }
  } else {

  }
}

// 项目类型转换--需要调一下,没转换了2017年6月12日//现在并没有使用
export function imgValTolabel (value) {
  let list = [
    {
      label: '资质证明',
      value: 'qualificationCertificate'
    },
    {
      label: '合同证明',
      value: 'contractCertificate'
    }
  ]
  for (let x of list) {
    if (x.value == value) {
      return x.label
    }
  }
}

// 去除空的选项(查询使用//滕昊)
export function noEmety (oldObj, pageSize = 5, pageNo = 1) {
  let obj = {}
  if (typeof oldObj === 'object') {
    for (var x in oldObj) {
      if (oldObj[x]) {
        obj[x] = oldObj[x]
      }
    }
  }
  obj['pageNo'] = pageNo
  obj['pageSize'] = pageSize
  return obj
}

// 去除空的选项(王鑫)
export function noEmetyProp (oldObj) {
  var obj = {}
  for (var x in oldObj) {
    if (oldObj[x]) {
      obj[x] = oldObj[x]
    }
  }
  return obj
}

// 表内如果有false就显示为否，否则为是
export function trueOrFalse (obj) {
  var arr = {
    'isGenerateContract': true,
    'isGeneratePlan': true,
    'loanStatus': true,
    'serviceCharge': true,
    'isPaidInterest': true,
    'refundAdvanceCharge': true
  }
  for (let x in obj) {
    if (arr[x]) {
      if (obj[x] === 'true' || obj[x] == 20) {
        obj[x] = '是'
      } else if (obj[x] === 'false' || obj[x] == 30 || obj[x] === '' || obj[x] === null) {
        obj[x] = '否'
      } else if (obj[x] == 10) {
        obj[x] = '已受理'
      }
    } else {
      if (obj[x] === 'true') {
        obj[x] = '是'
      } else if (obj[x] === 'false') {
        obj[x] = '否'
      }
    }
  }
}

// 内容为null或空时转变为无
// exception例外的字段
export function formatNull (obj, exception) {
  for (let x in obj) {
    if (obj[x] != false && !obj[x] && exception !== x) {
      obj[x] = '无'
    }
  }
}

// 为详情，修改等页面重新赋值
export function replaceVal (obj, localObj) {
  for (var x in obj) {
    for (var y in localObj) {
      if (y == x) {
        localObj[y] = obj[x]
      }
    }
  }
}

// 为详情，修改等页面重新赋值（数组中的）
export function replaceArrayVal (arr, localObj) {
  for (var z of arr) {
    for (var y in localObj) {
      if (y === z['property']) {
        localObj[y] = z['value']
      }
    }
  }
}

// 操作element-ui中的select的option数组
export function optionAssignment (option, obj) {
  option.length = 0
  for (var x in obj) {
    var newobj = {}
    newobj.value = x
    newobj.label = obj[x]
    option.push(newobj)
  }
  return option
}

// 项目录入模块->图片增加
export function addPicture (name, imgList) {
  let obj = {
    property: name,
    value: ''
  }
  imgList['push'](obj)
}

// 扩展项的赋值
// fp是formAlignRight下的productExtends
export function integrationData (formAlignRight, productExtends, fp) {
  for (let x in formAlignRight) {
    for (let i = 0; i < productExtends.length; i++) {
      if (productExtends[i] === x) {
        fp[i] = {}
        fp[i]['property'] = x
        fp[i]['value'] = formAlignRight[x]
      }
    }
  }
}

/**
 * 动态计算元素的高度
 * @param className 元素的class
 * @param numbers   需要减掉的高度
 */
export function clacScrollHeight (className, numbers) {
  var navHeight = (document.documentElement.clientHeight - numbers) + 'px'
  document.getElementsByClassName(className)[0].style.height = navHeight
}

/**
 * 根据router(path)获取对应元素的对象
 * @param arr
 * @param router
 * @returns {Array}
 */
export function getIdByRouter (arr, router) {
  let activeRouterObj = ''
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].router == router) {
      activeRouterObj = arr[i]
      break
    }
  }
  return activeRouterObj
}

/**
 * 根据id获取制定元素的所有父节点
 * @param arr
 * @param id
 * @returns {Array}
 */
export function getParentsById (arr, id) {
  var temp = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == id) {
      temp.push(arr[i])
      temp = temp.concat(getParentsById(arr, arr[i].parent))
      break
    }
  }
  return temp
}

/**
 * 根据id获取当前元素的function(具体到按钮)这是一个list
 * @param arr
 * @param id
 * @returns {Array}
 */
export function getFunctionListById (arr, id) {
  var temp = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      temp = temp.concat(arr[i].function)
      break
    }
  }
  return temp
}

/**
 * 将树形导航嵌套的json转换成单层json
 * @param datas
 * @returns {Array}
 */
export function getNavDateToSimpleJson (datas) {
  if (datas.length === 0) {
    log('no data!')
  } else {
    let arr = []
    for (let i in datas) {
      arr.push({
        'label': datas[i].label,
        'router': datas[i].router,
        'id': datas[i].id,
        'parent': datas[i].parent,
        'function': datas[i].function
      })
      if (datas[i].children.length) {
        arr = arr.concat(getNavDateToSimpleJson(datas[i].children))
      }
    }
    return arr
  }
}

/**
 * 动态计算页签包裹层的宽度
 */
export function setTagNavWIdth () {
  let list = document.getElementsByClassName('z-nav-tag-ul-li')
  let width = 0
  let boxWidth = document.body.offsetWidth - 422
  for (let i = 0; i < list.length; i++) {
    width += parseInt(window.getComputedStyle(list[i], null).width) + 10
  }
  document.getElementsByClassName('z-nav-tag-ul')[0].style.width = width + 'px'
  document.getElementById('z-nav-tag-box').style.width = boxWidth + 'px'
}

/**
 * 动态计算页签移动的距离,作为是否可以拖动或点击滑动的依据
 */
export function calcTagBox () {
  let tagBox = document.getElementById('z-nav-tag-box')
  let tagUl = document.getElementsByClassName('z-nav-tag-ul')[0]
  let tagBoxWidth = parseInt(window.getComputedStyle(tagBox, null).width)
  let tagUlWidth = parseInt(window.getComputedStyle(tagUl, null).width)
  return {tagBoxWidth, tagUlWidth}
}

// 将数据批量提交使用的对象
export function getListProp (prop, list) {
  var Arr = []
  for (var x of list) {
    Arr.push(x[prop])
  }
  return Arr
}

// --------------------------------------------------------------------时间戳转化/
export function normalTime (times) {
  if (times) {
    let oDate = new Date()
    oDate.setTime(times)
    let y = oDate.getFullYear()
    let m = oDate.getMonth() + 1
    let mStr = new Array(3 - m.toString().length).join('0') + m// 为什么是3
    let d = oDate.getDate()
    let dStr = new Array(3 - d.toString().length).join('0') + d// 为什么是3

    let h = oDate.getHours()
    let hStr = new Array(3 - h.toString().length).join('0') + h// 为什么是3
    let mm = oDate.getMinutes()
    let mmStr = new Array(3 - mm.toString().length).join('0') + mm// 为什么是3
    let s = oDate.getSeconds()
    let sStr = new Array(3 - s.toString().length).join('0') + s// 为什么是3
    return y + '-' + mStr + '-' + dStr + ' ' + hStr + ':' + mmStr + ':' + sStr
  }
}

// --------------------------------------------------------------------时间戳转化滕昊/
export function normalTimeDay (times) {
  if (times) {
    var oDate = new Date()
    oDate.setTime(times)
    var y = oDate.getFullYear()
    var m = oDate.getMonth() + 1
    var mStr = new Array(3 - m.toString().length).join('0') + m// 为什么是3
    var d = oDate.getDate()
    var dStr = new Array(3 - d.toString().length).join('0') + d// 为什么是3
    return y + '-' + mStr + '-' + dStr
  }
}

// -------------------------------------------------------判断是红包还是加息劵转化/
export function formatGiftType (val) {
  switch (val) {
    case 'coupon':
      return '加息券'
    case 'redpacket':
      return '红包'
  }
}

// -------------------------------------------------------判断平台类型/
export function formatPlateType (val) {
  switch (val) {
    case 'carouselFigure':
      return '轮播图'
    case 'redpacket':
      return '红包'
    case 'index_1':
      return '注册上图'
  }
}

// -------------------------------------------------------数据字典key转value
// 针对项目录入的借款人类型未返回做的临时处理
export function valueToLabelTemporary (list, value) {
  for (let item of list) {
    if (item.value === 'company') {
      return item.label
    }
  }
}

// list为对应字段的数组
// 1.value为对应数组中对象的key
export function valueToLabel (list, value) {
  for (let item of list) {
    if (item.value == value) {
      return item.label
    }
  }
}

// 2.valueList为对应数组中对象的keyList
export function valueToLabelListStr (list, valueList) {
  let labelList = []
  for (let item of list) {
    for (let valueItem of valueList) {
      // if (item.value == valueItem && item.value !== 'exportRebate') {
      if (item.value == valueItem) {
        labelList.push(item.label)
      }
    }
  }
  return labelList.toString()
}

// 3.获取数组中对象的value并放入list中
export function getValueList (list) {
  let valueList = []
  for (let item of list) {
    valueList.push(item.value)
  }
  return valueList
}

// -------------------------------------------------------数据金额处理 元转分
export function yuanToFen (num) {
  if (num) {
    return Number.accMul(num, 100)
  } else {
    return num
  }
}

// -------------------------------------------------------数据金额处理 分转元
export function fenToYuan (num) {
  if (num) {
    return Number.accDiv(num, 100)
  } else {
    return num
  }
}

// -------------------------------------------------------数据金额处理加法
export function accAdd (num1, num2) {
  return Number.accAdd(num1, num2)
}

// -------------------------------------------------------数据金额处理减法
export function accSub (num1, num2) {
  return Number.accSub(num1, num2)
}

// -------------------------------------------------------数据金额处理乘法
export function accMul (num1, num2) {
  return Number.accMul(num1, num2)
}

// -------------------------------------------------------数据金额处理除法
export function accDiv (num1, num2) {
  return Number.accDiv(num1, num2)
}

// -----------------------------------------------------正则合法性验证
// 检查非特殊符号
export function checkNoSpecialCode (val) {
  return /^[\w\u4e00-\u9fa5-]*$/.test(val)
}

// 检查长度
export function checkLength (val, leng) {
  return val && val.length === leng
}

// 检查中文
export function checkChineseName (chineseName) {
  var reg = /^[\u4e00-\u9fa5]+$/
  return chineseName && reg.test(chineseName)
}

// 检查中文 可以为空
export function checkChineseNameMaybeNull (chineseName) {
  var reg = /^[\u4e00-\u9fa5]*$/
  return reg.test(chineseName)
}

// 检查中英文
export function checkName (name) {
  var reg = /^[\u4e00-\u9fa5a-zA-Z()]+$/
  return name && reg.test(name)
}

// 检查数字和字母
export function checkNumAndLetter (numAndletter) {
  var reg = /^[a-zA-Z0-9]*$/
  return reg.test(numAndletter)
}

// 检查数字
export function checkNum (num) {
  var reg = /^(\d{1,10})*$/
  return reg.test(num)
}
// 只能输入整数或小数的正则表达式
export function checkNumAndDecimal (num) {
  var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/
  return reg.test(num)
}
// 检查身份证号
export function checkIdcard (Idcard) {
  var reg = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/
  return Idcard && reg.test(Idcard)
}

// 检查身份证号 可以为空
export function checkIdcardMaybeNull (Idcard) {
  var reg = /^((\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x))*$/
  return reg.test(Idcard)
}

// 检查手机号码可以带 逗号 多位
export function checkTelMore (tel) {
  var reg = /^(([1][0-9]{10},*)+)$/
  return tel && reg.test(tel)
}

// 检查手机号码
export function checkTel (tel) {
  var reg = /^[1][0-9]{10}$/
  return tel && reg.test(tel)
}

// 检查手机号码 可以为空
export function checkTelMaybeNull (tel) {
  var reg = /^([1][0-9]{10})*$/
  return reg.test(tel)
}

// 检查手机号码和电话号码----这个方法没用到
export function checkTelAndPhone (tel) {
  var reg = /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$|(^[1][0-9]{10}$)/
  return tel && reg.test(tel)
}

// 检查密码new
export function checkPwd (pwd) {
  var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[0-9A-Za-z]).{6,18}$/
  return pwd && reg.test(pwd)
}

// 检查银行卡号
export function checkBankCard (bankcard) {
  var reg = /^(\d{1,30})$/
  return bankcard && reg.test(bankcard)
}

// 检查邮箱
export function checkEmail (email) {
  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]{2,4})+/
  return email && reg.test(email)
}

// 检查邮箱 可以为空
export function checkEmailMaybeNull (email) {
  var reg = /^(([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]{2,4})+)*$/
  return reg.test(email)
}

// 检查验证码
export function checkVerifyCode (verifyCode) {
  var reg = /^\d{6}$/
  return verifyCode && reg.test(verifyCode)
}

// 滕昊
// 检查第一位非0数字
export function positiveInteger (verifyCode) {
  var reg = /^[1-9]+[0-9]*$/

  return verifyCode && reg.test(verifyCode)
}

// 检查小数
export function decimal (verifyCode) {
  var reg = /^(([1-9]\d*\.?\d*)|(\d*\.\d+))$/
  // /^[0-9]+\.\d{2}$|^[1-9]\d*$/;
  return verifyCode && reg.test(verifyCode)
}

// 检查小数 只能是两位小数
export function decimalRate (verifyCode) {
  var reg = /^[0-9]+\.\d{2}$|^[1-9]\d*$/
  return verifyCode && reg.test(verifyCode)
}

// 检查英文数字
export function EnglshDagital (verifyCode) {
  var reg = /^[a-zA-Z0-9]+$/
  return verifyCode && reg.test(verifyCode)
}

// 检查是否是安卓压缩包
export function checkIsAPK (APK) {
  var reg = /^.*\.APK$|(^.*\.apk$)/
  return APK && reg.test(APK)
}

// 检查是否是安卓压缩包
export function checkIframe (iframe) {
  var reg = /<iframe.*?>(.*?)<\/iframe>/ig// iframe的正则表达式;
  return iframe && reg.test(iframe)
}
// 检查是否是正常版本
export function checkVersion (version) {
  var reg = /^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}$/ // 版本的正则表达式;
  return version && reg.test(version)
}
export function setAttr (elm) {
  let attr = elm.getAttributeNode('\'allowfullscreen\'')
  if (attr) {
    elm.removeAttributeNode(attr)
  }
  elm.src = elm.src.replace('http:', '')
  elm.width = ''
  elm.height = ''
  elm.className = 'iframeVedio'
  elm.setAttribute('frameborder', 0)
  elm.setAttribute('allowfullscreen', '')
}

export function parseIframe (data) {
  let div = document.createElement('div')
  div.innerHTML = data
  let iframe = div.getElementsByTagName('iframe')
  let iLen = iframe.length
  if (iLen) {
    for (let i = 0; i < iLen; i++) {
      setAttr(iframe[i])
    }
  } else {
    setAttr(iframe[0])
  }
  return div.innerHTML
}

/***
 * 判断是否数组
 *
 */
export function isArray (o) {
  return Object.prototype.toString.call(o) == '[object Array]'
}

// --------------------------------------------------------------------window.sessionStorage 保存对象
/** *set
 * 页签导航数据tag
 * @param type menus
 */
export function setList (key, value) {
  if (typeof value === 'object') {
    sessionStorage.setItem(key, JSON.stringify(value))
    return
  }
  throw new Error('value type is not object ')
}

// 获取用户昵称
export function getList (key) {
  var value = sessionStorage.getItem(key)
  if (!value) {
    return []
  }
  try {
    return JSON.parse(value)
  } catch (e) {
    return []
  }
}

export function setUser (userName) {
  window.sessionStorage.userName = userName
}

export function getUser () {
  return window.sessionStorage.userName ? window.sessionStorage.userName : ''
}

export function saveObj (key, value) {
  if (typeof value === 'object') {
    window.sessionStorage.setItem(key, JSON.stringify(value))
    return
  }
  throw new Error('value type is not object ')
}

export function fetchObj (key) {
  var value = window.sessionStorage.getItem(key)
  if (!value) {
    return {}
  }
  try {
    return JSON.parse(value)
  } catch (e) {
    return {}
  }
}

// 滕昊-王鑫
// 保存项目id (所有编辑页码的id)
export function getProID (id) {
  if (id) window.sessionStorage.ProID = id
  return window.sessionStorage.ProID
}

// 保存项目type(所有编辑页码的第二个参数)
export function getProType (type) {
  if (type || type === 0) window.sessionStorage.ProType = type
  return window.sessionStorage.ProType
}

// 保存name(所有编辑页码的第二个参数)
export function getTemplateName (templateName) {
  if (templateName) window.sessionStorage.templateName = templateName
  return window.sessionStorage.templateName
}

// 清除项目的id与type
export function clearProData () {
  window.sessionStorage.ProID = ''
  window.sessionStorage.ProType = ''
}

// 保存项目面包屑
export function clearBreadcrumName () {
  window.sessionStorage.breadcrumName = ''
}

export function getBreadcrumName (breadcrum) {
  if (breadcrum) window.sessionStorage.breadcrumName = breadcrum
  return window.sessionStorage.breadcrumName
}

// ----------------------------------------------------------
// 保存开户行手机号
export function setSource (source) {
  window.sessionStorage.source = source
}

// 获取开户行手机号
export function getSource () {
  return window.sessionStorage.source
}

// 保存开户行手机号
export function setMobile (mobile) {
  window.sessionStorage.mobile = mobile
}

// 获取开户行手机号
export function getMobile () {
  return window.sessionStorage.mobile
}

// 保存营业执照/信用代码
export function setBusinessLicenseCode (businessLicenseCode) {
  window.sessionStorage.businessLicenseCode = businessLicenseCode
}

// 获取营业执照/信用代码
export function getBusinessLicenseCode () {
  return window.sessionStorage.businessLicenseCode
}

// 保存活动信息的code
export function setCode (code) {
  window.sessionStorage.code = code
}

// 获取活动信息的code
export function getCode () {
  return window.sessionStorage.code
}

// 保存系统配置的key
export function setKey (key) {
  window.sessionStorage.key = key
}

// 获取系统配置的key
export function getKey () {
  return window.sessionStorage.key
}

// 保存domain
export function setDomain (domain) {
  window.sessionStorage.domain = domain
}

// 获取domain
export function getDomain () {
  return window.sessionStorage.domain
}

// ------------------------------控制台打印
export function log (path, content, printMethod) { // printMethod为打印方式 log info warn error
  let isLog
  process.env.NODE_ENV === 'development' ? isLog = true : isLog = false
  if (isLog) {
    switch (printMethod) {
      case 'info':
        console.info(path + '-------------->' + JSON.stringify(content))
        break
      case 'warn':
        console.warn(path + '-------------->' + JSON.stringify(content))
        break
      case 'error':
        console.error(path + '-------------->' + JSON.stringify(content))
        break
      default:
        console.log(path + '-------------->' + JSON.stringify(content))
    }
  }
}

// ------------------------------弹出框confirm-滕昊
export function alertConfirm (that, confirmFun = '', confirmTtext = '您将进行操作, 是否继续?', confirmTitle = '提示', confirmBTN = '确定', cancelBTN = '取消', confirmType = 'warning', showCancel = true) {
  that.$confirm(confirmTtext, confirmTitle, {
    confirmButtonText: confirmBTN,
    cancelButtonText: cancelBTN,
    showCancelButton: showCancel,
    type: confirmType
  }).then(() => {
    confirmFun && confirmFun()
  }).catch(() => {})
}

// ------------------------------弹出框msgbox-滕昊
export function msgBox (that, msgBoxtext = '这个text需要传参', showConfirm = false, showCancel = false, msgAction = '', errAction = '', cancelFun = '', style = 'text-align:center', autoClose = false, confirmBTN = '重发', cancelBTN = '关闭') {
  let element = that.$createElement
  that.$msgbox({
    title: ' ',
    message: element('h2', {style: style}, msgBoxtext),
    // message:element('h2',{style:"text-align:center"},msgBoxtext),
    /* message: h('p', null, [
      h('span',{}, '内容可以是：'),
      h('span', { style: 'color: red' }, 'VNode')
    ]), */
    showConfirmButton: showConfirm,
    showCancelButton: showCancel,
    confirmButtonText: confirmBTN,
    cancelButtonText: cancelBTN,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        setTimeout(() => {
          document.querySelector('.el-message-box__wrapper').parentNode.removeChild(document.querySelector('.el-message-box__wrapper'))
          done()
        }, 500)
      } else {
        document.querySelector('.el-message-box__wrapper').parentNode.removeChild(document.querySelector('.el-message-box__wrapper'))
        cancelFun && cancelFun()
        done()
      }
    }
  })
    .then(() => {
      msgAction && msgAction()
    })
    .catch(() => {
      errAction && errAction()
    })
}

// ------------------------------弹出框inputBox-滕昊
export function inputBox (that, inputFun = '') {
  that.$prompt('发送到手机', '是否确认重置客户登录密码？', {
    message: '',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^[1][34587][0-9]{9}$/,
    inputErrorMessage: '手机号格式不正确'
  }).then(({value}) => {
    log(document.getElementsByClassName('el-message-box')[0])
    inputFun || inputFun(value)
  }).catch(() => {
    log(document.getElementsByClassName('el-message-box')[0])
  })
}

// ------------------------------编辑模版中拖拽的顺序保存

export function templateItemOder (useData, delData, templateId) {
  let obj = {
    bizItems: [],
    templateId: templateId
  }
  let ulen = useData.length
  let dlen = delData.length
  for (let i = 0; i < ulen; i++) {
    obj.bizItems.push({'itemId': useData[i].id, 'sequence': (i + 1 + '0') * 1, 'status': 20})
  }
  for (let j = 0; j < dlen; j++) {
    obj.bizItems.push({'itemId': delData[j].id, 'sequence': 0, 'status': 10})
  }
  return obj
}

// ------------------------------数组中有相同项返回true活false--针对模版管理tag标签

export function identicalItem (arr, key, val) {
  if (key) {
    for (let x of arr) {
      if (x[key] === val) {
        return false
      }
    }
  }
  return true
}

/**
 * 清空所有数据,回到初始页面
 */
export function clearData () {
  localStorage.clear()
  sessionStorage.clear()
  location.href = location.origin
}

export function confirmfun (msg, catchName) {
  if (catchName === 1) {
    let r = confirm(msg)
    if (!r) {
      alert('在此状态下请不要随意操作,并且任何操作均已失效')
    }
    clearData()
  }
}
