import { StyleSheet, Text, View } from 'react-native';

export function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600' },
});
