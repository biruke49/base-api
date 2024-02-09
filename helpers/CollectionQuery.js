const FilterOperators = {
  EqualTo: "=",
  Between: "between",
  LessThan: "<",
  LessThanOrEqualTo: "<=",
  GreaterThan: ">",
  GreaterThanOrEqualTo: ">=",
  In: "in",
  Any: "any",
  NotNull: "notNull",
  IsNull: "isNull",
  NotEqualTo: "!=",
  Like: "like",
  NotIn: "notIn",
};

const CollectionQuery = {
  buildQuery: (query) => {
    const filter = getFilter(query.filter);
    let select = "";
    if (query.select && Array.isArray(query.select)) {
      query.select.unshift("_id");
      query.select.forEach((element) => {
        select += element + " ";
      });
    }
    let include = "";
    if (query.includes && Array.isArray(query.includes)) {
      query.includes.forEach((element) => {
        include += element + " ";
      });
    }
    include = include.trim();
    let order = {};
    if (query.orderBy && Array.isArray(query.orderBy)) {
      query.orderBy.forEach((element) => {
        order[element.field] = element.direction == "desc" ? -1 : 1;
      });
    }
    if (query.search && query.searchFrom) {
      let searchFrom = [];
      if (Array.isArray(query.searchFrom)) {
        searchFrom = query.searchFrom;
      } else {
        searchFrom = query.searchFrom.split(",");
      }
      if (!filter.$or) {
        filter.$or = [];
      }
      searchFrom.forEach((sf) => {
        const searchFilter = {};
        //searchFilter[sf] = { $regex: '.*' + query.search.trim() + '.*' };
        searchFilter[sf] = { $regex: new RegExp(query.search.trim(), "i") };
        filter.$or.push(searchFilter);
      });
    }
    const skip = query.skip;
    const top = query.top;
    const options = { skip: skip, limit: top, sort: order };
    return { options, select, include, filter };
  },
};
const getFilter = (filterOption) => {
  const filter = {};
  if (filterOption && Array.isArray(filterOption)) {
    const andFilter = [];
    filterOption.forEach((f) => {
      if (Array.isArray(f)) {
        const orFilter = [];
        f.forEach((o) => {
          const ob = {};
          const singleOrFilter = getOperator(o);
          ob[o.field] = singleOrFilter;
          orFilter.push(ob);
        });
        if (orFilter && orFilter.length > 0) {
          andFilter.push({ $or: orFilter });
        }
      } else {
        const singleFilter = getOperator(f);
        filter[f.field] = singleFilter;
      }
    });

    if (andFilter && andFilter.length > 0) {
      const $and = "$and";
      filter[$and] = andFilter;
    }
  }

  return filter;
};
const getOperator = (filterObject) => {
  let value = null;
  switch (filterObject.operator) {
    case FilterOperators.EqualTo:
      if (filterObject.type && filterObject.type == "date") {
        const d = new Date(filterObject.value);
        let nextDate = new Date(d.getTime());
        nextDate.setDate(nextDate.getDate() + 1);
        value = { $gte: d, $lt: nextDate };
      } else {
        value = filterObject.value;
      }
      break;
    case FilterOperators.GreaterThan:
      if (filterObject.type && filterObject.type == "date") {
        value = { $gt: new Date(filterObject.value) };
      } else {
        value = { $gt: filterObject.value };
      }
      break;
    case FilterOperators.GreaterThanOrEqualTo:
      if (filterObject.type && filterObject.type == "date") {
        value = { $gte: new Date(filterObject.value) };
      } else {
        value = { $gte: filterObject.value };
      }
      break;
    case FilterOperators.LessThan:
      if (filterObject.type && filterObject.type == "date") {
        value = { $lt: new Date(filterObject.value) };
      } else {
        value = { $lt: filterObject.value };
      }
      break;
    case FilterOperators.GreaterThanOrEqualTo:
      if (filterObject.type && filterObject.type == "date") {
        value = { $lte: new Date(filterObject.value) };
      } else {
        value = { $lte: filterObject.value };
      }
      break;
    case FilterOperators.IsNull:
      value = null;
      break;
    case FilterOperators.In:
      if (Array.isArray(filterObject.value)) {
        value = { $in: filterObject.value };
      } else {
        const values = filterObject.value.split(",");
        if (Array.isArray(values)) {
          value = { $in: values };
        }
      }
      break;
    case FilterOperators.NotIn:
      if (Array.isArray(filterObject.value)) {
        value = { $nin: filterObject.value };
      } else {
        const values = filterObject.value.split(",");
        if (Array.isArray(values)) {
          value = { $nin: values };
        }
      }
      break;
    case FilterOperators.NotNull:
      value = { $ne: null };
      break;
    case FilterOperators.NotEqualTo:
      value = { $ne: filterObject.value };
      break;
    case FilterOperators.Like:
      //value = { $regex: '.*' + filterObject.value.trim() + '.*' };
      value = { $regex: new RegExp(filterObject.value.trim(), "i") };
      break;
    case FilterOperators.Between:
      if (Array.isArray(filterObject.value) && filterObject.value.length >= 2) {
        if (filterObject.type && filterObject.type == "date") {
          const d = new Date(filterObject.value[1]);
          let nextDate = new Date(d.getTime());
          nextDate.setDate(nextDate.getDate() + 1);
          value = { $gte: new Date(filterObject.value[0]), $lte: nextDate };
        } else {
          value = { $gte: filterObject.value[0], $lt: filterObject.value[1] };
        }
      } else {
        const values = filterObject.value.split(",");
        if (values.length === 2) {
          if (filterObject.type && filterObject.type == "date") {
            const d = new Date(values[1]);
            let nextDate = new Date(d.getTime());
            nextDate.setDate(nextDate.getDate() + 1);
            value = { $gte: new Date(values[0]), $lte: nextDate };
          } else {
            value = { $gte: values[0], $lt: values[1] };
          }
        }
      }
      break;
  }
  return value;
};
module.exports = { CollectionQuery, FilterOperators };
