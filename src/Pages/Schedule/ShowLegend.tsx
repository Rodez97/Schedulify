import {css} from "@emotion/react";
import {Modal} from "antd/es";
import i18next from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentDots, faSquare} from "@fortawesome/free-solid-svg-icons";

const elementStyle = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export default function ShowLegend() {
  Modal.info({
    title: i18next.t("legend").toString(),
    content: (
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
          {" " + i18next.t("published").toString()}
        </div>
        <div css={elementStyle}>
          <FontAwesomeIcon
            icon={faSquare}
            css={{
              color: "#505050",
              fontSize: "1.5em",
            }}
          />
          {" " + i18next.t("pending.publishing").toString()}
        </div>
        <div css={elementStyle}>
          <FontAwesomeIcon
            icon={faSquare}
            css={{
              color: "#f33d61",
              fontSize: "1.5em",
            }}
          />
          {" " + i18next.t("pending.deletion").toString()}
        </div>
        <div css={elementStyle}>
          <FontAwesomeIcon icon={faCommentDots} css={{fontSize: "1.5em"}} />
          {" " + i18next.t("notes").toString()}
        </div>
      </div>
    ),
  });
}
