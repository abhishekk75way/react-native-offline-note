import { createMMKV } from 'react-native-mmkv';

const storageMMKV = createMMKV({
  id: 'app-storage',
});

export default storageMMKV; 