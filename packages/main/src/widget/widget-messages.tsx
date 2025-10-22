import { useState } from "react";
import { Actor } from "../actor";
import { useUmbrellaMode } from "../provider/use-umbrellamode";
import { UserAction } from "../types";

export const WidgetMessages = () => {
  const { userActions } = useUmbrellaMode();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [highlightedElements, setHighlightedElements] = useState<Set<string>>(
    new Set()
  );

  const actor = new Actor();

  // Inject pulse keyframes animation into document if not already present
  const injectPulseAnimation = () => {
    const existingStyle = document.getElementById(
      "umbrellamode-pulse-animation"
    );
    if (existingStyle) {
      console.log("Pulse animation already exists");
      return;
    }

    const style = document.createElement("style");
    style.id = "umbrellamode-pulse-animation";
    style.textContent = `
      @keyframes umbrellamode-pulse {
        0% {
          box-shadow: 0 0 0 0px #007bff;
        }
        50% {
          box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
        }
        100% {
          box-shadow: 0 0 0 0px #007bff;
        }
      }
    `;
    document.head.appendChild(style);
    console.log("Injected pulse animation keyframes");
  };

  // Group actions by type
  const groupedActions = userActions.reduce(
    (groups, action) => {
      const type = action.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(action);
      return groups;
    },
    {} as Record<string, UserAction[]>
  );

  // Get action type display name
  const getActionTypeDisplayName = (type: string): string => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get action type color
  const getActionTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      click: "#007bff",
      input: "#28a745",
      form_submit: "#ffc107",
      select_change: "#17a2b8",
      scroll: "#6c757d",
      network_request: "#fd7e14",
      hover: "#e83e8c",
    };
    return colors[type] || "#6c757d";
  };

  // Toggle section expansion
  const toggleSection = (type: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Generate fallback selectors from element data
  const generateFallbackSelectors = (
    action: UserAction & {
      element: {
        selector: string;
        id?: string;
        tagName: string;
        className: string;
        attributes: Record<string, string>;
      };
    }
  ): string[] => {
    const selectors: string[] = [];
    const { element } = action;

    // Primary selector (most specific)
    selectors.push(element.selector);

    // ID-based selectors
    if (element.id) {
      selectors.push(`#${element.id}`);
      selectors.push(`${element.tagName.toLowerCase()}#${element.id}`);
    }

    // Class-based selectors
    if (element.className) {
      const classSelector = `.${element.className.split(" ").join(".")}`;
      selectors.push(classSelector);
      selectors.push(`${element.tagName.toLowerCase()}${classSelector}`);
    }

    // Data attribute selectors
    Object.entries(element.attributes).forEach(([key, value]) => {
      if (key.startsWith("data-")) {
        selectors.push(`[${key}="${value}"]`);
        selectors.push(`${element.tagName.toLowerCase()}[${key}="${value}"]`);
      }
    });

    // Other useful attributes
    ["name", "type", "role", "aria-label"].forEach((attr) => {
      if (element.attributes[attr]) {
        selectors.push(`[${attr}="${element.attributes[attr]}"]`);
        selectors.push(
          `${element.tagName.toLowerCase()}[${attr}="${element.attributes[attr]}"]`
        );
      }
    });

    // Tag only (last resort)
    selectors.push(element.tagName.toLowerCase());

    // Remove duplicates while preserving order
    return [...new Set(selectors)];
  };

  // Type guard to check if action has an element property
  const hasElement = (
    action: UserAction
  ): action is UserAction & {
    element: {
      selector: string;
      id?: string;
      tagName: string;
      className: string;
      attributes: Record<string, string>;
    };
  } => {
    return (
      "element" in action &&
      action.element &&
      "selector" in action.element &&
      "tagName" in action.element &&
      "className" in action.element &&
      "attributes" in action.element
    );
  };

  const handleHighlightSelector = async (action: UserAction) => {
    if (!hasElement(action)) {
      console.warn(
        "Action does not have a highlightable element:",
        action.type
      );
      return;
    }

    const actionKey = `${action.type}-${action.timestamp}`;
    const isCurrentlyHighlighted = highlightedElements.has(actionKey);

    if (isCurrentlyHighlighted) {
      // Remove highlight
      const fallbackSelectors = generateFallbackSelectors(action);
      let removed = false;

      for (const selector of fallbackSelectors) {
        try {
          const element = document.querySelector(selector);
          if (element && element instanceof HTMLElement) {
            // Remove highlight ring styles and animation
            element.style.removeProperty("box-shadow");
            element.style.removeProperty("animation");
            removed = true;
            break;
          }
        } catch (error) {
          console.warn(
            `Failed to remove highlight from selector: ${selector}`,
            error
          );
        }
      }

      if (removed) {
        setHighlightedElements((prev) => {
          const newSet = new Set(prev);
          newSet.delete(actionKey);
          return newSet;
        });
      }
    } else {
      // Add highlight
      const fallbackSelectors = generateFallbackSelectors(action);
      let lastError: Error | null = null;

      // Try each selector sequentially
      for (const selector of fallbackSelectors) {
        try {
          const element = document.querySelector(selector);
          if (element && element instanceof HTMLElement) {
            // Inject pulse animation if not already present
            injectPulseAnimation();

            // Apply animation (box-shadow is handled by the keyframes)
            element.style.setProperty(
              "animation",
              "umbrellamode-pulse 2s ease-in-out infinite",
              "important"
            );

            console.log(
              "Applied pulse animation to element:",
              element,
              "with selector:",
              selector
            );
            setHighlightedElements((prev) => new Set(prev).add(actionKey));
            return;
          }
        } catch (error) {
          lastError = error as Error;
          console.warn(`Selector failed: ${selector}`, error);
        }
      }

      // If all selectors failed, show comprehensive error
      const errorMessage = `Failed to highlight element. Tried ${fallbackSelectors.length} selectors:\n${fallbackSelectors.map((s) => `• ${s}`).join("\n")}\n\nElement may have been removed from DOM or selectors are no longer valid.`;
      alert(errorMessage);
      console.error("All selectors failed:", {
        action: action.type,
        selectors: fallbackSelectors,
        lastError: lastError?.message,
      });
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        width: "100%",
        minHeight: 0,
      }}
    >
      <div style={{ padding: 16 }}>
        {Object.keys(groupedActions).length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#6c757d",
              fontSize: "14px",
            }}
          >
            No user actions recorded yet
          </div>
        ) : (
          Object.entries(groupedActions).map(([type, actions]) => {
            const isExpanded = expandedSections[type] !== false; // Default to expanded
            const typeColor = getActionTypeColor(type);

            return (
              <div key={type} style={{ marginBottom: 20 }}>
                {/* Section Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    backgroundColor: `${typeColor}15`,
                    border: `1px solid ${typeColor}30`,
                    borderRadius: "8px 8px 0 0",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => toggleSection(type)}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: typeColor,
                      }}
                    >
                      {getActionTypeDisplayName(type)}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        backgroundColor: typeColor,
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {actions.length}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "16px",
                      color: typeColor,
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    ▼
                  </span>
                </div>

                {/* Section Content */}
                {isExpanded && (
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: `1px solid ${typeColor}30`,
                      borderTop: "none",
                      borderRadius: "0 0 8px 8px",
                      padding: "16px",
                    }}
                  >
                    {actions.map((action, index) => (
                      <div
                        key={`${action.type}-${index}`}
                        style={{ marginBottom: 16 }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          {hasElement(action) &&
                            (() => {
                              const actionKey = `${action.type}-${action.timestamp}`;
                              const isHighlighted =
                                highlightedElements.has(actionKey);
                              return (
                                <button
                                  onClick={() =>
                                    handleHighlightSelector(action)
                                  }
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "12px",
                                    backgroundColor: isHighlighted
                                      ? "#dc3545"
                                      : "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      isHighlighted ? "#c82333" : "#0056b3";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      isHighlighted ? "#dc3545" : "#007bff";
                                  }}
                                >
                                  {isHighlighted ? "Unhighlight" : "Highlight"}
                                </button>
                              );
                            })()}
                          <span
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            {action.type.toUpperCase()}
                          </span>
                        </div>
                        {hasElement(action) && (
                          <div
                            style={{
                              fontSize: "12px",
                              fontFamily: "monospace",
                            }}
                          >
                            <strong>Selector:</strong> {action.element.selector}
                          </div>
                        )}
                        <details style={{ marginTop: 8 }}>
                          <summary
                            style={{ cursor: "pointer", fontSize: "12px" }}
                          >
                            View Full Action Data
                          </summary>
                          <pre
                            style={{
                              fontSize: "10px",
                              marginTop: 8,
                              overflow: "auto",
                            }}
                          >
                            {JSON.stringify(action, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
