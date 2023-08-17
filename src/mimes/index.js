import mimetypesByExtension from './mimetypesByExtension';
import extensionsByMIMEType from './extensionsByMIMEType';

const isString = val => typeof val === 'string';
/**
 * @func getExtension
 *
 * Get file extension(s) by MIME type.
 *
 * @param  {String} mimeType
 * @return {String|Array}
 */
const getExtension = function getExtension(mimeType) {
  if (! (isString(mimeType))) {
    return '';
  }

  const extensions = extensionsByMIMEType[mimeType.toLowerCase()] || '';

  if (Array.isArray(extensions) && extensions.length === 1) {
    return extensions[0];
  }

  return extensions;
};

function parse(str){
    const ext = str.indexOf('.')>0?str.split('.').get(-1):'';
    return {ext};
}

/**
 * @func getMIMEType
 *
 * Get MIME type from a file name or a path.
 *
 * @param  {String} filenameOrPath
 * @return {String}
 */
const getMIMEType = function getMIMEType(filenameOrPath) {
  const defaultMIMEType = 'application/octet-stream';

  if (!(isString(filenameOrPath)) || filenameOrPath === '') {
    return '';
  }

  const { ext } = parse(filenameOrPath);

  if (!(isString(ext)) || ext === '') {
    return defaultMIMEType;
  }

  return mimetypesByExtension[ext.toLowerCase()] || defaultMIMEType;
};

// exports
export {
    getExtension,
    getMIMEType
};
