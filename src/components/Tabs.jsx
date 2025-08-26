import { useState, useEffect } from "react";
import { TabOne } from "./TabOne";
import { TabTwo } from "./TabTwo";
import { TabThree } from "./TabThree";
import React from "react";

const tabs = [
  {
    label: "Discover the profit margin of any product",
    content: <TabOne />,
  },
  {
    label: "Expose the CEO-Worker pay gap",
    content: <TabTwo />,
  },
  {
    label: "Uncover corporate tax avoidance",
    content: <TabThree />,
  },
];

// ✅ Small custom hook for media queries
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export const Tabs = () => {
 const [activeTab, setActiveTab] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)"); // breakpoint

  const getSearchLabel = () => {
    if (activeTab === null) {
      return "See what brands don't want you to know";
    }
    switch (activeTab) {
      case 0:
        return "Search by brands, products or type";
      default:
        return tabs[activeTab].label;
    }
  };

  return (
    <div className="tab-wrapper">
      {isMobile ? (
        // ✅ Mobile: Accordion View
        <div className="accordion-wrapper">
          {tabs.map((tab, index) => (
            <div key={index} className="accordion-item">
              <div
                className={`accordion-header ${activeTab === index ? "open" : ""}`}
                onClick={() =>
                  setActiveTab(activeTab === index ? null : index)
                }
              >
                <span>{tab.label}</span>
              </div>
              {activeTab === index && (
                <div className="accordion-content">
                  {React.cloneElement(tab.content, { searchLabel: getSearchLabel() })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // ✅ Desktop: Tab View
        <>
          <div className="tab-buttons">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`outer-circle ${activeTab === index ? "active" : ""}`}
                onClick={() => setActiveTab(index)}
              >
                <div className="inner-circle">
                  <span>{tab.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="tab-content">
            {activeTab !== null ? (
              React.cloneElement(tabs[activeTab].content, {
                searchLabel: getSearchLabel(),
              })
            ) : (
              <TabOne searchLabel={getSearchLabel()} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
