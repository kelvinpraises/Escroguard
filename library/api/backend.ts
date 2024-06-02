import axios from "axios";
import { SIWESession } from "connectkit";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

if (!BASE_URL) {
  throw new Error("Backend address environment variable is not defined.");
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enable sending credentials
});

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                          Types                           */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Space {
  id: string;
  name: string;
  contractAddress: string;
  adminAddress: string;
  createdAt: number;
  updatedAt: number;
}

export interface SpaceToken {
  tokenId: string;
}

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                      Authentication                      */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

export const getNonce = async (): Promise<string> => {
  try {
    const response = await axiosInstance.get(`/nonce`);
    return response.data;
  } catch (error) {
    console.error("Error getting nonce:", error);
    throw error;
  }
};

export const verifyMessage = async ({
  message,
  signature,
}: {
  message: string;
  signature: string;
}): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(`/verify`, {
      message,
      signature,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying signature:", error);
    throw error;
  }
};

export const getSession = async (): Promise<SIWESession | null> => {
  try {
    const response = await axiosInstance.get(`/session`);
    return response.data;
  } catch (error) {
    console.error("Error verifying authentication:", error);
    return null;
  }
};

export const signOut = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/logout`);
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                       User Section                       */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

export const createUser = async (
  user: Omit<User, "id">
): Promise<{ userId: string }> => {
  try {
    const response = await axiosInstance.post(`/users`, user);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  user: Partial<User>
): Promise<void> => {
  try {
    await axiosInstance.put(`/users/${userId}`, user);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                      Space Section                       */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

export const createSpace = async (
  space: Omit<Space, "id" | "createdAt" | "updatedAt">
): Promise<{ spaceId: string }> => {
  try {
    const response = await axiosInstance.post(`/spaces`, space);
    return response.data;
  } catch (error) {
    console.error("Error creating space:", error);
    throw error;
  }
};

export const getSpace = async (spaceId: string): Promise<Space> => {
  try {
    const response = await axiosInstance.get(`/spaces/${spaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting space:", error);
    throw error;
  }
};

export const updateSpace = async (
  spaceId: string,
  space: Partial<Space>
): Promise<void> => {
  try {
    await axiosInstance.put(`/spaces/${spaceId}`, space);
  } catch (error) {
    console.error("Error updating space:", error);
    throw error;
  }
};

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                   User Spaces Section                    */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

export const addUserToSpace = async (
  userId: string,
  spaceId: string
): Promise<void> => {
  try {
    await axiosInstance.post(`/user-spaces`, { userId, spaceId });
  } catch (error) {
    console.error("Error adding user to space:", error);
    throw error;
  }
};

export const getUserSpaces = async (userId: string): Promise<Space[]> => {
  try {
    const response = await axiosInstance.get(`/user-spaces/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user spaces:", error);
    throw error;
  }
};

export const removeUserFromSpace = async (
  userId: string,
  spaceId: string
): Promise<void> => {
  try {
    await axiosInstance.delete(`/user-spaces/${userId}/${spaceId}`);
  } catch (error) {
    console.error("Error removing user from space:", error);
    throw error;
  }
};

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                   Space Tokens Section                   */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

export const addTokenToSpace = async (
  spaceId: string,
  tokenId: string
): Promise<void> => {
  try {
    await axiosInstance.post(`/space-tokens`, { spaceId, tokenId });
  } catch (error) {
    console.error("Error adding token to space:", error);
    throw error;
  }
};

export const getSpaceTokens = async (
  spaceId: string
): Promise<SpaceToken[]> => {
  try {
    const response = await axiosInstance.get(`/space-tokens/${spaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting space tokens:", error);
    throw error;
  }
};

export const removeTokenFromSpace = async (
  spaceId: string,
  tokenId: string
): Promise<void> => {
  try {
    await axiosInstance.delete(`/space-tokens/${spaceId}/${tokenId}`);
  } catch (error) {
    console.error("Error removing token from space:", error);
    throw error;
  }
};
