import { ValidationError, UniqueConstraintError } from "sequelize";
import { userModel } from "../../db/model/user.model.js";

export const CreateUser = async (data) => {
  const { name, email, password, role } = data;

  const user = userModel.build({ name, email, password, role });

  try {
    await user.validate();

    const existingUser = await userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exists.", {
        cause: 409,
      });
    }

    await user.save();
    return user;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new Error("Email already exists.", {
        cause: 409,
      });
    }

    if (err instanceof ValidationError) {
      err.cause = 400;
    }

    throw err;
  }
};



export const CreateOrUpdateUser = async (id, data) => {
  const userId = Number(id);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID.", { cause: 400 });
  }

  const currentUser = await userModel.findByPk(userId);

  const values = {
    id: userId,
    name: data.name ?? currentUser?.name,
    email: data.email ?? currentUser?.email,
    password: data.password ?? currentUser?.password,
    age: data.age ?? currentUser?.age,
    role: data.role ?? currentUser?.role ?? "user",
  };

  if (values.name == null || values.email == null || values.password == null) {
    throw new Error("Name, email and password are required.", {
      cause: 400,
    });
  }

  const emailOwner = await userModel.findOne({
    where: { email: values.email },
  });

  if (emailOwner && emailOwner.id !== userId) {
    throw new Error("Email already exists.", { cause: 409 });
  }

  return userModel.upsert(values, {
    validate: false,
  });
};



export const FindUserByEmail = async (email) => {
  if (typeof email !== "string" || email.trim() === "") {
    throw new Error("Email is required.", { cause: 400 });
  }

  return userModel.findOne({
    where: { email },
    attributes: ["id", "name", "email", "role", "createdAt", "updatedAt"],
  });
};



export const FindUserById = async (id) => {
  const userId = Number(id);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID.", { cause: 400 });
  }

  return userModel.findByPk(userId, {
    attributes: {
      exclude: ["role", "password", "age"],
    },
  });
};

