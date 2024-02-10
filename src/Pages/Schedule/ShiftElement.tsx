import {useCallback} from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {Dropdown, Modal, Tag, Typography} from "antd/es";
import {useTranslation} from "react-i18next";
import {type MouseEvent} from "react";
import type Member from "../../types/Member";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentDots} from "@fortawesome/free-solid-svg-icons";
import {getShiftDayjsDate} from "../../types/helpers";
import {Colors, wordToColor} from "../../utils/Colors";
import useDeleteShift from "../../contexts/ScheduleData/actions/useDeleteShift";
import {type Dayjs} from "dayjs";
import {type Shift} from "../../types/Shift";
import {useSchedule} from "../../contexts/ScheduleData/useSchedule";

interface ShiftElementProps {
  member: Member;
  column: Dayjs;
  shift: Shift;
  index: number;
}

function ShiftElement({member, column, shift, index}: ShiftElementProps) {
  const {t} = useTranslation();
  const {openNewShiftDialog, openEditShiftDialog} = useSchedule();
  const deleteShift = useDeleteShift();

  const handleOnAddShift = useCallback(() => {
    openNewShiftDialog(member, column);
  }, [openNewShiftDialog, member, column]);

  const handleOnEditShift = useCallback(() => {
    openEditShiftDialog(member, shift);
  }, [member, openEditShiftDialog, shift]);

  const handleDeleteShift = useCallback(() => {
    Modal.confirm({
      title: t("shift.delete.confirm"),
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteShift(shift);
      },
    });
  }, [deleteShift, shift, t]);

  const handleNotesClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();

      Modal.info({
        title: t("shifts.notes"),
        content: shift.notes,
        icon: <FontAwesomeIcon icon={faCommentDots} />,
      });
    },
    [shift.notes, t],
  );

  return (
    <Dropdown
      css={{
        transition: "all 0.3s ease-in-out",
      }}
      menu={{
        items: [
          {
            label: t("shift.edit"),
            key: "edit",
            icon: <EditOutlined />,
            onClick: handleOnEditShift,
          },
          {
            label: t("shift.add"),
            key: "new-shift",
            icon: <PlusOutlined />,
            onClick: handleOnAddShift,
          },
          {
            label: t("btn.delete"),
            key: "delete",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: handleDeleteShift,
          },
        ],
      }}
      trigger={["click"]}>
      <div className={`shift-element ${index !== 0 ? "has-top-margin" : ""}`}>
        <div className="shift-element__container">
          <Typography.Text className="shift-element__time">
            {`${getShiftDayjsDate(shift, "start")
              .format("h:mma")
              .replace("m", "")} - ${getShiftDayjsDate(shift, "end")
              .format("h:mma")
              .replace("m", "")}`}
          </Typography.Text>

          {shift.position != null && shift.position !== "" && (
            <AutoColorTag>{shift.position}</AutoColorTag>
          )}

          {Boolean(shift.notes) && (
            <FontAwesomeIcon
              icon={faCommentDots}
              className="shift-element__notes"
              onClick={handleNotesClick}
            />
          )}
        </div>
      </div>
    </Dropdown>
  );
}

export default ShiftElement;

const AutoColorTag = ({children}: {children: string}) => {
  const color = wordToColor(children);

  return (
    <Tag
      className="shift-element__tag"
      css={{
        backgroundColor: color,
        color: Colors.CalculateContrast(color),
        borderColor: Colors.CalculateContrast(color),
      }}>
      {children}
    </Tag>
  );
};
