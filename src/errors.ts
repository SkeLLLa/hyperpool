export enum EHyperpoolErrorCodes {
  Unknown,
  InvalidConfiguration,
  NoAgentsAvailable,
}

export interface IHyperpoolErrorArgs {
  message?: string;
  code?: EHyperpoolErrorCodes;
  cause?: Error;
}

export class HyperpoolError extends Error {
  public readonly code: EHyperpoolErrorCodes;
  public override readonly cause?: Error | undefined;
  constructor({ code = EHyperpoolErrorCodes.Unknown, message, cause }: IHyperpoolErrorArgs) {
    super(message);
    this.code = code;
    this.cause = cause;
  }
}
