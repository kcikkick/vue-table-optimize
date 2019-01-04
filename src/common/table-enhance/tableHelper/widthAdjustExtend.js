import _ from 'lodash';
import {C_ID_NAME} from './constant';

const resizeColumnWidth = (colGroupRefs, childTag, columnKey, width) => {
  if (colGroupRefs) {
    const colChildNodes = colGroupRefs.getElementsByTagName(childTag);
    if (colChildNodes) {
      for (let i = 0; i < colChildNodes.length; i++) {
        const colNode = colChildNodes[i];
        const colNodeColumnKey = colNode.getAttribute('columnKey');
        if (colNodeColumnKey === columnKey) {
          colNode.style.width = `${width}px`;
          break;
        }
      }
    }
  }
};

export const dragColumn = (headerRow, headerColGroupRefs, bodyColGroupRefs, columnsRowConfig) => {
  const trChildNodes = headerRow.childNodes;
  for (let trIndex = 0; trIndex < trChildNodes.length; trIndex++) {
    const thChildNodes = trChildNodes[trIndex].getElementsByTagName('th');
    const liObj = {};
    for (let i = 0; i < thChildNodes.length; i++) {
      const columnKey = thChildNodes[i].getAttribute('columnKey');
      const columnConfig = _.find(columnsRowConfig, {[C_ID_NAME]: columnKey});
      if (columnConfig && !columnConfig.disableDrag) {
        thChildNodes[i].addEventListener('mousedown', function (event) {
          if (event && event.offsetX > this.offsetWidth - 10) {
            liObj.mouseDown = true;
            liObj.oldX = event.x;
            liObj.oldWidth = this.offsetWidth;
            liObj._self = this;
            liObj.columnKey = this.getAttribute('columnKey');
          }
        });
        thChildNodes[i].addEventListener('mouseup', function (event) {
          if (!liObj._self === undefined) {
            liObj._self = this;
          }
          liObj.mouseDown = false;
          liObj._self.style.cursor = 'default';
        });
        thChildNodes[i].addEventListener('mousemove', _.throttle(function (event) {
          if (liObj._self === undefined) {
            liObj._self = this;
          }
          this.style.cursor = (event.offsetX > this.offsetWidth - 60) ? 'e-resize' : 'default';
          if (liObj.mouseDown) {
            liObj._self.style.cursor = 'e-resize';
            let newWidth = (liObj.oldWidth + (event.x - liObj.oldX) > 0) ? liObj.oldWidth + (event.x - liObj.oldX) : liObj._self.style.width;
            newWidth = newWidth < 60 ? 60 : newWidth;
            resizeColumnWidth(headerColGroupRefs, 'col', liObj.columnKey, newWidth);
            resizeColumnWidth(bodyColGroupRefs, 'div', liObj.columnKey, newWidth);
          }
        }, 100));
      }
    }
  }
};
