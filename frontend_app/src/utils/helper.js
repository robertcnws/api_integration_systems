/**
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_flatten
 * https://github.com/you-dont-need-x/you-dont-need-lodash
 */

// ----------------------------------------------------------------------

export function flattenArray(list, key = 'children') {
  let children = [];

  const flatten = list?.map((item) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]];
    }
    return item;
  });

  return flatten?.concat(children.length ? flattenArray(children, key) : children);
}

// ----------------------------------------------------------------------

export function flattenDeep(array) {
  const isArray = array && Array.isArray(array);

  if (isArray) {
    return array.flat(Infinity);
  }
  return [];
}

// ----------------------------------------------------------------------

export function orderBy(array, properties, orders) {
  return array.slice().sort((a, b) => {
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];
      const order = orders && orders[i] === 'desc' ? -1 : 1;

      const aValue = a[property];
      const bValue = b[property];

      if (aValue < bValue) return -1 * order;
      if (aValue > bValue) return 1 * order;
    }
    return 0;
  });
}

// ----------------------------------------------------------------------

export function keyBy(array, key) {
  return (array || []).reduce((result, item) => {
    const keyValue = key ? item[key] : item;

    return { ...result, [String(keyValue)]: item };
  }, {});
}

// ----------------------------------------------------------------------

export function sumBy(array, iteratee) {
  return array.reduce((sum, item) => sum + iteratee(item), 0);
}

// ----------------------------------------------------------------------

export function isEqual(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => isEqual(a[key], b[key]));
  }

  return false;
}

// ----------------------------------------------------------------------

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export const merge = (target, ...sources) => {
  if (!sources.length) return target;

  const source = sources.shift();

  // eslint-disable-next-line no-restricted-syntax
  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      merge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }

  return merge(target, ...sources);
};

// ----------------------------------------------------------------------

export function stripHtmlUsingDOM(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

// ----------------------------------------------------------------------

export function extractOutsideParentheses(input) {
  let result = '';
  let depth = 0;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      if (depth > 0) depth -= 1;
    } else if (depth === 0) {
      result += char;
    }
  }
  return result.replace(/\s+/g, ' ').trim();
}

// ----------------------------------------------------------------------

