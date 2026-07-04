import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export interface ImageViewerHeaderProps {
  onClose: () => void;
}

export function ImageViewerHeader({ onClose }: ImageViewerHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 18 }]} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.btn}
        onPress={onClose}
        activeOpacity={0.85}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      >
        <MaterialIcons name="close" size={22} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
});
