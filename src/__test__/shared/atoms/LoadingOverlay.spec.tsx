import "@testing-library/jest-dom";
import {render, screen} from "@testing-library/react";
import LoadingOverlay from "../../../shared/LoadingOverlay";

describe("Test Loading Overlay", () => {
  // Renders a loading overlay with a spinner when 'open' is true
  it("should render a loading overlay with a spinner when 'open' is true", () => {
    // Arrange
    const open = true;
    const label = undefined;

    // Act
    render(<LoadingOverlay open={open} label={label} />);

    // Assert
    const loading = document.getElementById("main-loading-overlay");
    expect(loading).toHaveStyle("display: flex");
  });

  // Does not render a loading overlay when 'open' is false
  it("should not render a loading overlay when 'open' is false", () => {
    // Arrange
    const open = false;
    const label = undefined;

    // Act
    render(<LoadingOverlay open={open} label={label} />);

    // Assert
    const loading = document.getElementById("main-loading-overlay");
    expect(loading).toHaveStyle("display: none");
  });

  // Renders a loading overlay with a label when 'label' is provided
  it("should render a loading overlay with a label when 'label' is provided", () => {
    // Arrange
    const open = true;
    const label = "Loading...";

    // Act
    render(<LoadingOverlay open={open} label={label} />);

    // Assert
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  // 'open' is true for a long time
  it("should render a loading overlay for a long time when 'open' is true", () => {
    // Arrange
    jest.useFakeTimers();
    const open = true;
    const label = undefined;

    // Act
    render(<LoadingOverlay open={open} label={label} />);
    jest.advanceTimersByTime(5000);

    // Assert
    expect(screen.getByLabelText("loading")).toBeInTheDocument();

    // Cleanup
    jest.useRealTimers();
  });
});
