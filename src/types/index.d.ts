// types/express/index.d.ts

import { IFile, IUser } from "../app/interfaces/file";

declare global {
  namespace Express {
    interface Request {
      file?: IFile;
      user?: IUser
    }
  }
}

export {};