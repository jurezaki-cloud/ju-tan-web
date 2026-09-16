import { createPersistenceBootstrap } from "./bootstrap";

const bootstrap = createPersistenceBootstrap();

export const appPersistence = bootstrap.persistence;
export const appBootstrap = bootstrap;
