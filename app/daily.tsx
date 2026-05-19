import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { ImagineButton } from '../src/components/ImagineButton';
import { categoryById } from '../src/data/categories';
import { rewardCatalog } from '../src/data/rewards';
import { getScrollItemsForCategory } from '../src/data/scrollItems';
import { useImagineStore } from '../src/store/useImagineStore';
import { colors } from '../src/theme/colors';

export default function DailyScreen() {
  const activeCategoryId = useImagineStore((state) => state.activeCategoryId);
  const earnedRewards = useImagineStore((state) => state.earnedRewards);
  const category = categoryById.get(activeCategoryId);
  const dailyItems = getScrollItemsForCategory(activeCategoryId).slice(0, 5);
  const reward = rewardCatalog[earnedRewards.length % rewardCatalog.length];

  return (
    <LinearGradient colors={['#080D1C', '#172554', '#4C1D95']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>Daily Imagine Drop</Text>
        <Text style={styles.title}>Five futures for today</Text>
        <Text style={styles.quote}>“Your future gets clearer when you give it beautiful details.”</Text>

        <View style={styles.reward}>
          <Text style={styles.rewardKicker}>Sticker placeholder</Text>
          <Text style={styles.rewardTitle}>{reward}</Text>
          <Text style={styles.rewardText}>Open the feed and save one future to add a collectible to your cabinet.</Text>
        </View>

        <Text style={styles.sectionTitle}>{category?.emoji} {category?.title ?? 'Recommended'} futures</Text>
        {dailyItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text numberOfLines={4} style={styles.cardText}>{item.text}</Text>
          </View>
        ))}

        <View style={styles.action}>
          <Text style={styles.actionTitle}>Mini action</Text>
          <Text style={styles.actionText}>Write one sentence that starts with: “The future I want today feels like…”</Text>
        </View>

        <ImagineButton label="Open feed" onPress={() => router.replace('/feed')} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingTop: 62, paddingHorizontal: 20, paddingBottom: 42 },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.text, marginTop: 8, fontSize: 36, lineHeight: 41, fontWeight: '900' },
  quote: { color: 'rgba(255,255,255,0.78)', marginTop: 16, fontSize: 19, lineHeight: 28, fontWeight: '700' },
  reward: { marginTop: 24, borderRadius: 22, padding: 20, backgroundColor: 'rgba(248,199,126,0.14)', borderWidth: 1, borderColor: 'rgba(248,199,126,0.35)' },
  rewardKicker: { color: colors.primary, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  rewardTitle: { color: colors.text, marginTop: 8, fontSize: 24, fontWeight: '900' },
  rewardText: { color: colors.mutedText, marginTop: 8, fontSize: 15, lineHeight: 22 },
  sectionTitle: { color: colors.text, marginTop: 28, marginBottom: 12, fontSize: 22, fontWeight: '900' },
  card: { borderRadius: 18, padding: 16, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.line, marginBottom: 12 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  cardText: { color: colors.mutedText, marginTop: 8, fontSize: 14, lineHeight: 21 },
  action: { marginVertical: 18, borderRadius: 18, padding: 16, backgroundColor: 'rgba(103,232,249,0.12)', borderWidth: 1, borderColor: 'rgba(103,232,249,0.28)' },
  actionTitle: { color: colors.cyan, fontSize: 16, fontWeight: '900' },
  actionText: { color: colors.text, marginTop: 8, fontSize: 15, lineHeight: 22 },
});
