import "@testing-library/jest-dom";

// Mock window.performance if needed
if (typeof window !== "undefined" && !window.performance) {
  // @ts-expect-error test mock
  window.performance = {
    now: () => Date.now(),
  };
}
