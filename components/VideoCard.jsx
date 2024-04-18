import { useState } from 'react';
import { ResizeMode, Video } from 'expo-av';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';

import { icons } from '../constants';
import { likeDislikeVideo } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';

const VideoCard = ({ title, creator, avatar, thumbnail, video, videoId }) => {
  const { user } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [isLike, setIsLike] = useState(false);

  const handleLike = async () => {
    try {
      await likeDislikeVideo(user.$id, videoId);
      setIsLike(!isLike);
      Alert.alert('Success', `Video ${!isLike ? 'Likes' : 'Dislike'}`);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error);
    }
  };
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLike} className="pt-2">
          <Image
            source={isLike ? icons.heartFill : icons.heart}
            className={`${isLike ? 'w-8 h-8' : 'w-6 h-6'}`}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-[33px] mt-3  "
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={status => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
