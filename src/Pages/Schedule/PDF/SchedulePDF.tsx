import upperFirst from "lodash/upperFirst";
import type dayjs from "dayjs";
import logoWithText from "../../../assets/images/logo-with-text.png";
import {Colors} from "../../../utils/Colors";
import type Member from "../../../types/Member";
import i18n from "../../../i18n";
import {getShiftDayjsDate, getShiftIsoWeekday} from "../../../types/helpers";
import {getPdfTools} from "./getPdfTools";
import {type Shift} from "../../../types/Shift";
import {
  calculateTotalHoursByShifts,
  minutesToTextDuration,
  parseWeekId,
} from "../../../contexts/ScheduleData/helpers";

export const SchedulePDF = async (
  empDocs: Array<{
    member: Member;
    shifts: Shift[];
  }>,
  scheduleName: string,
  weekId: string,
  weekDays: dayjs.Dayjs[],
) => {
  // Lazy load pdf tools
  const {Page, Text, View, Document, styles, Image} = await getPdfTools();
  // Get Week number and text
  const {start, end, week} = parseWeekId(weekId);

  const firstDayWeek = start.format("MMMM D");
  const lastDayWeek = end.format("MMMM D");

  return (
    <Document>
      <Page orientation="landscape" size="A4" style={styles.body}>
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
              {scheduleName}
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

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.headerRow]}>
            <View style={styles.tableCol}>
              <Text style={styles.headerCell}>
                {i18n.t("members").toUpperCase()}
              </Text>
            </View>
            {weekDays.map(day => (
              <View style={styles.tableCol} key={day.toISOString()}>
                <Text style={styles.headerCell}>
                  {day.format("ddd D").toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          {empDocs.map(({member, shifts}, index) => {
            const totalHours = calculateTotalHoursByShifts(shifts);

            return (
              <View style={styles.tableRow} key={index}>
                <View style={[styles.tableCol, styles.empCol]}>
                  <Text style={styles.employeeTitle}>{member.displayName}</Text>
                  <Text style={styles.employeeSubtitle}>
                    {minutesToTextDuration(totalHours * 60)}
                  </Text>
                </View>
                {weekDays.map(day => {
                  const shiftsData = shifts.filter(
                    shift => getShiftIsoWeekday(shift) === day.isoWeekday(),
                  );
                  return (
                    <View key={Math.random()} style={styles.tableCol}>
                      {shiftsData.map(shift => {
                        const startTime = getShiftDayjsDate(
                          shift,
                          "start",
                        ).format("h:mma");
                        const endTime = getShiftDayjsDate(shift, "end").format(
                          "h:mma",
                        );
                        const fullTime = `${startTime} - ${endTime}`;
                        return (
                          <View
                            key={shift.id}
                            style={{
                              margin: 2,
                              border: "1px solid #ccc",
                            }}>
                            {shift.position != null && (
                              <Text
                                style={{
                                  backgroundColor: Colors.MainDark,
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: 10,
                                  textAlign: "center",
                                  textOverflow: "ellipsis",
                                  padding: 2,
                                }}>
                                {shift.position}
                              </Text>
                            )}

                            <Text
                              style={{
                                fontSize: 10,
                                textAlign: "center",
                                padding: 2,
                              }}>
                              {fullTime}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};
