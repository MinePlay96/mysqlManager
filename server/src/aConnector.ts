// TODO: add Table and Field and Schema objects

export interface IConnectionOptions {
  user?: string;
  password?: string;
  charset?: string;
  timeout?: number;
  host?: string;
  port?: number;
  socketPath?: string;
}

export abstract class AConnector {
  public abstract connect(options: IConnectionOptions): Promise<void>;

  public abstract getSchemas(): Promise<Array<ASchema>>;
}

export abstract class ASchema {
  public abstract getTables(): Promise<Array<ATable>>;
}

export abstract class ATable {
  public abstract getFields(): Promise<Array<AField>>;
}

export abstract class AField {
  
}