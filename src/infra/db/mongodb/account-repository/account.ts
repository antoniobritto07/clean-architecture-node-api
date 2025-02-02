import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository"
import { AddAccountModel } from "../../../../domain/usecases/add-account"
import { AccountModel } from "../../../../domain/models/account"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts")
    const result = await accountCollection.insertOne(accountData)
    const idAccountInserted = result.insertedId
    const account = {
      id: idAccountInserted.toString(),
      ...accountData,
    }
    return account
  }
}
