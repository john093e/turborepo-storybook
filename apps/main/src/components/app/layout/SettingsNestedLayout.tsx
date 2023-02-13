import React, { useContext } from "react";

import SettingsSidebar from "@components/app/common/settings-sidebar/SettingsSidebar";

import type { WithChildren } from "@types";

import {
  SettingsProvider,
} from "@contexts/SettingsContext";

export default function SettingsNestedLayout({ children }: WithChildren) {
  return (
    <div className="overflow-hidden flex relative w-full">
      <SettingsProvider>
        {/* sidebar */}
        <SettingsSidebar />
        {/* Main Content */}
        <main
          className={`left-0 w-full h-[calc(100vh-3.8rem)] relative overflow-y-auto overscroll-contain dark:bg-gray-800`}
        >
          {children}
        </main>
      </SettingsProvider>
    </div>
  );
}
