import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

// Define more types here
const FORMAT_PDF = ['pdf', 'PDF'];
const FORMAT_TEXT = ['txt', 'text', 'md', 'markdown', 'log', 'TXT', 'TEXT', 'MD', 'MARKDOWN', 'LOG'];
const FORMAT_PHOTOSHOP = ['psd', 'PSD'];
const FORMAT_WORD = ['doc', 'docx', 'dot', 'dotx', 'DOC', 'DOCX', 'DOT', 'DOTX', 'docm', 'dotm', 'pages', 'PAGES'];
const FORMAT_EXCEL = ['xls', 'xlsx', 'xlsm', 'XLS', 'XLSX', 'XLSM', 'csv', 'CSV'];
const FORMAT_ZIP = ['zip', 'rar', 'iso', 'tar', 'gz', '7z', 'ZIP', 'RAR', 'ISO', 'TAR', 'GZ', '7Z'];
const FORMAT_ILLUSTRATOR = ['ai', 'esp', 'ait', 'AI', 'ESP', 'AIT'];
const FORMAT_POWERPOINT = ['ppt', 'pptx', 'pptm', 'PPT', 'PPTX', 'PPTM', 'ppsx', 'pps', 'potx', 'potm', 'pot', 'PPSX', 'PPS', 'POTX', 'POTM'];
const FORMAT_AUDIO = ['wav', 'aif', 'mp3', 'aac', 'ogg', 'flac', 'wma', 'm4a', 'WAV', 'AIF', 'MP3', 'AAC', 'OGG', 'FLAC', 'WMA', 'M4A'];
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'webp', 'JPG', 'JPEG', 'GIF', 'BMP', 'PNG', 'SVG', 'WEBP'];
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm', 'mov', 'wmv', 'flv', 'M4V', 'AVI', 'MPG', 'MP4', 'WEBM', 'MOV', 'WMV', 'FLV'];

const iconUrl = (icon) => `${CONFIG.assetsDir}/assets/icons/files/${icon}.svg`;

// ----------------------------------------------------------------------

export function fileFormat(fileUrl) {
  let format;

  const fileByUrl = fileTypeByUrl(fileUrl);

  switch (fileUrl.includes(fileByUrl)) {
    case FORMAT_TEXT.includes(fileByUrl):
      format = 'txt';
      break;
    case FORMAT_ZIP.includes(fileByUrl):
      format = 'zip';
      break;
    case FORMAT_AUDIO.includes(fileByUrl):
      format = 'audio';
      break;
    case FORMAT_IMG.includes(fileByUrl):
      format = 'image';
      break;
    case FORMAT_VIDEO.includes(fileByUrl):
      format = 'video';
      break;
    case FORMAT_WORD.includes(fileByUrl):
      format = 'word';
      break;
    case FORMAT_EXCEL.includes(fileByUrl):
      format = 'excel';
      break;
    case FORMAT_POWERPOINT.includes(fileByUrl):
      format = 'powerpoint';
      break;
    case FORMAT_PDF.includes(fileByUrl):
      format = 'pdf';
      break;
    case FORMAT_PHOTOSHOP.includes(fileByUrl):
      format = 'photoshop';
      break;
    case FORMAT_ILLUSTRATOR.includes(fileByUrl):
      format = 'illustrator';
      break;
    default:
      format = fileTypeByUrl(fileUrl);
  }

  return format;
}

// ----------------------------------------------------------------------

export function fileThumb(fileUrl) {
  let thumb;

  switch (fileFormat(fileUrl)) {
    case 'folder':
      thumb = iconUrl('ic-folder');
      break;
    case 'txt':
      thumb = iconUrl('ic-txt');
      break;
    case 'zip':
      thumb = iconUrl('ic-zip');
      break;
    case 'audio':
      thumb = iconUrl('ic-audio');
      break;
    case 'video':
      thumb = iconUrl('ic-video');
      break;
    case 'word':
      thumb = iconUrl('ic-word');
      break;
    case 'excel':
      thumb = iconUrl('ic-excel');
      break;
    case 'powerpoint':
      thumb = iconUrl('ic-power_point');
      break;
    case 'pdf':
      thumb = iconUrl('ic-pdf');
      break;
    case 'photoshop':
      thumb = iconUrl('ic-pts');
      break;
    case 'illustrator':
      thumb = iconUrl('ic-ai');
      break;
    case 'image':
      thumb = iconUrl('ic-img');
      break;
    default:
      thumb = iconUrl('ic-file');
  }
  return thumb;
}

// ----------------------------------------------------------------------

export function fileTypeByUrl(fileUrl) {
  return (fileUrl && fileUrl.split('.').pop()) || '';
}

// ----------------------------------------------------------------------

export function fileNameByUrl(fileUrl) {
  return fileUrl.split('/').pop();
}

// ----------------------------------------------------------------------

export function fileData(file) {
  // From url
  if (typeof file === 'string') {
    return {
      preview: file,
      name: fileNameByUrl(file),
      type: fileTypeByUrl(file),
      size: undefined,
      path: file,
      lastModified: undefined,
      lastModifiedDate: undefined,
    };
  }

  // From file
  return {
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
  };
}
