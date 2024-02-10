import {message} from "antd/es";
import {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {generateSchedulePdf} from "./PDF/NewPDF";
import {useSelectedTeam} from "../../contexts/SelectedTeam/useSelectedTeam";
import {generateExcel} from "./EXCEL/generateExcel";
import {useSchedule} from "../../contexts/ScheduleData/useSchedule";

function useGeneratePdfBtn() {
  const {t} = useTranslation();
  const {schedule} = useSelectedTeam();
  const {weekId, memberShifts, weekDays, loading} = useSchedule();
  const [generatingFile, setGeneratingFile] = useState(false);

  const generatePdf = useCallback(async () => {
    if (memberShifts.length === 0) {
      return await message.error(t("no.employees.scheduled"));
    }
    try {
      setGeneratingFile(true);

      await generateSchedulePdf(memberShifts, schedule.name, weekId, weekDays);
    } catch (error) {
      console.log(error);
    } finally {
      setGeneratingFile(false);
    }
  }, [memberShifts, schedule.name, weekId, weekDays, t]);

  const generateExcelFile = useCallback(async () => {
    if (memberShifts.length === 0) {
      return await message.error(t("no.employees.scheduled"));
    }
    try {
      setGeneratingFile(true);

      await generateExcel(memberShifts, schedule.name, weekId, weekDays);
    } catch (error) {
      console.log(error);
    } finally {
      setGeneratingFile(false);
    }
  }, [memberShifts, schedule.name, weekId, weekDays, t]);

  return {
    generatePdf,
    generatingFile: generatingFile || loading,
    generateExcelFile,
  };
}

export default useGeneratePdfBtn;
