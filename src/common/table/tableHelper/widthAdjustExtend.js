import _ from 'lodash';

const adjustBodyColumn = (bodyRows, index, width, lastColumnWidth) => {
  if (index !== -1) {
    const childNodes = bodyRows.childNodes;
    const rowsCount = childNodes.length;
    for (let i = 0; i < rowsCount; i++) {
      const columnList = childNodes[i].getElementsByTagName('li');
      columnList[index].style.width = `${width}px`;
      // columnList[columnList.length - 1].style.width = `${lastColumnWidth}px`;
    }
  }
};

// const getLastColumnWidthLength = (headerRow, liLength, bodyLength) => {
//   let countWidth = 0;
//   for (let i = 0; i < liLength; i++) {
//     if (i === liLength - 1) {
//       break;
//     }
//     const titleColumn = headerRow.childNodes[i];
//     const titleColumnWidth = titleColumn.style.width;
//     if (titleColumnWidth.indexOf('%') !== -1) {
//       countWidth += parseFloat(titleColumnWidth.split('%')[0]) / 100 * bodyLength;
//       continue;
//     }
//     if (titleColumnWidth.indexOf('px') !== -1) {
//       countWidth += parseFloat(titleColumnWidth.split('px')[0]);
//       continue;
//     }
//   }
//   const lastColumnWidth = (bodyLength - countWidth).toFixed(1);
//   headerRow.childNodes[liLength - 1].style.width = `${lastColumnWidth}px`;
//   return lastColumnWidth;
// };

const getIndexByType = (columns, type) => {
  for (let index = 0; index < columns.length; index++) {
    const column = columns[index];
    if (column.key === type) {
      return column.index || index;
    }
  }
  return -1;
};

export const extendAjustColumnWidth = (headerRow, bodyRows, columns) => {
  const liLength = headerRow.childNodes.length;
  const liObj = {};
  for (let i = 0; i < liLength; i++) {
    headerRow.childNodes[i].addEventListener('mousedown', function (event) {
      if (event && event.offsetX > this.offsetWidth - 10) {
        liObj.mouseDown = true;
        liObj.oldX = event.x;
        liObj.oldWidth = this.offsetWidth;
        liObj._self = this;
        liObj.columnIndex = getIndexByType(columns, this.getAttribute('columnKey'));
      }
    });
    headerRow.childNodes[i].addEventListener('mouseup', function (event) {
      if (!liObj._self === undefined) {
        liObj._self = this;
      }
      liObj.mouseDown = false;
      liObj._self.style.cursor = 'default';
    });
    headerRow.childNodes[i].addEventListener('mousemove', _.throttle(function (event) {
      if (liObj._self === undefined) {
        liObj._self = this;
      }
      this.style.cursor = (event.offsetX > this.offsetWidth - 10) ? 'col-resize' : 'default';
      if (liObj.mouseDown) {
        liObj._self.style.cursor = 'col-resize';
        const newWidth = (liObj.oldWidth + (event.x - liObj.oldX) > 0) ? liObj.oldWidth + (event.x - liObj.oldX) : liObj._self.style.width;
        liObj._self.style.width = `${newWidth}px`;
        // const lastColumnWidth = getLastColumnWidthLength(headerRow, liLength, bodyRows.offsetWidth);
        const lastColumnWidth = null;
        adjustBodyColumn(bodyRows, liObj.columnIndex, newWidth, lastColumnWidth);
      }
    }, 100));
  }
};
