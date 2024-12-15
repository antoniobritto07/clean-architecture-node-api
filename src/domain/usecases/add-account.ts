import { AccountModel } from "../models/account"

//this AddAccountModel can be defined into this file itself because this interface is tied to the addAccount method,
//whereas AccountModel is more generic, meaning a general business rule interface. So in this case it should be defined
//under the domain/models folder
export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel>
}
