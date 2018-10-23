// @flow

import type {
  DocumentPath,
  DotNotationString,
} from 'mongolike-operations'

/**
 * @public
 * Parse DocumentPath into an array of property names.
 */
export function parseDocumentPath(docPath: DocumentPath): Array<string | number> {
  return docPath.split(/(?<!\\)[.[]/).map(
    attribute => attribute.charAt(attribute.length - 1) === ']' ? parseInt(attribute.slice(0, -1)) : unescapePathDelimiter(attribute)
  )
}

/**
 * Create DocumentPath from arguments.
 */
export function createDocumentPath(...attributes: Array<string | number>): DocumentPath {
  const joined = attributes.reduce((docPath, attr) =>
    typeof attr === 'string' ? `${docPath}.${escapePathDelimiter(attr)}` : `${docPath}[${attr.toString()}]`, '')
  return (joined.charAt(0) === '.') ? joined.slice(1) : joined
}

/**
 *
 */
export function convertToDotNotationString(docPath: DocumentPath): DotNotationString {
  return docPath.replace(/\[(\d{1,})\]/g, '.$1')
}

function escapePathDelimiter(attr: string | number): string | number {
  return typeof attr === 'number' ? attr : attr.replace(/\./g, '\\.')
}

function unescapePathDelimiter(attr: string | number): string | number {
  return typeof attr === 'number' ? attr : attr.replace(/\\\./, '.')
}
