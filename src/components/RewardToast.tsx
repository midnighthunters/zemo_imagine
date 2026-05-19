import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export function RewardToast({ reward }: { reward?: string }) {
  if (!reward) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.toast}>
      <Text style={styles.title}>Sticker unlocked</Text>
      <Text style={styles.reward}>{reward}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 74,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(17,24,39,0.86)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  title: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  reward: {
    color: colors.text,
    marginTop: 2,
    fontSize: 14,
    fontWeight: '800',
  },
});
