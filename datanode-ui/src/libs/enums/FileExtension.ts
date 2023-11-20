// approved
export enum FileExtension {
  TXT = 'txt',
  JSON = 'json',
  JS = 'js',
  R = 'r',
  RPROFILE = 'rProfile',
  SQL = 'sql',
  HTML = 'html',
  PACKRAT = 'packrat',

  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  PPT = 'ppt',
  PPTX = 'pptx',

  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
  JAR = 'jar',
  CSV = 'csv',

  ZIP = 'zip',
  RAR = 'rar',
  GZ = 'gz',
  RBUILDIGNORE = 'r',
  GITIGNORE = 'txt',
  RDATA = 'r',
  RPROJ = 'r',
  MD = 'txt',
  LOCK = 'json',
  RD = 'r',
  DCF = 'txt',

  UNKNOWN = 'unknown',
}

export type IFileExtensionKey = keyof typeof FileExtension;
