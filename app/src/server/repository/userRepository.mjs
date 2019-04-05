import query from "./query";
import User from "../../model/User";

export const getUserByUsername = async username => {
  const data = await query(
    "select id, username, access_level as accessLevel from user where username = ?",
    [username]
  );
  return data[0] ? new User().deserialize(data[0]) : null;
};

export const getUserById = async id => {
  const data = await query(
    "select id, username, access_level as accessLevel from user where id = ?",
    [id]
  );
  return data[0] ? new User().deserialize(data[0]) : null;
};

export const checkPassword = async (username, password) => {
  const data = await query(
    "select * from user where username = ? and password = PASSWORD( ? )",
    [username, password + "molecular-pulsar"]
  );
  return Boolean(data);
};

export const insertUser = async (username, password) => {
  console.log("INSERTING USER");
  const data = await query(
    "insert into user (username, password) values (?, PASSWORD( ? ))",
    [username, password + "molecular-pulsar"]
  );
  console.log("response");
  console.log(data);
  return Boolean(data);
};
