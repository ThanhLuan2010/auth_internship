import { Elysia } from "elysia";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const app = new Elysia();

//  đăng nhập
app.post("/login", ({ body }) => {
  const userName = body.userName;
  const user = { name: userName };
  // Tạo token và refresh token
  const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: "15m" }); // 15 phút
  const refreshToken = jwt.sign(user, REFRESH_SECRET_KEY);
  return {
    accessToken,
    refreshToken,
  };
});

// refreshToken
app.post("/refreshToken", ({ body }) => {
  const refreshToken = body?.token;
  if (!refreshToken) {
    return {
      status: false,
      message: "Token is require",
    };
  } else {
    let response = {};
    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
      // trong đây em không biết sao mà return không được nên em gán cho biết response
      if (user) {
        const accessToken = jwt.sign({ name: userName }, SECRET_KEY, {
          expiresIn: "15m",
        });
        response = {
          message: "success",
          data: {
            token: accessToken,
          },
          status: true,
        };
      }
      if (err) {
        response = {
          message: "token invalid",
          data: null,
          status: false,
        };
      }
    });
    return response;
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
