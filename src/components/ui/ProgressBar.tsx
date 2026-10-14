import { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '@/design';

type Props = {
  color?: string;
  /** `dot` = three bouncing dots (default), `circle` = spinner. */
  type?: 'dot' | 'circle';
  size?: number;
};

/** Loading indicator — mirrors Flutter `ProgressBar`. */
export function ProgressBar({ color, type = 'dot', size }: Props) {
  return (
    <View style={styles.center}>
      {type === 'circle' ? (
        <ActivityIndicator size={size ?? 'large'} color={color ?? colors.primary} />
      ) : (
        <ThreeDotLoader color={color ?? colors.primary} size={size ?? 40} />
      )}
    </View>
  );
}

function ThreeDotLoader({ color, size }: { color: string; size: number }) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const dot = size * 0.15;

  return (
    <View style={[styles.row, { width: size, height: size * 0.25 }]}>
      {[0, 1, 2].map((i) => {
        // Each dot grows then shrinks in its own staggered window (like Flutter `Interval`).
        const start = i * 0.2;
        const scale = progress.interpolate({
          inputRange: [start, start + 0.2, start + 0.4],
          outputRange: [1, 1.5, 1],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={i}
            style={{
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: color,
              opacity: 0.5,
              transform: [{ scale }],
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
});
