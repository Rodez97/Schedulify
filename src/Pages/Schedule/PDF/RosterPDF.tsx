import groupBy from "lodash/groupBy";
import upperFirst from "lodash/upperFirst";
import type dayjs from "dayjs";
import {type RosterData} from "../RosterView";
import {Colors} from "../../../utils/Colors";
import {getShiftDayjsDate} from "../../../types/helpers";
import {getPdfTools} from "./getPdfTools";
import {RosterRow} from "./RosterRow";
import {RosterPosition} from "./RosterPosition";
import logoWithText from "../../../assets/images/logo-with-text.png";
import {parseWeekId} from "../../../contexts/ScheduleData/helpers";

export const RosterPDF = async (
  amRoster: RosterData[] | null,
  pmRoster: RosterData[] | null,
  weekId: string,
  day: dayjs.Dayjs,
  locationName: string,
) => {
  // Lazy load pdf tools
  const {Page, Text, View, Document, styles, Image} = await getPdfTools();
  // Get Week number and text
  const {start, end, week} = parseWeekId(weekId);

  const firstDayWeek = start.format("MMM DD");
  const lastDayWeek = end.format("MMM DD");
  const dayText = upperFirst(day.format("dddd, MMMM DD, YYYY"));

  // Group am roster by shift position
  const amRosterGrouped = groupBy(
    amRoster,
    ({shift}) => shift.position ?? "NO POSITION",
  );
  // Group pm roster by shift position
  const pmRosterGrouped = groupBy(
    pmRoster,
    ({shift}) => shift.position ?? "NO POSITION",
  );

  const RosterAMBody = await Promise.all(
    Object.entries(amRosterGrouped).map(async ([position, shifts]) => {
      const RosterRowComponent = await Promise.all(
        shifts.map(async ({member, shift}) => {
          const Row = await RosterRow({
            name: member.displayName,
            start: getShiftDayjsDate(shift, "start").format("h:mm a"),
            end: getShiftDayjsDate(shift, "end").format("h:mm a"),
          });
          return Row;
        }),
      );

      const RosterPositionComponent = await RosterPosition({
        children: position,
      });

      return (
        <View key={position}>
          {RosterPositionComponent}

          {RosterRowComponent}
        </View>
      );
    }),
  );

  const RosterPMBody = await Promise.all(
    Object.entries(pmRosterGrouped).map(async ([position, shifts]) => {
      const RosterRowComponent = await Promise.all(
        shifts.map(async ({member, shift}) => {
          const Row = await RosterRow({
            name: member.displayName,
            start: getShiftDayjsDate(shift, "start").format("h:mm a"),
            end: getShiftDayjsDate(shift, "end").format("h:mm a"),
          });
          return Row;
        }),
      );

      const RosterPositionComponent = await RosterPosition({
        children: position,
      });

      return (
        <View key={position}>
          {RosterPositionComponent}

          {RosterRowComponent}
        </View>
      );
    }),
  );

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View
          style={{
            marginBottom: 8,
          }}>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Image
              src={logoWithText}
              style={{
                width: 70,
                marginBottom: 3,
              }}
            />
            <Text
              style={{
                fontSize: 10,
              }}>
              schedulify.pro
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Text
              style={{
                fontSize: 13,
              }}>
              {locationName}
            </Text>

            <Text
              style={{
                fontSize: 13,
              }}>
              {`Week #${week}, ${upperFirst(firstDayWeek)} - ${upperFirst(
                lastDayWeek,
              )}`}
            </Text>
          </View>
        </View>

        <Text style={styles.headerCell}>{dayText}</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.headerRow]}>
            <View style={styles.tableRosterCol}>
              <Text style={styles.headerCell}>Name</Text>
            </View>
            <View style={styles.tableRosterCol}>
              <Text style={styles.headerCell}>Start Time</Text>
            </View>
            <View style={styles.tableRosterCol}>
              <Text style={styles.headerCell}>End Time</Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.Green.Light,
              borderStyle: "solid",
              borderWidth: 1,
              borderLeftWidth: 0,
              borderTopWidth: 0,
            }}>
            <Text style={styles.headerCell}>AM Roster</Text>
          </View>

          {RosterAMBody}

          <View
            style={{
              backgroundColor: Colors.Green.Light,
              borderStyle: "solid",
              borderWidth: 1,
              borderLeftWidth: 0,
              borderTopWidth: 0,
            }}>
            <Text style={styles.headerCell}>PM Roster</Text>
          </View>

          {RosterPMBody}
        </View>
      </Page>
    </Document>
  );
};
