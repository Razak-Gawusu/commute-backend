import { v4 as uuidv4 } from 'uuid';

export class GenericHelpers {
  static generateUUID() {
    return uuidv4();
  }
}
