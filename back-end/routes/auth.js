// note: this allows any user to join a game, so no actual authentication
var express = require('express');
var router = express.Router();
const chatkit = require('./chatkit');

router.post('/', (req, res) => {
  const userId = req.query.user_id;

  // const newUser = {
  //     id: userId,
  //     name: userId
  //   };
  // await chatkit.createUser(newUser);
  // const authData = chatkit.authenticate({userId});
  // res.status(authData.status).send(authData.body);

  router.post('/', (req, res) => {
    const userId = req.query.user_id;

    chatkit
      .createUser({
        id: userId,
        name: userId
      })
      .catch(() => {
        console.log('fail');
        res.status(501).send(authData.body);
      })
      .then(() => {
        const authData = chatkit.authenticate({
          userId: userId
        });
        console.log('success');

        res.status(authData.status).send(authData.body);
      });
  });
});

module.exports = router;
