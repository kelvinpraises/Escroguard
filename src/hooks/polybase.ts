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
  contractAddress: string;
  adminAddress: string;
  members: string[];
  chatsId: string[];
  tokensId: string[];
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
const chatReference = db.collection("Chat");

const usePolybase = () => {
  const [loggedIn, setLogin] = useState(false);

  const [auth, setAuth] = useState<Auth>();

  useEffect(() => {
    setAuth(new Auth());
  }, []);

  useEffect(() => {
    if (!auth) return;
    db.signer(async (data) => {
      console.log(data);
      return {
        h: "eth-personal-sign",
        sig: await auth.ethPersonalSign(data),
      };
    });

    auth?.onAuthUpdate((authState) => {
      if (authState) {
        setLogin(true);
      } else {
        setLogin(false);
      }
    });
  }, [auth]);

  /* USER */

  const login = async () => {
    if (!auth) return;
    return auth.signIn({ force: true });

    // if (!res?.userId) {
    //   auth.signOut();
    // } else {
    // await userReference.create([
    //   res?.userId, // id
    //   "", // name
    //   res?.email || "", // email
    //   "", // avatarUrl
    //   Date.now(), // createdAt
    // ]);
    // setUserId(res?.userId);
    // }
  };

  const logout = async () => {
    auth && auth.signOut();
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
    contractAddress,
    adminAddress,
    members,
    userId,
  }: {
    name: string;
    contractAddress: string;
    adminAddress: string;
    members: string[];
    userId: string;
  }) => {
    const randomId = stringToHexAddress(generateQuickGuid() + "-" + Date.now());
    await spaceReference
      .create([
        randomId, // id
        name, // name
        contractAddress, // contractAddress
        adminAddress, // adminAddress
        members,
        Date.now(), // createdAt
      ])
      .then(() => {
        userReference.record(userId).call("joinSpace", [randomId, Date.now()]);
      });

    return randomId;
  };

  const getSpaceRecord = async (spaceId: string) => {
    return (await spaceReference.record(spaceId).get()).data as Space;
  };

  const updateSpace = async (spaceId: string, space: Partial<Space>) => {
    await spaceReference.record(spaceId).call("updateSpaceInfo", [
      space.name || "", // name
      space.members || [], // participants
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
        spaceReference
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
