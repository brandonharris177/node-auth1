const bcrypt = require('bcryptjs')

const router = require('express').Router();

const Users = require('../users/users-model');

router.post('/register', (req, res) => {
    const userInfo = req.body;

    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS)

    userInfo.password = hash
    
    Users.add(userInfo)
    .then(user => {
        res.json(user)
    })
})

router.post('/login', (req, res) => {
   const {username, password} = req.body;

   Users.findBy({username})
   .then(([user]) => {
     if (user && bcrypt.compareSync(password, user.password)) {
       res.status(200).json(user)
     } else {
       res.status(401).json({ message: "invalid credentials" })
     }
   })
   .catch(error => {
     res.status(500).json(error)
   })
})

router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
