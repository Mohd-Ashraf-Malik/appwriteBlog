import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";

export class AuthService {
    client = new Client();
    account;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl) // Your API Endpoint
        .setProject(conf.appwriteProjectId);  
        this.account = new Account(this.client);
    }
    async createAccount({email,password,name}){
        try{
            const userAccount = await this.account.create(ID.unique(),email,password,name);
            if(userAccount){
                // call another method
                return this.login({email,password});
            }
            else{
                return userAccount;
            }
        } catch(error){
            throw error
        }
    }

    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            console.log("Appwrite service :: login :: error::",error)
            throw error;
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get()
        } catch (error) {
            // throw error
            console.log("Appwrite service :: getCurrent :: error::",error) //alternate of above
        }
        return null;
    }

    async logout(){
        try {
            await this.account.deleteSessions() // jiss bhi browser se login kiya hain sab udh jaye
        } catch (error) {
            console.log("Appwrite service :: logout :: error::",error) 
        }
    }
}

const authService = new AuthService();

export default authService