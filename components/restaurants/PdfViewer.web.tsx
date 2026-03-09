import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  source: { html: string } | { uri: string };
};

export default function PdfViewer({ source }: Props) {
  const src =
    'uri' in source
      ? source.uri
      : `data:text/html;charset=utf-8,${encodeURIComponent(source.html)}`;

  return (
    <View style={styles.container}>
      {React.createElement('iframe', {
        src,
        style: { flex: 1, border: 'none', width: '100%', height: '100%' },
        title: 'PDF Menu',
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
