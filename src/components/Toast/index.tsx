import React from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, {
  BaseToastProps,
  BaseToast,
  ToastConfig,
} from 'react-native-toast-message';


import styles from './styles';

const CustomToast = ({ style, ...toastProps }: BaseToastProps) => (
  <BaseToast
    style={[styles.container, style]}
    contentContainerStyle={styles.contentContainer}
    text1Style={styles.text1}
    text2Style={styles.text2}
    text1NumberOfLines={4}
    text2NumberOfLines={4}
    {...toastProps}
  />
);

const CustomSuccessToast = (props: BaseToastProps) => {

  return <CustomToast {...props} style={{ borderLeftColor: 'green' }} />;
};

const CustomErrorToast = (props: BaseToastProps) => {

  return <CustomToast {...props} style={{ borderLeftColor: 'red' }} />;
};
const CustomInfoToast = (props: BaseToastProps) => {

  return <CustomToast {...props} style={{ borderLeftColor: 'yellow' }} />;
};
const toastConfig: ToastConfig = {
  success: props => <CustomSuccessToast {...props} />,
  error: props => <CustomErrorToast {...props} />,
  Info: props => <CustomInfoToast {...props} />,
};

export function AppToast() {
  const { top } = useSafeAreaInsets();
  const topOffset = Math.max(top, 20);

  return <Toast config={toastConfig} topOffset={topOffset} />;
}

export default Toast;
