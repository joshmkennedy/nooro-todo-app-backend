import { PrismaClient, Task, User } from "@prisma/client";
import db from "../db";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";

export type UserDTO = {
  id: string;
  name?: string | null;
  password: string;
  email: string;
  emailVerified: Date | null;
};

export type UserWithTasks = UserDTO & { tasks: Task[] };

export type NewUserInput = Omit<UserDTO, "id">;
export type UpdateUserInput = Partial<NewUserInput>;

export class UserService {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  public async getAll(): Promise<UserDTO[]> {
    const users: User[] = await this.db.user
      .findMany({})
      .catch(
        (
          e: PrismaClientUnknownRequestError | PrismaClientKnownRequestError,
        ) => {
          console.error(e);
          throw e;
        },
      );

    return users;
  }

  public async getUser(id: string): Promise<UserDTO> {
    const user: UserDTO | null | void = await this.db.user
      .findUnique({
        where: {
          id,
        },
      })
      .catch(
        (
          e: PrismaClientUnknownRequestError | PrismaClientKnownRequestError,
        ) => {
          console.error(e);
          throw e;
        },
      );

    if (!user) {
      throw new Error("NO userS FOUND");
    }

    return user;
  }

  public async createUser(userData: NewUserInput): Promise<UserDTO | void> {
    const data: NewUserInput = {
      ...userData,
    };

    const user: UserDTO | void = await this.db.user
      .create({ data })
      .catch(
        (
          e: PrismaClientUnknownRequestError | PrismaClientKnownRequestError,
        ) => {
          console.error(e);
          throw e;
        },
      );

    return user;
  }

  public async updateUser(
    id: string,
    data: UpdateUserInput,
  ): Promise<UserDTO | void> {
    const user: UserDTO | void = await this.db.user
      .update({
        where: { id },
        data,
      })
      .catch(
        (
          e: PrismaClientUnknownRequestError | PrismaClientKnownRequestError,
        ) => {
          console.error(e);
          throw e;
        },
      );
    return user;
  }

  public async deleteUser(id: string): Promise<void> {
    await this.db.user
      .delete({ where: { id } })
      .catch(
        (
          e: PrismaClientUnknownRequestError | PrismaClientKnownRequestError,
        ) => {
          console.error(e);
          throw e;
        },
      );

    return;
  }
}
