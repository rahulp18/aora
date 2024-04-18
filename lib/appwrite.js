import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from 'react-native-appwrite';

export const appWriteConfig = {
  endPoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.rahul.aora',
  projectId: '661e4803b1fe97fef767',
  databaseId: '661e495c81e358fff251',
  userCollectionId: '661e4995dc5ef4d55601',
  videoCollectionId: '661e49e8bcd6015b23c6',
  storageId: '661e5a5286491c700373',
};
// Init your react-native SDK
const client = new Client();
client
  .setEndpoint(appWriteConfig.endPoint)
  .setProject(appWriteConfig.projectId)
  .setPlatform(appWriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
export const createUser = async ({ email, username, password }) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );
    if (!newAccount) {
      return Error;
    }
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);
    const newUser = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      },
    );
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)],
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')],
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))],
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};
export const getSearchPosts = async query => {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId,
      [Query.search('title', query)],
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};
export const getUserPosts = async userId => {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId,
      [Query.equal('creator', userId)],
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    throw new Error(error);
  }
};
const getFilePreview = async (fileId, type) => {
  let fileUrl;
  if (type === 'video') {
    fileUrl = storage.getFilePreview(appWriteConfig.storageId, fileId);
  } else if (type === 'image') {
    fileUrl = storage.getFilePreview(
      appWriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100,
    );
  } else {
    throw new Error('Invalid File Type');
  }
  if (!fileUrl) {
    throw new Error();
  }
  return fileUrl;
};
export const uploadFile = async (file, type) => {
  if (!file) return;
  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appWriteConfig.storageId,
      ID.unique(),
      asset,
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};
export const createVideo = async form => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ]);
    const newPost = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      },
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

// Handle Like Dislike Video
export const likeDislikeVideo = async (userId, videoId) => {
  try {
    // First get the video
    const existingVideo = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId,
      videoId,
    );
    console.log({ existingVideo });
    if (existingVideo) {
      if (!existingVideo.likes) {
        existingVideo.likes = [];
      }
    }
    const userIdIndex = existingVideo.likes.indexOf(userId);
    if (userIdIndex === -1) {
      // User hasn't liked the video yet, add the like
      existingVideo.likes.push(userId);
    } else {
      // User has already liked the video, remove the like
      existingVideo.likes.splice(userIdIndex, 1);
    }
    const updatedVideo = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.videoCollectionId,
      videoId,
      {
        likes: existingVideo.likes,
      },
    );
    return updatedVideo;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLikedVideos = async userId => {
  try {
    // 1. Fetch User Document
    const userDoc = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      userId,
    );

    return userDoc.videos;
  } catch (error) {
    console.error('Error fetching liked videos:', error);
    // Handle error appropriately
    return []; // Or handle error differently based on your needs
  }
};
