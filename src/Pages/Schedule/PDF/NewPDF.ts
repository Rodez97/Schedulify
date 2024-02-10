import type dayjs from "dayjs";
import fileDownload from "js-file-download";
import {type RosterData} from "../RosterView";
import type Member from "../../../types/Member";
import {SchedulePDF} from "./SchedulePDF";
import {RosterPDF} from "./RosterPDF";
import {getPdfTools} from "./getPdfTools";
import {type Shift} from "../../../types/Shift";

export const generateSchedulePdf = async (
  empDocs: Array<{
    member: Member;
    shifts: Shift[];
  }>,
  locationName: string,
  weekId: string,
  weekDays: dayjs.Dayjs[],
) => {
  // Lazy load pdf tools
  const {pdf} = await getPdfTools();

  const SchedulePdfComponent = await SchedulePDF(
    empDocs,
    locationName,
    weekId,
    weekDays,
  );

  const blob = await pdf(SchedulePdfComponent).toBlob();

  fileDownload(blob, "Schedule " + weekId + ".pdf", "application/pdf");
};

export const generateRosterPdf = async (
  amRoster: RosterData[] | null,
  pmRoster: RosterData[] | null,
  weekId: string,
  day: dayjs.Dayjs,
  locationName: string,
) => {
  // Lazy load pdf tools
  const {pdf} = await getPdfTools();

  const RosterPdfComponent = await RosterPDF(
    amRoster,
    pmRoster,
    weekId,
    day,
    locationName,
  );

  const blob = await pdf(RosterPdfComponent).toBlob();

  fileDownload(blob, "Roster " + weekId + ".pdf", "application/pdf");
};
