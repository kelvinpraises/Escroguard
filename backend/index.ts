import express from "express";
import Session from "express-session";
import { generateNonce, SiweErrorType, SiweMessage } from "siwe";
var cors = require("cors");

import generateQuickGuid from "@/utils/generateQuickGuid";
import stringToHexAddress from "@/utils/stringToHexAddress";
import db from "./db";

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3001" }));
app.use(express.json());
app.use(
  Session({
    name: "sentiment-drips",
    secret: "sentiment-drips-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: true },
  })
);

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*           SIWE Authentication and Verification           */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

app.get("/nonce", async function (req, res) {
  req.session.nonce = generateNonce();
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(req.session.nonce);
});

app.post("/verify", async function (req, res) {
  try {
    if (!req.body.message) {
      res
        .status(422)
        .json({ message: "Expected prepareMessage object as body." });
      return;
    }

    let SIWEObject = new SiweMessage(req.body.message);
    const { data: message } = await SIWEObject.verify({
      signature: req.body.signature,
      nonce: req.session.nonce,
    });

    req.session.siwe = message;
    req.session.cookie.expires = new Date(message.expirationTime!);
    req.session.save(() => {
      const query = "SELECT * FROM Users WHERE id = ?";
      const params = [req.session.siwe?.address];

      db.all(query, params, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        res.json(
          rows[0] || {
            name: "",
            id: req.session.siwe?.address,
            avatarUrl: "",
          }
        );
      });
    });
  } catch (e) {
    req.session.siwe = undefined;
    req.session.nonce = undefined;
    console.error(e);
    switch (e) {
      case SiweErrorType.EXPIRED_MESSAGE: {
        const error = e as unknown as Error;
        req.session.save(() =>
          res.status(440).json({ message: error.message })
        );
        break;
      }
      case SiweErrorType.INVALID_SIGNATURE: {
        const error = e as unknown as Error;
        req.session.save(() =>
          res.status(422).json({ message: error.message })
        );
        break;
      }
      default: {
        const error = e as unknown as Error;
        req.session.save(() =>
          res.status(500).json({ message: error.message })
        );
        break;
      }
    }
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((e) => {
    const error = e as unknown as Error;
    console.log(error);
  });
  res.setHeader("Content-Type", "text/plain");
  res.send(`You have been logged out`);
});

app.get("/verifyAuthentication", function (req, res) {
  if (!req.session.siwe) {
    res.json({
      authenticated: false,
    });
    return;
  }
  const query = "SELECT * FROM Users WHERE id = ?";
  const params = [req.session.siwe?.address];

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(
      { ...(rows[0] as Object), authenticated: true } || {
        name: "",
        id: req.session.siwe?.address,
        avatarUrl: "",
        authenticated: true,
      }
    );
  });
});

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                       User Section                       */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

// Create a new user.
app.post("/users", async (req, res) => {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to sign in first" });
    return;
  }

  const { name, email, avatarUrl } = req.body;

  const insertQuery = `
    INSERT INTO Users (id, name, email, avatarUrl, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const timestamp = Date.now();
  const userId = req.session.siwe.address;

  db.run(
    insertQuery,
    [userId, name, email, avatarUrl, timestamp, timestamp],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: "User created successfully",
        userId,
      });
    }
  );
});

// Get existing user.
app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const selectQuery = `
    SELECT * FROM Users WHERE id = ?
  `;

  db.get(selectQuery, [userId], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  });
});

// Update existing user.
app.put("/users/:userId", async (req, res) => {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to sign in first" });
    return;
  }

  const { userId } = req.params;
  const { name, email, avatarUrl } = req.body;

  const updateQuery = `
    UPDATE Users
    SET name = ?, email = ?, avatarUrl = ?, updatedAt = ?
    WHERE id = ?
  `;

  const timestamp = Date.now();

  db.run(
    updateQuery,
    [name, email, avatarUrl, timestamp, userId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ message: "User updated successfully" });
    }
  );
});

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                       Space Section                      */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

// Create a new space.
app.post("/spaces", async (req, res) => {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to sign in first" });
    return;
  }

  const { name, contractAddress, adminAddress } = req.body;

  const insertQuery = `
    INSERT INTO Spaces (id, name, contractAddress, adminAddress, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const timestamp = Date.now();
  const spaceId = stringToHexAddress(generateQuickGuid() + "-" + timestamp);

  db.run(
    insertQuery,
    [spaceId, name, contractAddress, adminAddress, timestamp, timestamp],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: "Space created successfully",
        spaceId,
      });
    }
  );
});

