import accountModel from "../../models/account.model"


export const getAccountById = async (id: string) => {
    return await accountModel.findOne({_id: id}).populate('roleId');
    
}