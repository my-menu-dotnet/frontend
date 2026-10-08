import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Block, { TabsList, TabsTrigger } from "../Block";

describe("Block component", () => {
  it("renders children content inside a styled container", () => {
    const { container } = render(
      <Block>
        <span>Test content</span>
      </Block>
    );
    expect(screen.getByText("Test content")).toBeDefined();
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("rounded-xl");
  });

  it("applies custom className to root element", () => {
    const { container } = render(
      <Block className="custom-class">
        <span>content</span>
      </Block>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("custom-class");
  });

  it("forwards additional props to root element", () => {
    const { container } = render(
      <Block data-testid="block-test" aria-label="custom block">
        Content
      </Block>
    );
    const block = container.firstChild as HTMLElement;
    expect(block.getAttribute("data-testid")).toBe("block-test");
    expect(block.getAttribute("aria-label")).toBe("custom block");
  });

  it("renders tabs container when tabs prop is provided", () => {
    render(
      <Block
        tabs={
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
        }
      >
        Tab body content
      </Block>
    );
    expect(screen.getByText("One")).toBeDefined();
    expect(screen.getByText("Two")).toBeDefined();
    expect(screen.getByText("Tab body content")).toBeDefined();
  });

  it("omits padding class when tabs are present", () => {
    const { container } = render(
      <Block
        tabs={
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
        }
      >
        content
      </Block>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("pb-4");
  });
});
