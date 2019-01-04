import _ from 'lodash';
import {ASC, DESC, NO_MATCH_STOP} from '../../../../utilities/constant';

export const filterEmtpySort = value => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  return 1;
};

export const getDeivationsValue = function (a, dir) {
  const deviationsNum = parseFloat(a);
  if (_.isFinite(deviationsNum)) {
    return deviationsNum;
  }
  if (a === NO_MATCH_STOP) {
    return dir === DESC ? -Number.MAX_VALUE : Number.MAX_VALUE;
  }
  return null;
};

export const DEFAULT_SORTING_FIELDS = [
  {sortKey: 'actualDelay', key: 'actualDelay', dir: DESC},
  {sortKey: item => getDeivationsValue(item['deviations'], DESC), key: 'deviations', dir: DESC},
  {sortKey: 'ctEta', key: 'ctEta', dir: ASC},
];

export const getDefaultSortingFields = () => {
  const sortings = [];
  for (let i = 0; i < DEFAULT_SORTING_FIELDS.length; i++) {
    if (_.isFunction(DEFAULT_SORTING_FIELDS[i].sortKey)) {
      const dir = DEFAULT_SORTING_FIELDS[i].dir;
      sortings.push(item => filterEmtpySort(DEFAULT_SORTING_FIELDS[i].sortKey(item, dir)));
    }
    else {
      sortings.push(item => filterEmtpySort(item[DEFAULT_SORTING_FIELDS[i].key]));
    }
    sortings.push(DEFAULT_SORTING_FIELDS[i].sortKey);
  }
  return sortings;
};

export const getDefaultSortingDirs = () => {
  const sortingDirs = [];
  for (let i = 0; i < DEFAULT_SORTING_FIELDS.length; i++) {
    sortingDirs.push(DESC);
    sortingDirs.push(DEFAULT_SORTING_FIELDS[i].dir);
  }
  return sortingDirs;
};

export const getOwnerDefinedSortingFields = sorting => {
  const ownerSorting = [];
  ownerSorting.push(item => filterEmtpySort(sorting.sortKey(item, sorting.dir)));
  ownerSorting.push(sorting.sortKey);
  return ownerSorting.concat(getDefaultSortingFields());
};

export const getOwnerDefinedSortingDirs = sorting => {
  const ownerDirs = [];
  ownerDirs.push(DESC);
  ownerDirs.push(sorting.dir);
  return ownerDirs.concat(getDefaultSortingDirs());
};

export const includeNullSort = (a, b, type) => {
  if (!a) {
    return 1;
  }
  if (!b) {
    return -1;
  }
  const value = type === ASC ? 1 : -1;
  return a > b ? value : (a < b ? -value : 0);
};
