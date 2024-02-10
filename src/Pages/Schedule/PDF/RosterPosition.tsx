import {getPdfTools} from "./getPdfTools";

export async function RosterPosition({children}: {children: string}) {
  // Lazy load pdf tools
  const {Text, View, styles} = await getPdfTools();
  return (
    <View
      style={{
        backgroundColor: "#f0f0f0",
        borderStyle: "dashed",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
      }}>
      <Text
        style={[
          styles.headerCell,
          {
            fontSize: 8,
            textAlign: "center",
            // Bold
            fontWeight: "bold",
            // Italic
            fontStyle: "italic",
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
