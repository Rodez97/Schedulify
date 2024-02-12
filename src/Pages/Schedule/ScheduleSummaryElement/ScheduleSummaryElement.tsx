import {Fragment, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "antd/es";
import {useMediaQuery} from "@react-hook/media-query";
import {css} from "@emotion/react";
import {useSchedule} from "../../../contexts/ScheduleData/useSchedule";
import {getTotalWeekSummary} from "../../../contexts/ScheduleData/helpers";
import DialogSummary from "./DialogSummary";
import NonDialogSummary from "./NonDialogSummary";

function ScheduleSummaryElement() {
  const {t} = useTranslation();
  const {shifts} = useSchedule();
  const {totalHours, totalPeople, totalShifts} = useMemo(
    () => getTotalWeekSummary(shifts),
    [shifts],
  );
  const matches = useMediaQuery("only screen and (max-width: 680px)");
  const [dialogSummaryOpen, setDialogSummaryOpen] = useState(false);

  return matches ? (
    <Fragment>
      <Button
        onClick={() => {
          setDialogSummaryOpen(true);
        }}
        type="dashed"
        css={css`
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        `}
        block>
        {t("schedule.summary.btn")}
      </Button>
      <DialogSummary
        open={dialogSummaryOpen}
        onClose={() => {
          setDialogSummaryOpen(false);
        }}
        totalHours={totalHours}
        totalPeople={totalPeople}
        totalShifts={totalShifts}
      />
    </Fragment>
  ) : (
    <NonDialogSummary
      totalHours={totalHours}
      totalPeople={totalPeople}
      totalShifts={totalShifts}
    />
  );
}

export default ScheduleSummaryElement;
