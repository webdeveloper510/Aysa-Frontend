import { useState } from "react";
import { TabOne } from "./TabOne";
import { TabTwo } from "./TabTwo";
import { TabThree } from "./TabThree";
import { AiFillDollarCircle } from "react-icons/ai";
import { RiUser2Fill } from "react-icons/ri";
import { TbBuildingBank } from "react-icons/tb";
import React from "react";
import { TabNull } from "./TabNull";
import { useMediaQuery } from "@mui/material";

export const Tabs = () => {
  const [hideTabsOnMobile, setHideTabsOnMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const isDesktop = useMediaQuery("(min-width:768px)");
  const isMobile = !isDesktop;

  const getSearchLabel = () => {
    if (activeTab === 0) {
      return "Search by brand or product name";
    }
    switch (activeTab) {
      case 1:
        return "Search by pay gap details";
      case 2:
        return "Search by tax avoidance info";
      default:
        return "Search by brands, products or type";
    }
  };

  // ✅ Move tabs inside so we can inject onResults
  const tabs = [
    {
      label: "Profit Margin",
      icon: <AiFillDollarCircle />,
      content: (
        <TabNull
          searchLabel={getSearchLabel()}
          onResults={setHideTabsOnMobile}
        />
      ),
    },
    {
      label: "Pay Gap",
      icon: <RiUser2Fill />,
      content: <TabTwo />,
    },
    {
      label: "Tax Avoidance",
      icon: <TbBuildingBank />,
      content: <TabThree />,
    },
  ];

  return (
    <div className="tab-wrapper">
      {/* Tab Buttons */}
      <div
        className={`tab-buttons ${isMobile && hideTabsOnMobile ? "hide" : ""}`}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`outer-circle ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            <span className="tabsIcons">{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content" id="below-render-search">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};
