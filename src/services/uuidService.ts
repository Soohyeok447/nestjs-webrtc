import { v4 } from "uuid";

class UUIDService {
  public generateUUID(): string {
    return v4();
  };
}

export default new UUIDService();

