import {getPdfTools} from "./getPdfTools";

export async function RosterRow({
  name,
  start,
  end,
}: {
  name: string;
  start: string;
  end: string;
}) {
  // Lazy load pdf tools
  const {Text, View, styles} = await getPdfTools();
  return (
    <View style={styles.tableRow}>
      <View style={styles.tableRosterCol}>
        <Text style={styles.headerCell}>{name}</Text>
      </View>

      <View style={styles.tableRosterCol}>
        <Text style={styles.headerCell}>{start}</Text>
      </View>

      <View style={styles.tableRosterCol}>
        <Text style={styles.headerCell}>{end}</Text>
      </View>
    </View>
  );
}
