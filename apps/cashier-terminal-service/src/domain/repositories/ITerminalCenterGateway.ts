export interface CenterTerminal {
  tid: string;
  mid: string;
  sid: string;
}

export interface ITerminalCenterGateway {
  /**
   * Returns the terminal of `tid` from pos-center, null if the terminal is not found or not of the merchant
   */
  findByTid(tid: string): Promise<CenterTerminal | null>;
}
