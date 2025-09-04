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

function useMediaQuery(query) {
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
  const isMobile = useMediaQuery("(max-width: 768px)");

  const getSearchLabel = () => {
    if (activeTab === 0) {
      return "Search by brand or product name";
    }
    switch (activeTab) {
      case 0:
        return "Search by brands, products or type";
      default:
        return tabs[activeTab]?.label;
    }
  };

  return (
    <div className="tab-wrapper">
      {isMobile ? (
        <>
          <div className="accordion-wrapper">
            {tabs.map((tab, index) => {
              const isOpen = activeTab === index;
              return (
                <div key={index} className="accordion-item">
                  <div
                    className={`accordion-header ${isOpen ? "open" : ""}`}
                    onClick={() => setActiveTab(isOpen ? null : index)}
                  >
                    <span>{tab.label}</span>
                  </div>
                  {isOpen && (
                    <div className="accordion-content">
                      {React.cloneElement(tab.content, {
                        searchLabel: getSearchLabel(),
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {activeTab === null && (
            <div className="tab-content" id="mobile-inital-render">
              <TabOne searchLabel={getSearchLabel()} />
            </div>
          )}
        </>
      ) : (
        // ✅ Desktop: Tab View
        <>
          <div className="tab-buttons">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`outer-circle ${
                  activeTab === index ? "active" : ""
                }`}
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