export function capitalize(str) {
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

// ----------------------------------------------------------------------

export function getIconByName(name) {

  const mappedIcons = [
    {
      keywords: ['update', 'measurement'],
      icon: 'marketeq:measuring-tape',
      includeFields: [
        'number',
        'marks.type',
        'marks.config',
        'marks.dimensions',
        'marks.notes',
        'project.number',
        'project.name',
        'service.number',
        'service.name',
        'notes',
      ],
      excludeFields: []
    },
    {
      keywords: ['update', 'project'],
      icon: 'material-icon-theme:folder-update-open',
      includeFields: [
        'name',
        'number',
        'reference_number',
        'start_date',
        'end_date',
        'inspection_date',
        'finish_permission_date',
        'is_part_days',
        'address',
        'has_permission',
        'description',
        'current_stage.name',
        'user_manager.username',
        'user_manager.name',
        'users_assignees.username',
        'users_assignees.name',
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project',
        'name',
        'number',
        'id'
      ]
    },
    {
      keywords: ['change', 'permission'],
      icon: 'icon-park:permissions',
      includeFields: [
        'has_permission'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['change', 'installer'],
      icon: 'openmoji:construction-worker',
      includeFields: [
        'project_default_tasks.project_default_task.name',
        'project_default_tasks.users_assignees.username',
        'project_default_tasks.users_assignees.name',
        'project_default_tasks.users_assignees.userRole.name',
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['change', 'address'],
      icon: 'fluent-color:people-home-16',
      includeFields: [
        'address'
      ],
      excludeFields: [
        'id',
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['edit', 'comment'],
      icon: 'fluent-color:clipboard-text-edit-20',
      includeFields: [
        'project_comments.comment'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['create', 'comment'],
      icon: 'emojione:new-button',
      includeFields: [
        'project_comments.comment'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['upload', 'files'],
      icon: 'marketeq:upload-alt-4',
      includeFields: [
        'project_attachments.name',
        'project_attachments.file',
        'project_default_tasks.project_default_task.name',
        'project_default_tasks.project_task_attachments.name',
        'project_default_tasks.project_task_attachments.file'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['delete', 'file'],
      icon: 'icon-park:delete-themes',
      includeFields: [
        'name',
        'file'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['remove', 'guide'],
      icon: 'flat-color-icons:delete-database',
      includeFields: [
        'project_guide_products.name'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['check', 'guide'],
      icon: 'marketeq:check-circle',
      includeFields: [
        'project_guide_products.name',
        'project_guide_products.ckecked'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['change', 'guide'],
      icon: 'icon-park:exchange-four',
      includeFields: [
        'project_guide_products.name',
        'project_guide_products.ckecked',
        'project_guide_products.price',
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['description', 'project'],
      icon: 'icon-park:text-message',
      includeFields: [
        'description'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['change', 'reference'],
      icon: 'fluent-color:number-symbol-square-20',
      includeFields: [
        'reference_number',
        'sales_order.reference_number'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['change', 'stage'],
      icon: 'token-branded:step',
      includeFields: [
        'current_stage.name',
        'project_history.initial_stage.name',
        'project_history.final_stage.name',
        'project_history.created_time'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['create', 'reminder'],
      icon: 'emojione-v1:ringing-bell',
      includeFields: [
        'date',
        'notes',
        'project_default_task.project_default_task.name'
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['change', 'manager', 'service'],
      icon: 'flat-color-icons:manager',
      includeFields: [
        'user_manager.username',
        'user_manager.firstName',
        'user_manager.lastName',
        'user_manager.email',
      ],
      excludeFields: [
        'id',
        '_id',
      ]
    },
    {
      keywords: ['create', 'service'],
      icon: 'vscode-icons:folder-type-services',
      includeFields: [
        'number',
        'name',
        'version',
        'sales_order.salesorder_number',
      ],
      excludeFields: [
        'id',
        '_id',
      ]
    },
    {
      keywords: ['change', 'properties', 'service'],
      icon: 'catppuccin:properties',
      includeFields: [],
      excludeFields: [
        'id',
        '__typename',
        'staff',
        'active',
        'avatar',
      ]
    },
    {
      keywords: ['close', 'service'],
      icon: 'icon-park:folder-failed',
      includeFields: [],
      excludeFields: [
        'id',
        '__typename',
        'staff',
        'active',
        'avatar',
      ]
    },
    {
      keywords: ['reopen', 'service'],
      icon: 'icon-park:folder-open',
      includeFields: [],
      excludeFields: [
        'id',
        '__typename',
        'staff',
        'active',
        'avatar',
      ]
    },
    {
      keywords: ['set', 'place', 'service'],
      icon: 'fluent-color:location-ripple-16',
      includeFields: [
        'name',
        'service_place.name',
      ],
      excludeFields: []
    },
    {
      keywords: ['change', 'note', 'service'],
      icon: 'fxemoji:note',
      includeFields: [
        'service_notes'
      ],
      excludeFields: []
    },
    {
      keywords: ['change', 'type', 'service'],
      icon: 'vscode-icons:folder-type-favicon',
      includeFields: [
        'service_type'
      ],
      excludeFields: []
    },
    {
      keywords: ['change', 'user', 'team', 'service'],
      icon: 'openmoji:construction-worker',
      includeFields: [
        'users_service_team.name',
        'users_service_team.username',
        'users_service_team.userRole.name',
      ],
      excludeFields: [
        'sales_order',
        '_id',
        'project'
      ]
    },
    {
      keywords: ['change', 'date', 'service'],
      icon: 'fluent-color:calendar-edit-16',
      includeFields: [],
      excludeFields: [
        'id',
        '__typename',
        'staff',
        'active',
        'avatar',
      ]
    },
    {
      keywords: ['change', 'status', 'task', 'service'],
      icon: 'fluent-color:clipboard-task-24',
      includeFields: [
        'service_default_task.name',
        'status',
        'percentage',
      ],
      excludeFields: []
    },
    {
      keywords: ['change', 'status', 'task', 'project'],
      icon: 'fluent-color:clipboard-task-24',
      includeFields: [
        'project_default_task.name',
        'status',
        'percentage',
      ],
      excludeFields: []
    },
    {
      keywords: ['create', 'measurement'],
      icon: 'icon-park:tape-measure',
      includeFields: [
        'number',
        'marks.type',
        'marks.config',
        'marks.dimensions',
        'marks.notes',
        'project.number',
        'project.name',
        'service.number',
        'service.name',
        'notes',
      ],
      excludeFields: []
    },
    {
      keywords: ['delete', 'mark', 'measurement'],
      icon: 'emojione-v1:exclamation-question-mark',
      includeFields: [
        'type',
        'config',
        'dimensions',
        'notes',
      ],
      excludeFields: []
    },
    {
      keywords: ['check', 'mark', 'first', 'measurement'],
      icon: 'noto-v1:check-mark',
      includeFields: [
        'type',
        'config',
        'dimensions',
        'notes',
        'first_check',
      ],
      excludeFields: []
    },
    {
      keywords: ['check', 'mark', 'second', 'measurement'],
      icon: 'marketeq:check-double',
      includeFields: [
        'type',
        'config',
        'dimensions',
        'notes',
        'second_check',
      ],
      excludeFields: []
    },

  ]
  
  const obj = mappedIcons.find((item) => item.keywords.every(key => name.includes(key)));

  return {
    icon: obj ? obj.icon : 'icon-park-outline:folder',
    includeFields: obj ? obj.includeFields : [],
    excludeFields: obj ? obj.excludeFields : ['id', '__typename', 'staff', 'active', 'avatar'],
  };
}

// ----------------------------------------------------------------------

export function transformText(input) {
  if (!input) return '';
  const words = input.split(' ');
  if (words.length < 2) return input;

  const verb = words[0].toLowerCase();
  const objectWords = words.slice(1);

  const pastVerb = verb.endsWith('e') ? `${verb}d` : `${verb}ed`;

  const objectPart = objectWords.length > 0 ? `${objectWords.join(' ')} ` : '';

  // Construimos y retornamos el resultado
  return `${objectPart} ${pastVerb}`;
}

// ----------------------------------------------------------------------


function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function setValueByPath(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }
  });
}

function deleteValueByPath(obj, path) {
  const keys = path.split('.');
  const recur = (current, subKeys) => {
    if (!current) return;
    if (subKeys.length === 1) {
      if (Array.isArray(current)) {
        current.forEach(item => delete item[subKeys[0]]);
      } else {
        delete current[subKeys[0]];
      }
    } else if (Array.isArray(current)) {
      current.forEach(item => recur(item, subKeys));
    } else {
      recur(current[subKeys[0]], subKeys.slice(1));
    }
  };
  recur(obj, keys);
}

function groupFields(fields) {
  return fields.reduce((acc, field) => {
    const parts = field.split('.');
    const top = parts[0];
    const rest = parts.slice(1).join('.');
    if (!acc[top]) acc[top] = [];
    if (rest) acc[top].push(rest);
    else acc[top].push(null);
    return acc;
  }, {});
}

function recursiveFilter(obj, includeGroup) {
  const result = {};
  Object.keys(includeGroup).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const subFields = includeGroup[key];
      if (subFields.every(field => field === null)) {
        result[key] = obj[key];
      } else {
        const filteredSubFields = subFields.filter(f => f !== null);
        if (Array.isArray(obj[key])) {
          result[key] = obj[key].map(item =>
            filterManagedData({ data: item }, filteredSubFields, [])
          );
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = filterManagedData({ data: obj[key] }, filteredSubFields, []);
        }
      }
    }
  });
  return result;
}

function removeEmptyArrays(obj) {
  if (Array.isArray(obj)) {
    const filtered = obj
      .map(item => removeEmptyArrays(item))
      .filter(item => !(Array.isArray(item) && item.length === 0));
    return filtered;
  }
  if (obj && typeof obj === 'object') {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      const value = removeEmptyArrays(obj[key]);
      if (!(Array.isArray(value) && value.length === 0)) {
        newObj[key] = value;
      }
    });
    return newObj;
  }
  return obj;
}

function removeParentsWithoutAttachments(obj) {
  if (Array.isArray(obj)) {
    return obj
      .map(item => removeParentsWithoutAttachments(item))
      .filter(item => {
        if (item && typeof item === 'object') {
          if (Object.prototype.hasOwnProperty.call(item, "project_default_task")) {
            if (item.project_task_attachments?.length > 0) {
              return true;
            }
            return false;
          }
        }
        return true;
      });
  }
  if (obj && typeof obj === 'object') {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      newObj[key] = removeParentsWithoutAttachments(obj[key]);
    });
    return newObj;
  }
  return obj;
}

export function filterManagedData(managedData, includeFields = [], excludeFields = []) {
  if (!managedData || !managedData.data) return {};
  const { data } = managedData;
  let filtered;
  if (includeFields.length > 0) {
    const groups = groupFields(includeFields);
    filtered = recursiveFilter(data, groups);
  } else if (excludeFields.length > 0) {
    filtered = JSON.parse(JSON.stringify(data));
    excludeFields.forEach((field) => {
      if (field.includes('.')) {
        deleteValueByPath(filtered, field);
      } else {
        delete filtered[field];
      }
    });
  } else {
    filtered = JSON.parse(JSON.stringify(data));
  }
  filtered = removeEmptyArrays(filtered);
  // filtered = removeParentsWithoutAttachments(filtered);
  return filtered;
}

export function removeKeysBySubstring(obj, filters = ['id']) {
  
  if (Array.isArray(obj)) {
    return obj.map(item => removeKeysBySubstring(item, filters));
  }
  const newObj = {};
  if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const keyLower = key.toLowerCase();
      if (keyLower === 'id' && !Number.isNaN(Number(value))) {
        newObj[key] = value;
      }
      else if (!filters.some(filter => keyLower.includes(filter))) {
        newObj[key] = removeKeysBySubstring(value, filters);
      }
    });
    return newObj;
  }
  return obj;
}

