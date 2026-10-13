import { StyleSheet, View } from 'react-native';

export type TabIconName = 'order' | 'home' | 'search' | 'account';

type Props = {
  name: TabIconName;
  color: string;
  size?: number;
};

/**
 * Dependency-free tab icons drawn with plain Views.
 * Swap for an icon font/SVG set once one is added to the project.
 */
export function TabIcon({ name, color, size = 24 }: Props) {
  const s = size / 24;

  if (name === 'order') {
    return (
      <View style={[styles.box, { width: size, height: size }]}>
        {/* receipt */}
        <View
          style={{
            width: 16 * s,
            height: 20 * s,
            borderRadius: 2 * s,
            borderWidth: 2 * s,
            borderColor: color,
            position: 'absolute',
            top: 2 * s,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2.5 * s,
          }}
        >
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                width: 8 * s,
                height: 2 * s,
                borderRadius: 1 * s,
                backgroundColor: color,
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  if (name === 'home') {
    return (
      <View style={[styles.box, { width: size, height: size }]}>
        {/* roof */}
        <View
          style={{
            width: 14 * s,
            height: 14 * s,
            borderLeftWidth: 2 * s,
            borderTopWidth: 2 * s,
            borderColor: color,
            transform: [{ rotate: '45deg' }],
            position: 'absolute',
            top: 4 * s,
          }}
        />
        {/* body */}
        <View
          style={{
            width: 14 * s,
            height: 10 * s,
            borderWidth: 2 * s,
            borderTopWidth: 0,
            borderColor: color,
            position: 'absolute',
            bottom: 2 * s,
          }}
        />
      </View>
    );
  }

  if (name === 'search') {
    return (
      <View style={[styles.box, { width: size, height: size }]}>
        <View
          style={{
            width: 14 * s,
            height: 14 * s,
            borderRadius: 7 * s,
            borderWidth: 2 * s,
            borderColor: color,
            position: 'absolute',
            top: 3 * s,
            left: 3 * s,
          }}
        />
        <View
          style={{
            width: 7 * s,
            height: 2 * s,
            borderRadius: 1 * s,
            backgroundColor: color,
            position: 'absolute',
            right: 2 * s,
            bottom: 5 * s,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    );
  }

  // account
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <View
        style={{
          width: 9 * s,
          height: 9 * s,
          borderRadius: 4.5 * s,
          borderWidth: 2 * s,
          borderColor: color,
          position: 'absolute',
          top: 2 * s,
        }}
      />
      <View
        style={{
          width: 16 * s,
          height: 8 * s,
          borderTopLeftRadius: 8 * s,
          borderTopRightRadius: 8 * s,
          borderWidth: 2 * s,
          borderBottomWidth: 0,
          borderColor: color,
          position: 'absolute',
          bottom: 2 * s,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
