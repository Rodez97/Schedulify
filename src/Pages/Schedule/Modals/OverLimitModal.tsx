import {Modal, Typography} from "antd/es";
import {useTranslation} from "react-i18next";
import {useSelectedTeam} from "../../../contexts/SelectedTeam/useSelectedTeam";

function OverLimitModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const {t} = useTranslation();
  const {usage} = useSelectedTeam();

  return (
    <Modal open={visible} onCancel={onClose}>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
        <p>{t("sub.plan.limits.exceeded.alert")}</p>
        <Typography.Text
          type={usage.members > usage.maxMembers ? "danger" : "secondary"}>
          {t("sub.plan.limits.exceeded.members {{0}} {{1}}", {
            0: usage.members,
            1: usage.maxMembers,
          })}
        </Typography.Text>

        <Typography.Text
          type={
            usage.collaborators > usage.maxCollaborators
              ? "danger"
              : "secondary"
          }>
          {t("sub.plan.limits.exceeded.collaborators {{0}} {{1}}", {
            0: usage.collaborators,
            1: usage.maxCollaborators,
          })}
        </Typography.Text>
      </div>
    </Modal>
  );
}

export default OverLimitModal;
