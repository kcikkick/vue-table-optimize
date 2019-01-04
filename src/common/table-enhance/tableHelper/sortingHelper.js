import _ from 'lodash';
import {
  ASC,
  DESC,
} from './constant';

export const filterEmtpySort = value => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  return 1;
};

export const getDefaultSortingFields = defaultSortFileds => {
  const sortings = [];
  for (let i = 0; i < defaultSortFileds.length; i++) {
    if (_.isFunction(defaultSortFileds[i].sortKey)) {
      const dir = defaultSortFileds[i].dir;
      sortings.push(item => filterEmtpySort(defaultSortFileds[i].sortKey(item, dir)));
    }
    else {
      sortings.push(item => filterEmtpySort(item[defaultSortFileds[i].key]));
    }
    sortings.push(defaultSortFileds[i].sortKey);
  }
  return sortings;
};

export const getDefaultSortingDirs = defaultSortFileds => {
  const sortingDirs = [];
  for (let i = 0; i < defaultSortFileds.length; i++) {
    sortingDirs.push(DESC);
    sortingDirs.push(defaultSortFileds[i].dir);
  }
  return sortingDirs;
};

export const getOwnerDefinedSortingFields = (sorting, defaultSortFileds) => {
  const ownerSorting = [];
  ownerSorting.push(item => filterEmtpySort(sorting.sortKey(item, sorting.dir)));
  ownerSorting.push(sorting.sortKey);
  return ownerSorting.concat(getDefaultSortingFields(defaultSortFileds));
};

export const getOwnerDefinedSortingDirs = (sorting, defaultSortFileds) => {
  const ownerDirs = [];
  ownerDirs.push(DESC);
  ownerDirs.push(sorting.dir);
  return ownerDirs.concat(getDefaultSortingDirs(defaultSortFileds));
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
