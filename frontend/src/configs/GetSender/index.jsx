import React from "react";

export async function getSender(loggedUser, users) {
  console.log(loggedUser);
  console.log(users);
  return users[0].id === loggedUser.id ? users[1].name : users[0].name;
}
