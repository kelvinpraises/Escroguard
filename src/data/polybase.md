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
    emoji: string;
    description: string;
    contractAddress: string;
    adminAddress: string;
    pushChannelAddress: string;
    participants: string[];
    meetingsId: string[];
    recordingsId: string[];
    assetsId: string[];
    guidesId: string[];
    eventsId: string[];
    updatedAt: number;
    createdAt: number;

    constructor (id: string, name: string, emoji: string, description: string, adminAddress: string, pushChannelAddress: string, participants: string[], createdAt: number) {
      this.id = id;
      this.name = name;
      this.emoji = emoji;
      this.description = description;
      this.contractAddress = "0x0000000000000000000000000000000000000000";
      this.adminAddress = adminAddress;
      this.pushChannelAddress = pushChannelAddress;
      this.participants = participants;
      this.meetingsId = [];
      this.recordingsId = [];
      this.assetsId = [];
      this.guidesId = [];
      this.eventsId = [];
      this.updatedAt = createdAt;
      this.createdAt = createdAt;
    }

    updateSpaceInfo (name: string, emoji: string, description: string, participants: string[], updatedAt: number) {
      this.name = name;
      this.emoji = emoji;
      this.description = description;
      this.participants = participants;
      this.updatedAt = updatedAt;
    }

    updateContractAddress (contractAddress: string, updatedAt: number) {
      this.contractAddress = contractAddress;
      this.updatedAt = updatedAt;
    }

    updatePushChannelAddress (pushChannelAddress: string, updatedAt: number) {
      this.pushChannelAddress = pushChannelAddress;
      this.updatedAt = updatedAt;
    }

    addMeetingId (id: string, updatedAt: number) {
      this.meetingsId.push(id);
      this.updatedAt = updatedAt;
    }

    addRecordingId (id: string, updatedAt: number) {
      this.recordingsId.push(id);
      this.updatedAt = updatedAt;
    }

    addAssetId (id: string, updatedAt: number) {
      this.assetsId.push(id);
      this.updatedAt = updatedAt;
    }

    addGuideId (id: string, updatedAt: number) {
      this.guidesId.push(id);
      this.updatedAt = updatedAt;
    }

    addEventId (id: string, updatedAt: number) {
      this.eventsId.push(id);
      this.updatedAt = updatedAt;
    }
  }

  @public
  collection Meeting {
    id: string;
    roomId: string;
    name: string;
    emoji: string;
    spaceId: string;
    recorded: boolean;
    consensus: boolean;
    participants: string[];
    chatsId: string[];
    updatedAt: number;
    createdAt: number;

    constructor(id: string, roomId: string, name: string, emoji: string, spaceId: string, recorded: boolean, consensus: boolean, participants: string[], createdAt: number) {
      this.id = id;
      this.roomId = roomId;
      this.name = name;
      this.emoji = emoji;
      this.spaceId = spaceId;
      this.recorded = recorded;
      this.consensus = consensus;
      this.participants = participants;
      this.chatsId = [];
      this.updatedAt = createdAt;
      this.createdAt = createdAt;
    }

    updateMeeting(name: string, emoji: string, updatedAt: number) {
      this.name = name;
      this.emoji = emoji;
      this.updatedAt = updatedAt;
    }

    setChatId(id: string, updatedAt: number) {
      this.chatsId.push(id);
      this.updatedAt = updatedAt;
    }

    setParticipant(participant: string, updatedAt: number) {
      this.participants = [...new Set([...this.participants, participant])];
      this.updatedAt = updatedAt;
    }
  }

  @public
  collection Recording {
    id: string;
    name: string;
    type: string;
    url: string;
    spaceId: string;
    meetingId: string;
    updatedAt: number;
    createdAt: number;

    constructor(id: string, name: string, type: string, url: string, spaceId: string, meetingId: string, createdAt: number) {
      this.id = id;
      this.name = name;
      this.type = type;
      this.url = url;
      this.spaceId = spaceId;
      this.meetingId = meetingId;
      this.updatedAt = createdAt;
      this.createdAt = createdAt;
    }
  }

  @public
  collection Asset {
    id: string;
    name: string;
    type: string;
    url: string;
    spaceId: string;
    updatedAt: number;
    createdAt: number;

    constructor(id: string, name: string, type: string, url: string, spaceId: string, createdAt: number) {
      this.id = id;
      this.name = name;
      this.type = type;
      this.url = url;
      this.spaceId = spaceId;
      this.updatedAt = createdAt;
      this.createdAt = createdAt;
    }
  }

  @public
  collection Chat {
    id: string;
    message: string;
    userId: string;
    spaceId: string;
    createdAt: number;
    updatedAt: number;

    constructor(id: string, message: string, userId: string, spaceId: string, createdAt: number) {
      this.id = id;
      this.message = message;
      this.userId = userId;
      this.spaceId = spaceId;
      this.createdAt = createdAt;
      this.updatedAt = createdAt;
    }
  }

  @public
  collection Guide {
    id: string;
    name: string;
    content: string;
    spaceId: string;
    updatedAt: number;
    createdAt: number;

    constructor(id: string, name: string, content: string, spaceId: string, createdAt: number) {
      this.id = id;
      this.name = name;
      this.content = content;
      this.spaceId = spaceId;
      this.updatedAt = createdAt;
      this.createdAt = createdAt;
    }

    updateGuideInfo(name: string, content: string, updatedAt: number) {
      this.name = name;
      this.content = content;
      this.updatedAt = updatedAt;
    }
  }

  @public
  collection Event {
    id: string;
    date: string;
    time: string;
    topic: string;
    description: string;
    spaceId: string;
    updatedAt: number;
    createdAt: number;

    constructor(id: string, date: string, time: string, topic: string, description: string, spaceId: string, createdAt: number) {
      this.id = id;
      this.date = date;
      this.time = time;
      this.topic = topic;
      this.description = description;
      this.spaceId = spaceId;
      this.updatedAt = createdAt;
      this.createdAt = createdAt;
    }

    updateEventInfo(date: string, time: string, topic: string, description: string, updatedAt: number) {
      this.date = date;
      this.time = time;
      this.topic = topic;
      this.description = description;
      this.updatedAt = updatedAt;
    }
  }
```
