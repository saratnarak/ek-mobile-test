import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

import { NoInternetDialog, noInternetDialog } from './NoInternetDialog';
import { ProgressDialog } from './ProgressDialog';

type Props = {
  /** Auto-show the No Internet dialog when the device goes offline. Default `true`. */
  watchConnectivity?: boolean;
};

/**
 * Mount once near the root of the app. Renders all global dialogs
 * so they can be opened imperatively (`progressDialog.show()`).
 */
export function DialogHost({ watchConnectivity = true }: Props) {
  useEffect(() => {
    if (!watchConnectivity) return;
    return NetInfo.addEventListener((state) => {
      if (state.isConnected === false && !noInternetDialog.isShowing) {
        noInternetDialog.show();
      }
    });
  }, [watchConnectivity]);

  return (
    <>
      <ProgressDialog />
      <NoInternetDialog />
    </>
  );
}
