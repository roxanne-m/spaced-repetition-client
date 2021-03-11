import jwt from 'jsonwebtoken';

export function makeLoginToken() {
  const loginUser = {
    user_id: 123,
    name: 'Test name of user',
    // user_id: 1,
    // name: 'Dunder Mifflin Admin',
  };
  return jwt.sign(loginUser, 'test-secret', {
    // return jwt.sign(loginUser, 'spaced-repetition-jwt-secret', {
    subject: 'test-username',
    // subject: 'admin',
    expiresIn: '2m',
    algorithm: 'HS256',
  });
}
