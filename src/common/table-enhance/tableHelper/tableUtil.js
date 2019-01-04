const typeOf = obj => {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}
const deepCopy = data => {
  const t = typeOf(data)
  let o = data
  if (t === 'array') {
    o = []
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  }
  if (t === 'object') {
    o = {}
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}
export {deepCopy}

const convertColumnsConfigToRow = (columns, addMultistageHeader = false) => {
  const cloneColumns = deepCopy(columns)
  const result = []
  for (const column of cloneColumns) {
    if (!column.children) {
      result.push(column)
      continue
    }
    if (addMultistageHeader) {
      result.push(column)
    }
    result.push.apply(result, convertColumnsConfigToRow(column.children, addMultistageHeader))
  }
  return result
}
export {convertColumnsConfigToRow}

const buildColumnLevel = (column, parent) => {
  if (parent) {
    column.level = parent.level + 1
  }
  if (column.children) {
    for (const childrenColumn of column.children) {
      buildColumnLevel(childrenColumn, column)
    }
  }
}

const buildColumnColSpan = column => {
  if (!column.children) {
    column.colSpan = 1
    return
  }
  let colSpan = 0
  for (const childrenColumn of column.children) {
    buildColumnColSpan(childrenColumn)
    colSpan += childrenColumn.colSpan
  }
  column.colSpan = colSpan
}

const getColumnMaxLevel = columns => {
  const levels = columns.map(item => {
    return item.level
  })
  return levels.length > 0 ? Math.max.apply(null, levels) : -1
}

const buildColumnRowSpan = (columns, maxLevel) => {
  for (const column of columns) {
    column.rowSpan = column.children ? 1 : maxLevel - column.level + 1
  }
}

const buildColAndRowSpanRow = (columns, maxLevel) => {
  const rows = []
  for (let i = 0; i < maxLevel; i++) {
    rows.push([])
  }
  for (const column of columns) {
    rows[column.level - 1].push(column)
  }
  return rows
}

const calculateColAndRowSpan = columns => {
  const cloneColumns = deepCopy(columns)
  for (const column of cloneColumns) {
    column.level = 1
    buildColumnLevel(column)
    buildColumnColSpan(column)
  }
  const multistageHeaderColumns = convertColumnsConfigToRow(cloneColumns, true)
  const maxLevel = getColumnMaxLevel(multistageHeaderColumns)
  buildColumnRowSpan(multistageHeaderColumns, maxLevel)
  return buildColAndRowSpanRow(multistageHeaderColumns, maxLevel)
}
export {calculateColAndRowSpan}

const getRandomStr = function (len = 32) {
  const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  const maxPos = $chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}
export {getRandomStr}
