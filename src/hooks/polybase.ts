import generateQuickGuid from "@/utils/generateQuickGuid";
import stringToHexAddress from "@/utils/stringToHexAddress";
import { Auth } from "@polybase/auth";
import { Polybase } from "@polybase/client";
import { useEffect, useMemo, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  spacesId: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Space {
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
}

export interface Chat {
  id: string;
  message: string;
  userId: string;
  spaceId: string;
  createdAt: number;
  updatedAt: number;
}

const db = new Polybase({
  defaultNamespace: "", // TODO: add namespace
});

export type PolybaseType = ReturnType<typeof usePolybase>;

const userReference = db.collection("User");
const spaceReference = db.collection("Space");
const meetingReference = db.collection("Meeting");
const chatReference = db.collection("Chat");

const usePolybase = () => {
  const [loggedIn, setLogin] = useState(false);

  const [auth, setAuth] = useState<any>();

  useEffect(() => {
    setAuth(new Auth());
  }, []);

  db.signer(async (data) => {
    console.log(data);
    return {
      h: "eth-personal-sign",
      sig: await auth.ethPersonalSign(data),
    };
  });

  /* USER */

  useMemo(() => {
    auth?.onAuthUpdate((authState: { userId: any }) => {
      if (authState) {
        setLogin(true);
        // setUserId(authState.userId);
      } else {
        setLogin(false);
        // setUserId(null);
      }
    });
  }, [auth]);

  const login = async () => {
    if (!auth) return;
    const res = await auth.signIn({ force: true });

    if (!res?.userId) {
      auth.signOut();
    } else {
      // await userReference.create([
      //   res?.userId, // id
      //   "", // name
      //   res?.email || "", // email
      //   "", // avatarUrl
      //   Date.now(), // createdAt
      // ]);
      // setUserId(res?.userId);
    }
  };

  const logout = async () => {
    auth.signOut();
  };

  const getUserRecord = async (userId: string) => {
    return (await userReference.record(userId).get()).data as User;
  };

  const updateUser = async (userId: string, user: Partial<User>) => {
    await userReference.record(userId).call("updateUserInfo", [
      user.name || "", // name
      user.email || "", // email
      user.avatarUrl || "", // avatarUrl
      Date.now(), // updatedAt
    ]);
  };

  const addSpaceToUser = async (userId: string, spaceId: string) => {
    await userReference.record(userId).call("joinSpace", [spaceId, Date.now()]);
  };

  const removeSpaceFromUser = async (userId: string, spaceId: string) => {
    await userReference
      .record(userId)
      .call("leaveSpace", [spaceId, Date.now()]);
  };

  /* SPACE */

  const createSpace = async ({
    name,
    emoji,
    description,
    adminAddress,
    participants,
    userId,
  }: Space & { userId: string }) => {
    if (!userId) return;
    const randomId = stringToHexAddress(generateQuickGuid() + "-" + Date.now());
    await spaceReference
      .create([
        randomId, // id
        name, // name
        emoji, // emoji
        description, // description
        adminAddress, // adminAddress
        participants, // participants
        Date.now(), // createdAt
      ])
      .then(() => {
        userReference.record(userId).call("joinSpace", [randomId, Date.now()]);
      });
  };

  const getSpaceRecord = async (spaceId: string) => {
    return (await spaceReference.record(spaceId).get()).data as Space;
  };

  const updateSpace = async (spaceId: string, space: Partial<Space>) => {
    await spaceReference.record(spaceId).call("updateSpaceInfo", [
      space.name || "", // name
      space.emoji || "", // emoji
      space.description || "", // description
      space.participants || [], // participants
      Date.now(), // updatedAt
    ]);
  };

  const updateSpaceContractAddress = async (
    spaceId: string,
    contractAddress: string
  ) => {
    await spaceReference
      .record(spaceId)
      .call("updateContractAddress", [contractAddress, Date.now()]);
  };

  const updateSpacePushChannelAddress = async (
    spaceId: string,
    pushChannelAddress: string
  ) => {
    await spaceReference
      .record(spaceId)
      .call("updatePushChannelAddress", [pushChannelAddress, Date.now()]);
  };

  /* CHAT */

  const createChat = async ({
    meetingId,
    message,
    userId,
    spaceId,
  }: { meetingId: string } & Chat) => {
    const randomId = generateQuickGuid() + "-" + Date.now();
    await chatReference
      .create([
        randomId, // id
        message, // message
        userId, // userId
        spaceId, // spaceId
        Date.now(), // createdAt
      ])
      .then(() => {
        meetingReference
          .record(meetingId)
          .call("setChatId", [randomId, Date.now()]);
      });
  };

  const getChatRecord = async (chatId: string) => {
    return (await chatReference.record(chatId).get()).data as Chat;
  };

  return {
    // user
    login,
    logout,
    loggedIn,
    getUserRecord,
    updateUser,
    addSpaceToUser,
    removeSpaceFromUser,

    // space
    createSpace,
    getSpaceRecord,
    updateSpace,
    updateSpaceContractAddress,
    updateSpacePushChannelAddress,

    // chat
    createChat,
    getChatRecord,
  };
};

export default usePolybase;
