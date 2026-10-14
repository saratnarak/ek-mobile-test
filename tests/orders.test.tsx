import { OrdersScreen } from '@/features/orders';
import en from '@/i18n/en.json';
import km from '@/i18n/km.json';

declare const require: (module: string) => any;
declare const __dirname: string;

const fs = require('fs');
const path = require('path');

const mockEn = require('../src/i18n/en.json');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const parts = key.split('.');
      let val: any = mockEn;
      for (const part of parts) {
        val = val?.[part];
      }
      return val ?? key;
    },
  }),
}));

function findText(node: any): string[] {
  if (!node) return [];
  if (typeof node === 'string') return [node];
  if (typeof node === 'number') return [String(node)];
  if (Array.isArray(node)) return node.flatMap(findText);
  if (node.props?.children) return findText(node.props.children);
  return [];
}

function findByProps(node: any, predicate: (props: any) => boolean): any {
  if (!node) return null;
  if (node.props && predicate(node.props)) return node;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findByProps(item, predicate);
      if (found) return found;
    }
  }
  if (node.props?.children) {
    return findByProps(node.props.children, predicate);
  }
  return null;
}

describe('OrdersScreen empty state', () => {
  const rootDir = path.resolve(__dirname, '..');
  const ordersScreenPath = path.join(rootDir, 'src/features/orders/OrdersScreen.tsx');

  it('AC-1: shows the title "No orders yet", a message, and one action button through translations', () => {
    expect(en.orders.emptyTitle).toBe('No orders yet');
    expect(en.orders.emptyMessage).toBe('Scan a table QR to start ordering.');
    expect(en.orders.scanTableQr).toBe('Scan a table QR');

    expect(km.orders.emptyTitle).toBeDefined();
    expect(km.orders.emptyMessage).toBeDefined();
    expect(km.orders.scanTableQr).toBeDefined();

    const ordersScreenContent = fs.readFileSync(ordersScreenPath, 'utf-8');
    expect(ordersScreenContent).not.toContain("'No orders yet'");
    expect(ordersScreenContent).not.toContain('"No orders yet"');

    const tree = OrdersScreen({});
    const texts = findText(tree);

    expect(texts).toContain(en.orders.emptyTitle);
    expect(texts.some((t: string) => t.includes(en.orders.emptyMessage))).toBe(true);

    const button = findByProps(tree, (p: any) => p.accessibilityRole === 'button');
    expect(button).toBeDefined();
    expect(button.props.accessibilityLabel).toBe(en.orders.scanTableQr);
  });

  it('AC-2: uses StatusScreen when it exists in src/components/ui/ and does not add a duplicate empty-state component', () => {
    const statusScreenExists = fs.existsSync(path.join(rootDir, 'src/components/ui/StatusScreen.tsx'));
    const ordersScreenContent = fs.readFileSync(ordersScreenPath, 'utf-8');

    if (statusScreenExists) {
      expect(ordersScreenContent).toContain('StatusScreen');
    } else {
      const ordersFiles = fs.readdirSync(path.join(rootDir, 'src/features/orders'));
      const uiFiles = fs.existsSync(path.join(rootDir, 'src/components/ui'))
        ? fs.readdirSync(path.join(rootDir, 'src/components/ui'))
        : [];

      const duplicateComponents = [...ordersFiles, ...uiFiles].filter(
        (f: string) => /Empty.*\.tsx$/.test(f) || /Status.*\.tsx$/.test(f)
      );
      expect(duplicateComponents).toEqual([]);
    }
  });

  it('AC-3: does not use hard-coded colors or font sizes', () => {
    const content = fs.readFileSync(ordersScreenPath, 'utf-8');

    const hexColorMatches = content.match(/#[0-9a-fA-F]{3,8}/g);
    expect(hexColorMatches).toBeNull();

    const rgbMatches = content.match(/rgba?\([^)]+\)/g);
    expect(rgbMatches).toBeNull();

    const fontSizeMatches = content.match(/fontSize:\s*\d+/g);
    expect(fontSizeMatches).toBeNull();
  });

  it('AC-4: render test: the title and the action are shown; pressing the action calls its handler', () => {
    // 1. Title and action are shown
    const tree = OrdersScreen({});
    const texts = findText(tree);
    expect(texts).toContain(en.orders.emptyTitle);
    const button = findByProps(tree, (p: any) => p.accessibilityRole === 'button');
    expect(button).toBeDefined();

    // 2. Pressing action calls onActionPress handler
    const onActionPress = jest.fn();
    const treeAction = OrdersScreen({ onActionPress });
    const buttonAction = findByProps(treeAction, (p: any) => p.accessibilityRole === 'button');
    buttonAction.props.onPress();
    expect(onActionPress).toHaveBeenCalledTimes(1);

    // 3. Pressing action calls onScanQr handler
    const onScanQr = jest.fn();
    const treeQr = OrdersScreen({ onScanQr });
    const buttonQr = findByProps(treeQr, (p: any) => p.accessibilityRole === 'button');
    buttonQr.props.onPress();
    expect(onScanQr).toHaveBeenCalledTimes(1);

    // 4. Default no-op callback executes without crashing
    const treeDefault = OrdersScreen();
    const buttonDefault = findByProps(treeDefault, (p: any) => p.accessibilityRole === 'button');
    expect(() => buttonDefault.props.onPress()).not.toThrow();
  });
});
