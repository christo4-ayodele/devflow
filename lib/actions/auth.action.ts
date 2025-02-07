"use server";

import User from "@/database/user.model";
import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { SignUpSchema } from "../validations";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Account from "@/database/account.model";
import { signIn } from "@/auth";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User already exists.");
    }

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) {
      throw new Error("Username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ username, name, email }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    setTimeout(async () => {
      await signIn("credentials", { email, password, redirect: false }); //sign was excetuing before mongo so it couldnt find the data in database
    }, 1000);

    return { success: true };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction(); // ✅ Only abort if transaction is still active
    }

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession(); // ✅ Always clean up session
  }
}
