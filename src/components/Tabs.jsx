import { useState } from "react";
import {TabOne} from "./TabOne";
import {TabTwo} from "./TabTwo";
import {TabThree} from "./TabThree";

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
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="tab-wrapper">
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

        <div className="tab-content">{tabs[activeTab].content}</div>
      </div>
    </>
  );
};
