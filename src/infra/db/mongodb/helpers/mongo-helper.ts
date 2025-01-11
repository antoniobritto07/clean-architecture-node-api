import { MongoClient, Collection } from "mongodb"

export const MongoHelper = {
  client: null as MongoClient,

  async connect(env): Promise<void> {
    this.client = await MongoClient.connect(env)
  },

  async disconnect(): Promise<void> {
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },
}
