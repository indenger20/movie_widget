import { IBrowserProvider } from 'index';
import { v4 as uuid } from 'uuid';

export type IProviderConfig = { id: string } & IBrowserProvider;

export class ProviderConfig {
  configs: { [key: string]: IProviderConfig } = {};
  constructor() {}
  add(config: IBrowserProvider) {
    const newConfig = { ...config, id: uuid() };
    return (this.configs[newConfig.id] = newConfig);
  }
  get(id: string) {
    return this.configs[id];
  }
}
