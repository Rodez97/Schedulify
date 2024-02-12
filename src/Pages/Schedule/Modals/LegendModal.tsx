import {css} from "@emotion/react";
import {Modal} from "antd/es";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentDots, faSquare} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

const elementStyle = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export default function LegendModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose?: () => void;
}) {
  const {t} = useTranslation();

  return (
    <Modal open={visible} onOk={onClose} title={t("legend")}>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
        }}>
        <div css={elementStyle}>
          <FontAwesomeIcon
            icon={faSquare}
            css={{
              color: "blue",
              fontSize: "1.5em",
            }}
          />
          {" " + t("published")}
        </div>
        <div css={elementStyle}>
          <FontAwesomeIcon
            icon={faSquare}
            css={{
              color: "#505050",
              fontSize: "1.5em",
            }}
          />
          {" " + t("pending.publishing")}
        </div>
        <div css={elementStyle}>
          <FontAwesomeIcon
            icon={faSquare}
            css={{
              color: "#f33d61",
              fontSize: "1.5em",
            }}
          />
          {" " + t("pending.deletion")}
        </div>
        <div css={elementStyle}>
          <FontAwesomeIcon icon={faCommentDots} css={{fontSize: "1.5em"}} />
          {" " + t("notes")}
        </div>
      </div>
    </Modal>
  );
}
