```ts
  @public
  collection User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    spacesId: string[];
    publicKey: PublicKey;
    createdAt: number;
    updatedAt: number;

    constructor(id: string, name: string, email: string, avatarUrl: string, createdAt: number) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.avatarUrl = avatarUrl;
      this.spacesId = [];
      this.publicKey = ctx.publicKey;
      this.createdAt = createdAt;
      this.updatedAt = createdAt;
    }

    updateUserInfo(name: string, email: string, avatarUrl: string, updatedAt: number) {
      if (ctx.publicKey !== this.publicKey) {
        error('You are not the owner of this record.');
      }
      this.name = name;
      this.email = email;
      this.avatarUrl = avatarUrl;
      this.updatedAt = updatedAt;
    }

    joinSpace(spaceId: string, updatedAt: number) {
      if (ctx.publicKey !== this.publicKey) {
        error('You are not the owner of this record.');
      }
      this.spacesId.push(spaceId);
      this.updatedAt = updatedAt;
    }

    leaveSpace(spaceId: string, updatedAt: number) {
      if (ctx.publicKey !== this.publicKey) {
        error('You are not the owner of this record.');
      }
      const index = this.spacesId.indexOf(spaceId);
      if (index !== -1) {
        this.spacesId.splice(index, 1);
      }
      this.updatedAt = updatedAt;
    }
  }

  @public
  collection Space {
    id: string;
    name: string;
    contractAddress: string;
    adminAddress: string;
    members: string[];
    chatsId: string[];
    tokensId: string[];
    updatedAt: number;
    createdAt: number;

    constructor (id: string, name: string, contractAddress: string, adminAddress: string, members: string[], createdAt: number) {
      this.id = id;
      this.name = name;
      this.contractAddress = contractAddress;
      this.adminAddress = adminAddress;
      this.members = members;
      this.chatsId = [];
      this.tokensId = [];
      this.updatedAt = createdAt;
      this.createdAt = createdAt;
    }

    renameSpace (name: string, updatedAt: number) {
      this.name = name;
      this.updatedAt = updatedAt;
    }

    addChatId(id: string, updatedAt: number) {
      this.chatsId.push(id);
      this.updatedAt = updatedAt;
    }

    addTokenId(id: string, updatedAt: number) {
      this.tokensId.push(id);
      this.updatedAt = updatedAt;
    }

    addMember(member: string, updatedAt: number) {
      this.members = [...new Set([...this.members, member])];
      this.updatedAt = updatedAt;
    }
  }

  @public
  collection Chat {
    id: string;
    message: string;
    userId: string;
    spaceId: string;
    publicKey: PublicKey;
    createdAt: number;
    updatedAt: number;

    constructor(id: string, message: string, userId: string, spaceId: string, createdAt: number) {
      this.id = id;
      this.message = message;
      this.userId = userId;
      this.spaceId = spaceId;
      this.publicKey = ctx.publicKey;
      this.createdAt = createdAt;
      this.updatedAt = createdAt;
    }

    editChat(message: string, updatedAt: number) {
      if (ctx.publicKey !== this.publicKey) {
        error('You are not the owner of this record.');
      }
      this.message = message;
      this.updatedAt = updatedAt;
    }
  }

  @public
  collection Token {
    id: string;
    symbol: string;
    contractAddress: string;
    spaceId: string;
    createdAt: number;

    constructor(id: string, symbol: string, contractAddress: string, spaceId: string, createdAt: number) {
      this.id = id;
      this.symbol = symbol;
      this.contractAddress = contractAddress;
      this.spaceId = spaceId;
      this.createdAt = createdAt;
    }
  }
```
