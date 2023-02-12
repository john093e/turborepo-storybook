import { createContext, ReactNode, useState } from "react";

export type SettingsContextType = {
  menuOpen: boolean;
  setMenuOpen: (data: boolean) => void;
};

const settingsContextDefaultValues: SettingsContextType = {
  menuOpen: true,
  setMenuOpen: () => {},
};

export const SettingsContext = createContext<SettingsContextType>(
  settingsContextDefaultValues
);

type Props = {
  children: ReactNode;
};

export function SettingsProvider({ children }: Props) {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
