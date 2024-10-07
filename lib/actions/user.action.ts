"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUserById(params: any){
    try {
        connectToDatabase();

        const { userId } = params;

        const user = await User.findOne({ clerkId: userId });

        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}