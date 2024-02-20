/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
enum HttpStatusCode {
  Ok = 200,
  Created = 201,

  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Confict = 409,
  TooManyRequests = 429,

  InternalServerError = 500,
}

export default HttpStatusCode;
