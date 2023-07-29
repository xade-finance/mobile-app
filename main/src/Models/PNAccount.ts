export class PNAccount {
  phoneEmail: string;
  name: string;
  publicAddress: string;
  scw: string;
  uiud: string;
  constructor(
    phoneEmail: string,
    name: string,
    publicAddress: string,
    scw: string,
    uiud: string,
  ) {
    this.phoneEmail = phoneEmail;
    this.name = name;
    this.publicAddress = publicAddress;
    this.scw = scw;
    this.uiud = uiud;
  }

  static parseFrom(params: string): PNAccount {
    return JSON.parse(params) as PNAccount;
  }
}
