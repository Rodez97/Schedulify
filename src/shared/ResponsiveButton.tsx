import {useMediaQuery} from "@react-hook/media-query";
import {Button, type ButtonProps} from "antd";

interface Props extends ButtonProps {
  responsiveLabel?: string | React.ReactNode | null;
  mediaQuery?: string;
}

function ResponsiveButton({
  children,
  responsiveLabel = null,
  mediaQuery,
  ...props
}: Props) {
  const matches = useMediaQuery(
    mediaQuery ?? "only screen and (max-width: 600px)",
  );
  return <Button {...props}>{matches ? responsiveLabel : children}</Button>;
}

export default ResponsiveButton;
