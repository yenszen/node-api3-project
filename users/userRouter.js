const express = require("express");
const userDb = require("./userDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  // do your magic!
  res.status(201).json(req.user);
});

router.post("/:id/posts", (req, res) => {
  // do your magic!
});

router.get("/", (req, res) => {
  // do your magic!
  userDb
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Unable to retrieve users data from database." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  userDb
    .getUserPosts(req.user.id)
    .then(userPosts => {
      res.status(200).json(userPosts);
    })
    .catch(err => console.log(err));
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  userDb
    .remove(req.user.id)
    .then(record => {
      res.status(200).json({ message: "The user has been removed" });
    })
    .catch(err => console.log(err));
});

router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
  userDb
    .update(req.user.id, req.body)
    .then(record => {
      res.status(200).json(record);
    })
    .catch(err => console.log(err));
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;

  userDb
    .getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Database error", err });
    });
}

function validateUser(req, res, next) {
  // do your magic!
  const isEmpty = obj => {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  };

  isEmpty(req.body)
    ? res.status(400).json({ message: "missing user data" })
    : userDb
        .insert(req.body)
        .then(resource => {
          if (!resource.name) {
            // this testing condition does not work, why??
            res.status(400).json({ message: "missing required name field" });
          } else {
            req.user = resource;
            next();
          }
        })
        .catch(err => {
          console.log(req.body);
          res.status(500).json({ message: "Database error", err });
        });
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
