import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState(null); // 👈 no active tab at first
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
  console.log(activeTab);

  return (
    <div className="tab-wrapper">
      {/* Tab Buttons */}
      <div
        className={`tab-buttons ${isMobile && hideTabsOnMobile ? "hide" : ""}`}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`outer-circle ${
              activeTab !== null && activeTab === index ? "active" : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            <span className="tabsIcons">{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content" id="below-render-search">
        {activeTab === null ? (
          <TabNull
            searchLabel={getSearchLabel()}
            onResults={setHideTabsOnMobile}
          />
        ) : (
          tabs[activeTab].content
        )}
      </div>
    </div>
  );
};
