-- Table for users
CREATE TABLE Users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatarUrl TEXT,
  createdAt INTEGER,
  updatedAt INTEGER
);

-- Table for spaces
CREATE TABLE Spaces (
  id TEXT PRIMARY KEY,
  name TEXT,
  contractAddress TEXT,
  adminAddress TEXT,
  updatedAt INTEGER,
  createdAt INTEGER
);

-- Table for user-space relationships
CREATE TABLE UserSpaces (
  userId TEXT,
  spaceId TEXT,
  PRIMARY KEY (userId, spaceId),
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (spaceId) REFERENCES Spaces(id)
);

-- Table for space-token relationships
CREATE TABLE SpaceTokens (
  spaceId TEXT,
  tokenId TEXT,
  PRIMARY KEY (spaceId, tokenId),
  FOREIGN KEY (spaceId) REFERENCES Spaces(id)
);