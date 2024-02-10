import {MoreOutlined} from "@ant-design/icons";
import {useMediaQuery} from "@react-hook/media-query";
import {Button, Dropdown, type MenuProps, Tooltip} from "antd";
import React from "react";

type ItemProps = Array<{
  tooltip?: string;
  hidden?: boolean;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  key: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: "link" | "text" | "default" | "primary" | "dashed" | undefined;
  loading?: boolean;
}>;

function PageHeaderButtons({
  items,
  mediaQuery,
  moreLabel,
  moreIcon,
}: {
  items: ItemProps;
  mediaQuery?: string;
  moreLabel?: string;
  moreIcon?: React.ReactNode;
}) {
  const matches = useMediaQuery(
    mediaQuery ?? "only screen and (max-width: 992px)",
  );

  const handleMenuClick: MenuProps["onClick"] = e => {
    const {key} = e;
    const item = items.find(item => item.key === key);
    if (item?.onClick != null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      item.onClick(e as any);
    }
  };

  const getMenuItem = (
    item: ItemProps[0],
  ): NonNullable<MenuProps["items"]>[0] => {
    const {tooltip, hidden, icon, disabled, label, key, loading, danger} = item;
    if (hidden === true) return null;
    return {
      key,
      icon,
      disabled: disabled ?? loading,
      label:
        tooltip != null ? <Tooltip title={tooltip}>{label}</Tooltip> : label,
      danger,
    };
  };

  const getButtonItem = (item: ItemProps[0]) => {
    const {
      tooltip,
      hidden,
      icon,
      onClick,
      disabled,
      label,
      key,
      type,
      loading,
    } = item;
    if (hidden === true) return null;

    if (tooltip != null) {
      return (
        <Tooltip key={key} title={tooltip}>
          <Button
            icon={icon}
            onClick={onClick}
            type={type}
            disabled={disabled}
            loading={loading}
            danger={item.danger}>
            {label}
          </Button>
        </Tooltip>
      );
    } else {
      return (
        <Button
          key={key}
          icon={icon}
          onClick={onClick}
          type={type}
          loading={loading}
          danger={item.danger}>
          {label}
        </Button>
      );
    }
  };

  if (matches && items.every(i => i.hidden)) {
    return null;
  }

  return (
    <React.Fragment>
      {matches ? (
        <Dropdown
          menu={{
            items: items.map(getMenuItem),
            onClick: handleMenuClick,
          }}>
          <Button>
            {moreLabel}
            {moreIcon ?? <MoreOutlined />}
          </Button>
        </Dropdown>
      ) : (
        <div
          css={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "8px",
          }}>
          {items.map(getButtonItem)}
        </div>
      )}
    </React.Fragment>
  );
}

export default PageHeaderButtons;
