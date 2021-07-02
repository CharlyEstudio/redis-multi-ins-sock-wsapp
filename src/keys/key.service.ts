export class KeyService {
  getKey(key: string) {
    return process.env[key];
  }
}
