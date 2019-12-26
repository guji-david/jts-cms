let stack = []
let ctx
let num = 0// 马赛克的程度，数字越大越模糊

// 从 canvas 提取图片 image
const convertCanvasToImage = canvas => {
  // 新Image对象，可以理解为DOM
  let image = new Image()
  // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
  image.src = canvas.toDataURL('image/jpeg')// 指定格式 jpg
  return image
}

const draw = (ctx, x, y) => {
  // 获取左边图像的局部坐标的部分像素（左图位置在258，为方便演示，这里设成和马赛克显示位置一样的坐标）
  let oImg = ctx.getImageData(x, y, num * 10, num * 10)
  let {width, height} = oImg
  // 等分画布
  let stepW = width / num
  let stepH = height / num
  // 这里是循环画布的像素点
  for (let i = 0; i < stepH; i++) {
    for (let j = 0; j < stepW; j++) {
      // 获取一个小方格的随机颜色，这是小方格的随机位置获取的
      let _x = j * num + Math.floor(Math.random() * num)
      let _y = i * num + Math.floor(Math.random() * num)
      let color = getXY(oImg, _x, _y)
      // 这里是循环小方格的像素点，
      for (let k = 0; k < num; k++) {
        for (let l = 0; l < num; l++) {
          // 设置小方格的颜色
          setXY(oImg, j * num + l, i * num + k, color)
        }
      }
    }
  }
  ctx.putImageData(oImg, x, y)
}

const getXY = (obj, x, y) => {
  let w = obj.width
  let color = []
  for (let i = 0; i < 4; i++) {
    color[i] = obj.data[4 * (y * w + x) + i]
  }
  return color
}

const setXY = (obj, x, y, color) => {
  let w = obj.width
  for (let i = 0; i < 4; i++) {
    obj.data[4 * (y * w + x) + i] = color[i]
  }
}

/**
 * @param {canvasWidth:number, sourceImagePath:url, dom:DOM} data
 */
export function drawCanvas (data) { // first step draw canvas
  stack.length = 0
  const {canvasWidth, sourceImagePath, dom} = data
  let aImg = new Image()
  aImg.setAttribute('crossOrigin', 'anonymous')
  aImg.src = sourceImagePath.indexOf('?') > -1 ? `${sourceImagePath}&timestamp=${new Date().getTime()}` : `${sourceImagePath}?timestamp=${new Date().getTime()}`
  let initDraw = it => { // 绘制第一张图
    let height = aImg.height / (aImg.width / canvasWidth)
    let canvasEl = document.createElement('canvas')
    Object.assign(canvasEl, {
      id: 'canvas',
      width: canvasWidth,
      height,
      style: 'cursor: pointer'
    })
    dom.innerHTML = ''
    dom.appendChild(canvasEl) // create canvas and append body
    ctx = canvasEl.getContext('2d')
    ctx.drawImage(it, 0, 0, canvasWidth, height)
    return canvasEl
  }
  aImg.onload = function () { // image load callback
    let canvasEl = initDraw(this)
    canvasEl.onmousedown = () => { // 鼠标在画布上点击
      stack.push(convertCanvasToImage(canvasEl))
      // 鼠标down时，保存一个新图片，src=canvas转换成base64
      if (!canvasEl.onmousemove) {
        canvasEl.onmousemove = evt => { // 鼠标在画布上移动
          let x = evt.pageX - canvasEl.offsetLeft
          let y = evt.pageY - canvasEl.offsetTop + document.getElementById('main-content').scrollTop
          draw(ctx, x - 2, y - (num * 10) / 2)
        }
      }
      // document.body.appendChild(convertCanvasToImage(canvasEl))
    }
    canvasEl.onmouseup = () => { // 鼠标在画布上离开
      canvasEl.onmousemove = null
    }
  }
};

// 撤销方法
export function backCanvas () {
  if (!stack.length) return
  let undoImage = stack.pop()
  if (undoImage) {
    ctx.drawImage(undoImage, 0, 0)
  }
}

// 重置方法
export function originCanvas () {
  if (!stack.length) return
  let undoImage = stack[0]
  if (undoImage) {
    ctx.drawImage(undoImage, 0, 0)
  }
  stack.length = 0
}

// 设置马赛克大小
export function mosaicSize (number, callback) {
  num = number
  if (typeof callback === 'function') callback()
}

// 从新加载最初img，一切从零绘画
export function reDrawCanvas (canvasBox) {
  canvasBox.innerHTML = ''
  stack.length = 0
}

const compress = (canvas, size, num = 1.0) => {
  if (canvas) {
    let canvasBase64 = canvas.toDataURL('image/jpeg', num)
    if (canvasBase64.substr(canvasBase64.indexOf(',') + 1).length < (size) || num <= 0) {
      return canvasBase64.substr(canvasBase64.indexOf(',') + 1)
    } else {
      return compress(canvas, size, num - 0.1)
    }
  }
}

/**
 * 保存图片，返回base64
 * @param {'DOM元素'} canvas
 * @param {...} size
 */
export function saveCanvas (canvas, size) {
  return new Promise((resolve, reject) => {
    let base64 = compress(canvas, size)
    if (base64) {
      resolve(base64)
    } else {
      reject(new Error('保存失败，再试一次！'))
    }
  })
}
