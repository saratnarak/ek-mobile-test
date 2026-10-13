import { useSyncExternalStore } from 'react';

/**
 * Imperative show/dismiss controller — like Flutter `showDialog` + `ModalUtilsMixin`.
 * Lets you call `progressDialog.show()` from anywhere (no context needed);
 * the matching component inside `<DialogHost />` renders it.
 */
export type ModalController = {
  /** Shows the modal. Resolves when it is dismissed. */
  show: () => Promise<void>;
  dismiss: () => void;
  readonly isShowing: boolean;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => boolean;
};

export function createModalController(): ModalController {
  let visible = false;
  let resolvers: (() => void)[] = [];
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  return {
    show() {
      if (!visible) {
        visible = true;
        emit();
      }
      return new Promise<void>((resolve) => resolvers.push(resolve));
    },
    dismiss() {
      if (!visible) return;
      visible = false;
      emit();
      const pending = resolvers;
      resolvers = [];
      pending.forEach((r) => r());
    },
    get isShowing() {
      return visible;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => visible,
  };
}

/** Subscribes a component to a controller's visibility. */
export function useModalVisible(controller: ModalController) {
  return useSyncExternalStore(controller.subscribe, controller.getSnapshot);
}
