import "@testing-library/jest-dom";
import {act, renderHook} from "@testing-library/react";
import {useDisclose} from "./useDisclose";

// Generated by CodiumAI

describe("Test use disclose hook", () => {
  // a boolean value and three functions
  it("should return an array with a boolean value and three functions", () => {
    const {result} = renderHook(useDisclose);

    expect(result.current[0]).toBe(false);
    expect(typeof result.current[1]).toBe("function");
    expect(typeof result.current[2]).toBe("function");
    expect(typeof result.current[3]).toBe("function");
  });

  // The first function opens the hook by setting the boolean value to true
  it("should open the hook by setting the boolean value to true", () => {
    const {result} = renderHook(useDisclose);

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
  });

  // The hook initializes with a custom value of true
  it("should initialize the hook with a custom value of true", () => {
    const {result} = renderHook(useDisclose, {
      initialProps: true,
    });

    expect(result.current[0]).toBe(true);
  });

  // The second function closes the hook by setting the boolean value to false.
  it("should close the hook when the second function is called", () => {
    const {result} = renderHook(useDisclose, {
      initialProps: true,
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe(false);
  });

  // The third function toggles the hook by setting the boolean value to the opposite of its current value.
  it("should toggle the boolean value when called", () => {
    const {result} = renderHook(useDisclose);

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[3]();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[3]();
    });

    expect(result.current[0]).toBe(false);
  });

  // The hook updates its state correctly when the open, close, and toggle functions are called.
  it("should update state correctly when multiple hooks are used with different initial states and actions are dispatched from the same hook in different order", () => {
    const {result: result1} = renderHook(useDisclose);
    const {result: result2} = renderHook(useDisclose, {
      initialProps: true,
    });

    expect(result1.current[0]).toBe(false);
    expect(result2.current[0]).toBe(true);
    act(() => {
      result1.current[1]();
    });

    expect(result1.current[0]).toBe(true);
    expect(result2.current[0]).toBe(true);

    act(() => {
      result1.current[2]();
    });

    expect(result1.current[0]).toBe(false);
    expect(result2.current[0]).toBe(true);

    act(() => {
      result1.current[3]();
    });

    expect(result1.current[0]).toBe(true);
    expect(result2.current[0]).toBe(true);

    act(() => {
      result2.current[1]();
    });

    expect(result1.current[0]).toBe(true);
    expect(result2.current[0]).toBe(true);

    act(() => {
      result2.current[2]();
    });

    expect(result1.current[0]).toBe(true);
    expect(result2.current[0]).toBe(false);

    act(() => {
      result2.current[3]();
    });

    expect(result1.current[0]).toBe(true);
    expect(result2.current[0]).toBe(true);
  });
});
