import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import Data from "../../../lib/data";
import jwt from "jsonwebtoken";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {


    //* 값을 받았는지 확인
    const { body } = req;
    console.log("body : ", body);

    const { email, firstname, lastname, password, birthday } = body;
    if (!email || !firstname || !lastname || !password || !birthday) {
      res.statusCode = 400;
      return res.send("필수 데이터가 없습니다.");
    }

    console.log("email : ", email);

    const usersExit = Data.user.exist({ email });
    if (usersExit) {
      res.statusCode = 409;
      res.send("이미 가입된 메일입니다.");
    }
    console.log("usersExit : ", usersExit);
    const hashedPassword = bcrypt.hashSync(password, 8);

    console.log("hashedPassword : ", hashedPassword);


    const users = Data.user.getList();
    let userId;
    if (users.length === 0) {
      userId = 1;
    } else {
      userId = users[users.length - 1].id + 1;
    }

    const newUser: StoredUserType = {
      id: userId,
      email,
      firstname,
      lastname,
      password: hashedPassword,
      birthday,
      profileImages: "/static/image/default_user_profile_image.jpg",
    };

    const token = jwt.sign(String(newUser.id), "my_private_secret");
    res.setHeader(
      "Set-Cookie",
      `access_token=${token}; path=/; expires=${new Date(
        Date.now() + 60 * 60 * 24 * 1000 * 3 //3일
      )}; httponly`
    );

    const newUserWithoutPassword: Partial<Pick<StoredUserType, "password">> = newUser;

    delete newUserWithoutPassword.password;
    res.statusCode = 200;

    console.log("newUser : ", newUser);
    return res.send(newUser);

  }
  res.statusCode = 405;

  return res.end();
};