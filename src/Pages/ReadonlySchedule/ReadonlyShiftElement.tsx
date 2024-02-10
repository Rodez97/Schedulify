import {useCallback} from "react";
import {Modal, Tag, Typography} from "antd/es";
import {useTranslation} from "react-i18next";
import type dayjs from "dayjs";
import {type MouseEvent} from "react";
import type Member from "../../types/Member";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faNoteSticky} from "@fortawesome/free-solid-svg-icons";
import {useMainUser} from "../../contexts/MainUser/useMainUser";
import {getShiftDayjsDate} from "../../types/helpers";
import {type Shift} from "../../types/Shift";

interface ReadonlyShiftElementProps {
  member: Member;
  column: dayjs.Dayjs;
  shift: Shift;
  index: number;
}

function ReadonlyShiftElement({
  shift,
  index,
  member,
}: ReadonlyShiftElementProps) {
  const {t} = useTranslation();
  const {user} = useMainUser();

  const handleNotesClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();

      if (shift.notes == null) return;

      if (member.email !== user.email) return;

      Modal.info({
        title: t("notes"),
        content: shift.notes,
        icon: <FontAwesomeIcon icon={faNoteSticky} />,
      });
    },
    [member.email, shift.notes, t, user.email],
  );

  return (
    <div
      className={`shift-element ${index !== 0 ? "has-top-margin" : ""}`}
      onClick={handleNotesClick}>
      <div className="shift-element__container">
        <Typography.Text className="shift-element__time">
          {`${getShiftDayjsDate(shift, "start")
            .format("h:mma")
            .replace("m", "")} - ${getShiftDayjsDate(shift, "end")
            .format("h:mma")
            .replace("m", "")}`}
        </Typography.Text>

        {shift.position != null && (
          <Tag color="processing" className="shift-element__tag">
            {shift.position}
          </Tag>
        )}

        {shift.notes != null && member.email === user.email && (
          <FontAwesomeIcon
            icon={faNoteSticky}
            className="shift-element__notes"
          />
        )}
      </div>
    </div>
  );
}

export default ReadonlyShiftElement;
