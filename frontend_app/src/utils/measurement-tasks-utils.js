export const getMeasurementStatus = (marks) => {
    const numberOfChecked = marks?.filter(mark => mark.second_check).length || 0;
    return numberOfChecked === marks?.length ? 'finished' :
        numberOfChecked > 0 ? 'in progress' : 'not started';
}


export function generateMeasurementProperties(element, propertiesJson) {

    let config = '';
    if (propertiesJson?.Config?.length > 0 || propertiesJson?.config?.length > 0) {
        config = propertiesJson?.Config || propertiesJson?.config;
    }
    else if (propertiesJson?.Size?.length > 0 || propertiesJson?.size?.length > 0) {
        const array = propertiesJson?.Size?.split(' ') || propertiesJson?.size?.split(' ');
        config = array[array.length - 1];
    }
    if (!isValidConfig(config)) {
        config = '';
    }

    const sku = propertiesJson?.SKU || propertiesJson?.sku;
    let type = '';
    if (element?.name?.toLowerCase().includes('mullion')) {
        type = 'MULL';
    }
    else {
        type = sku?.split(' ')[0] || element?.description.split(' ')[0];
        if (/\b(?:MG|SGD)\b/i.test(type)) {
            const regex = /\n/;
            if (type?.match(regex)) {
                type = type.split(regex)[0];
            }
            if (type?.toLowerCase().indexOf('hr') > -1) {
                const hrRegex = /hr/i;
                if (type.match(hrRegex)) {
                    type = type.split(hrRegex)[0].trim();
                }
            }
        }
        else {
            const allDescription = element?.description || '';
            const regex = /(?:^|\W)MG[- ]?(\d+)(?=\D|$)/gi;
            const match = allDescription.match(regex);
            type = match ? match[0] : type;
        }
    }

    type = extractKey(type) || type;

    if (type && (
        !type.toLowerCase().includes('mg') && 
        !type.toLowerCase().includes('sgd') && 
        !type.toLowerCase().includes('mull') &&
        !type.toLowerCase().includes('glass')
    )) {
        type = getFirstLetters(element?.name);
    }

    return {
        config,
        sku,
        type: type.toUpperCase(),
    };

}

function extractKey(str) {
  const directo = str.match(/\b(?:MG|SGD)(\d+)\b/i);
  if (directo && directo.length) {
    return directo[0].toUpperCase();
  }
  const regex = /\b(MG|SGD)[^A-Za-z0-9]*(\d+)\b/gi;
  const matches = [];
  let m = regex.exec(str);

  while (m !== null) {
    matches.push(m[1].toUpperCase() + m[2]);
    m = regex.exec(str);
  }

  return matches.length ? matches[0] : null;
}

function getFirstLetters(str) {
  const coincidencias = str.match(/\b\w/g);
  if (!coincidencias) return '';
  return coincidencias.join('').toUpperCase();
}

function isValidConfig(str) {
  return /^[XOLR]+$/i.test(str);
}