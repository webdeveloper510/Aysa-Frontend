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

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState(null);

  const getSearchLabel = () => {
    if (activeTab === 0) {
      return "See what brands don't want you to know";
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
    </div>
  );
};
