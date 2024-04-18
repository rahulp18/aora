import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const useAppWrite = fn => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fn();
      setData(res);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();
  return { data, isLoading, refetch };
};

export default useAppWrite;
