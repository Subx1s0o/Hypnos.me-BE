export class StoreAdapterBase {
  constructor() {}

  async uploadOne(_file: File): Promise<any> {}

  async delete(_id: string): Promise<any> {}

  async getSecureUrl(_id: string): Promise<any> {}

  async uploadMany(_files: File[]): Promise<any> {}
}
