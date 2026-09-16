import type { User } from "@/src/domain/user";
import { appPersistence } from "@/src/persistence/app";
import type { RepositoryAdapter } from "@/src/types/persistence";

export class UserRepository {
  constructor(private readonly records: RepositoryAdapter<User> = appPersistence.repositories.users) {}

  list(): User[] {
    return this.records.list();
  }

  getById(id: string): User | undefined {
    return this.records.getById(id);
  }
}

export const userRepository = new UserRepository();
