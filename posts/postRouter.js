const express = require("express");
const postDb = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  // do your magic!
  postDb
    .get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving posts" });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  // do your magic!
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  // do your magic!
  postDb
    .remove(req.post.id)
    .then(post => {
      res.status(200).json({ message: "post has been removed" });
    })
    .catch(err => console.log(err));
});

router.put("/:id", validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.post;
  const changes = req.body;

  postDb
    .update(id, changes)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res
        .status(400)
        .json({
          message: "Please include text/ make sure only text is supplied"
        });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params;

  postDb
    .getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(400).json({ message: "invalid post id" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
}

module.exports = router;
