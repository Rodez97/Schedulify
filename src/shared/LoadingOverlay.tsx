import {LoadingOutlined} from "@ant-design/icons";
import {css} from "@emotion/react";
import {Spin} from "antd";

const antIcon = <LoadingOutlined css={{fontSize: 30, color: "#fff"}} spin />;

function LoadingOverlay({open, label}: {open: boolean; label?: string}) {
  return (
    <div css={styles(open)} className="loading" id="main-loading-overlay">
      {label != null ? <div>{label}</div> : null}
      <Spin
        css={{
          color: "#fff",
        }}
        indicator={antIcon}
      />
    </div>
  );
}

const styles = (open: boolean) => css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${open ? "flex" : "none"};
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  &.loading {
    opacity: 1;
    pointer-events: all;
  }
`;

export default LoadingOverlay;
