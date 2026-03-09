import WebView from 'react-native-webview';
import { StyleSheet } from 'react-native';

type Props = {
  source: { html: string } | { uri: string };
};

export default function PdfViewer({ source }: Props) {
  return (
    <WebView
      source={source}
      style={styles.webview}
      showsVerticalScrollIndicator={false}
      originWhitelist={['*']}
    />
  );
}

const styles = StyleSheet.create({
  webview: { flex: 1 },
});
