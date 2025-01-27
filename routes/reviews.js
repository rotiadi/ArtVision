const express = require("express");
const dataBase = require("../libraries/dataBase");
const { checkConection } = require("../middlewares/db");

const router = express.Router();

router.post("/add", checkConection, async (req, res) => {
  const { artistId, rating, title, body } = req.body;
  let errors = [];

  if (!artistId || artistId.length == 0) {
    errors.push({
      field: "artistId",
      message: "artistId is invalid",
    });
  }

  if (!rating || rating.length == 0) {
    errors.push({
      field: "rating",
      message: "rating is invalid",
    });
  }

  if (!title || title.length == 0) {
    errors.push({
      field: "title",
      message: "title is invalid",
    });
  }

  if (!body || body.length == 0) {
    errors.push({
      field: "body",
      message: "body is invalid",
    });
  }

  if (errors.length > 0) {
    res.status(401);
    res.send({
      Status: "Invalid inputs",
      message: errors,
    });
  } else {
    const records = await dataBase
      .query(
        "insert into reviews (id_artist, id_user, rating, title, body, date) values ($1, $2, $3, $4, $5, $6)",
        [
          artistId,
          req.id_user,
          rating,
          title,
          body,
          new Date().toLocaleDateString(),
        ]
      )
      .catch((err) => {
        res.status(500);
        res.send({
          Status: "error writting to DB",
          message: err,
        });
      });

    if (records) {
      res.status(200);
      res.send({
        Status: "Success",
        message: `The reviews  has been added!`,
      });
    }
  }
});

router.post("/getByArtist", checkConection, async (req, res) => {
  const { artistId } = req.body;
  let errors = [];

  if (!artistId || artistId.length == 0) {
    errors.push({
      field: "artistId",
      message: "artistId is invalid",
    });
  }
  if (errors.length > 0) {
    res.status(401);
    res.send({
      Status: "Invalid inputs",
      message: errors,
    });
  } else {
    const records = await dataBase
      .query("select * from reviews where id_artist = $1", [artistId])
      .catch((err) => {
        res.status(500);
        res.send({
          Status: "error writting to DB",
          message: err.detail,
        });
      });

    if (records) {
      res.status(200).json(records.rows);
    }
  }
});

module.exports = router;
