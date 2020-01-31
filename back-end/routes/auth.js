// note: this allows any user to join a game, so no actual authentication
var express = require('express');
var router = express.Router();
const chatkit = require('./chatkit');

router.post('/', (req, res) => {
  const userId = requ.query.user_id;

    const newUser = {
        id: userId,
        name: userId
      };
    await chatkit.createUser(newUser);
    const authData = chatkit.authenticate({userId});
    res.status(authData.status).send(authData.body);

//   chatkit
//     .createUser({
//       id: userId,
//       name: userId
//     })
//     .catch(() => {})
//     .then(() => {
//       const authData = chatkit.authenticate({
//         userId
//       });

//       res.status(authData.status).send(authData.body);
//     });
});

module.exports = router;
