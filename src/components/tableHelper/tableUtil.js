import _ from 'lodash';

const convertColumnsConfigToRow = (columns, addMultistageHeader = false) => {
  const cloneColumns = _.cloneDeep(columns);
  const result = [];
  for (const column of cloneColumns) {
    if (!column.children) {
      result.push(column);
      continue;
    }
    if (addMultistageHeader) {
      result.push(column);
    }
    result.push.apply(result, convertColumnsConfigToRow(column.children, addMultistageHeader));
  }
  return result;
};
export {convertColumnsConfigToRow};

const buildColumnLevel = (column, parent) => {
  if (parent) {
    column.level = parent.level + 1;
  }
  if (column.children) {
    for (const childrenColumn of column.children) {
      buildColumnLevel(childrenColumn, column);
    }
  }
};

const buildColumnColSpan = column => {
  if (!column.children) {
    column.colSpan = 1;
    return;
  }
  let colSpan = 0;
  for (const childrenColumn of column.children) {
    buildColumnColSpan(childrenColumn);
    colSpan += childrenColumn.colSpan;
  }
  column.colSpan = colSpan;
};

const getColumnMaxLevel = columns => {
  const levels = columns.map(item => {
    return item.level;
  });
  return levels.length > 0 ? Math.max.apply(null, levels) : -1;
};

const buildColumnRowSpan = (columns, maxLevel) => {
  for (const column of columns) {
    column.rowSpan = column.children ? 1 : maxLevel - column.level + 1;
  }
};

const buildColAndRowSpanRow = (columns, maxLevel) => {
  const rows = [];
  for (let i = 0; i < maxLevel; i++) {
    rows.push([]);
  }
  for (const column of columns) {
    rows[column.level - 1].push(column);
  }
  return rows;
};

const calculateColAndRowSpan = columns => {
  const cloneColumns = _.cloneDeep(columns);
  for (const column of cloneColumns) {
    column.level = 1;
    buildColumnLevel(column);
    buildColumnColSpan(column);
  }
  const multistageHeaderColumns = convertColumnsConfigToRow(cloneColumns, true);
  const maxLevel = getColumnMaxLevel(multistageHeaderColumns);
  buildColumnRowSpan(multistageHeaderColumns, maxLevel);
  return buildColAndRowSpanRow(multistageHeaderColumns, maxLevel);
};
export {calculateColAndRowSpan};

const getRandomStr = (len = 32) => {
  const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const maxPos = $chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
};
export {getRandomStr};

const calculateDomItemsMinHeight = (itemHeight, remainHeight, scrollTop) => {
  return scrollTop > remainHeight ? Math.floor((scrollTop - remainHeight) / itemHeight) * itemHeight : 0;
};

const calculateDomItemsMaxHeight = (itemHeight, remainHeight, viewPortHeight, renderItemsHeight, scrollTop) => {
  return scrollTop > remainHeight ? Math.ceil((scrollTop + remainHeight + viewPortHeight) / itemHeight) * itemHeight : renderItemsHeight;
};

const calDomItemsHeight = (itemHeight, remainHeight, viewPortHeight, renderItemsHeight, scrollTop) => {
  const minHeight = calculateDomItemsMinHeight(itemHeight, remainHeight, scrollTop);
  const maxHeight = calculateDomItemsMaxHeight(itemHeight, remainHeight, viewPortHeight, renderItemsHeight, scrollTop);
  return [
    minHeight,
    maxHeight,
  ];
};
export {calDomItemsHeight};