// Get existing space.
app.get("/spaces/:spaceId", async (req, res) => {
  const { spaceId } = req.params;

  const selectQuery = `
    SELECT * FROM Spaces WHERE id = ?
  `;

  db.get(selectQuery, [spaceId], (err, space) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!space) {
      res.status(404).json({ message: "Space not found" });
      return;
    }

    res.json(space);
  });
});

// Update existing space.
app.put("/spaces/:spaceId", async (req, res) => {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to sign in first" });
    return;
  }

  const { spaceId } = req.params;
  const { name, adminAddress } = req.body;

  const updateQuery = `
    UPDATE Spaces
    SET name = COALESCE(?, name), adminAddress = COALESCE(?, adminAddress), updatedAt = ?
    WHERE id = ?
  `;

  const timestamp = Date.now();

  db.run(updateQuery, [name, adminAddress, timestamp, spaceId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ message: "Space not found" });
      return;
    }

    res.json({ message: "Space updated successfully" });
  });
});

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                   User Spaces Section                    */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

// Add user to a space.
app.post("/user-spaces", async (req, res) => {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to sign in first" });
    return;
  }

  const { userId, spaceId } = req.body;

  const insertQuery = `
    INSERT INTO UserSpaces (userId, spaceId)
    VALUES (?, ?)
  `;

  db.run(insertQuery, [userId, spaceId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: "User added to space successfully",
    });
  });
});

// Get spaces for a user.
app.get("/user-spaces/:userId", async (req, res) => {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to sign in first" });
    return;
  }

  const { userId } = req.params;

  if (userId !== req.session.siwe.address) {
    res.status(403).json({ message: "You don't own this account" });
    return;
  }

  const selectQuery = `
    SELECT Spaces.*
    FROM Spaces
    INNER JOIN UserSpaces ON Spaces.id = UserSpaces.spaceId
    WHERE UserSpaces.userId = ?
  `;

  db.all(selectQuery, [userId], (err, spaces) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(spaces);
  });
});

// Remove user from a space.
app.delete("/user-spaces/:userId/:spaceId", async (req, res) => {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to sign in first" });
    return;
  }

  const { userId, spaceId } = req.params;

  if (userId !== req.session.siwe.address) {
    res.status(403).json({ message: "You don't own this account" });
    return;
  }

  const deleteQuery = `
    DELETE FROM UserSpaces
    WHERE userId = ? AND spaceId = ?
  `;

  db.run(deleteQuery, [userId, spaceId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ message: "User or space not found" });
      return;
    }

    res.json({ message: "User removed from space successfully" });
  });
});

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                   Space Tokens Section                   */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

// Add token to a space.
app.post("/space-tokens", async (req, res) => {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to sign in first" });
    return;
  }

  const { spaceId, tokenId } = req.body;

  const insertQuery = `
    INSERT INTO SpaceTokens (spaceId, tokenId)
    VALUES (?, ?)
  `;

  db.run(insertQuery, [spaceId, tokenId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: "Token added to space successfully",
    });
  });
});

// Get tokens for a space.
app.get("/space-tokens/:spaceId", async (req, res) => {
  const { spaceId } = req.params;

  const selectQuery = `
    SELECT tokenId
    FROM SpaceTokens
    WHERE spaceId = ?
  `;

  db.all(selectQuery, [spaceId], (err, tokens) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(tokens);
  });
});

// Remove token from a space.
app.delete("/space-tokens/:spaceId/:tokenId", async (req, res) => {
  if (!req.session.siwe) {
    res.status(401).json({ message: "You have to sign in first" });
    return;
  }

  const { spaceId, tokenId } = req.params;

  const deleteQuery = `
    DELETE FROM SpaceTokens
    WHERE spaceId = ? AND tokenId = ?
  `;

  db.run(deleteQuery, [spaceId, tokenId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ message: "Space or token not found" });
      return;
    }

    res.json({ message: "Token removed from space successfully" });
  });
});

module.exports = app;

declare module "express-session" {
  interface SessionData {
    nonce: string;
    siwe: SiweMessage;
  }
}
