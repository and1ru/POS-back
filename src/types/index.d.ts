import type { Payload } from "./jwt.payload";

declare global {
  namespace Express {
    interface Request {
      user?: Payload;
    }
  }
}

export {};