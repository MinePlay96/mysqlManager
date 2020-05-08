/* eslint-disable @typescript-eslint/naming-convention */
interface IBaseTableData {
  TABLE_CATALOG: string;
  TABLE_SCHEMA: string;
  TABLE_NAME: string;
}

export interface ISchemaResponse {
  CATALOG_NAME: string;
  SCHEMA_NAME: string;
  DEFAULT_CHARACTER_SET_NAME: string;
  DEFAULT_COLLATION_NAME: string;
}

export interface ITablesResponse extends IBaseTableData {
  TABLE_TYPE: string;
  ENGINE?: string;
  VERSION?: string;
  ROW_FORMAT?: string;
  TABLE_ROWS?: number;
  AVG_ROW_LENGTH?: number;
  DATA_LENGTH?: number;
  MAX_DATA_LENGTH?: number;
  INDEX_LENGTH?: number;
  DATA_FREE?: number;
  AUTO_INCREMENT?: number;
  CREATE_TIME?: string; // dateTime
  UPDATE_TIME?: string; // dateTime
  CHECK_TIME?: string; // dateTime
  TABLE_COLLATION?: string;
  CHECKSUM?: number;
  CREATE_OPTIONS?: string;
  TABLE_COMMENT: string;
}

export interface IFieldsResponse extends IBaseTableData {
  COLUMN_NAME: string;
  ORDINAL_POSITION: number;
  COLUMN_DEFAULT?: string;
  IS_NULLABLE: string; // YES / NO
  DATA_TYPE: string;
  CHARACTER_MAXIMUM_LENGTH?: number;
  CHARACTER_OCTET_LENGTH?: number;
  NUMERIC_PRECISION?: number;
  NUMERIC_SCALE?: number;
  DATETIME_PRECISION?: number;
  CHARACTER_SET_NAME?: string;
  COLLATION_NAME?: string;
  COLUMN_TYPE: string;
  COLUMN_KEY: string;
  EXTRA: string;
  PRIVILEGES: string;
  COLUMN_COMMENT: string;
  GENERATION_EXPRESSION: string;
}
