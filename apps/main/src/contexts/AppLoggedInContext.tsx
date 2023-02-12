import { createContext, ReactNode, useState, ReactElement } from "react";
import { AppLoggedInContextType, IUser } from "@types/appLoggedInContext";
import { useRouter } from "next/router";

const authContextDefaultValues: AppLoggedInContextType = {
  user: {
    dateFormat: null,
    defaultHomepage: null,
    email: null,
    firstname: null,
    fullName: null,
    image: null,
    inUseOngId: null,
    inUseOngName: null,
    language: null,
    lastname: null,
    ongConnected: null,
    role: null,
    permissionSet: null,
    userId: null,
  },
  loading: false,
  error: null,
  setError: () => {},
  setLoading: () => {},
  setUserFunction: () => {},
  changeAccount: () => {},
  setRootModal: () => {},
  useRootModal: false,
  modalContent: null,
  resetRootModal: () => {},
  setRootDrawer: () => {},
  useRootDrawer: false,
  drawerContent: null,
  resetRootDrawer: () => {},
};

export const AppLoggedInContext = createContext<AppLoggedInContextType>(
  authContextDefaultValues
);

type Props = {
  children: ReactNode;
};

export function AppLoggedInProvider({ children }: Props) {
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<IUser>({
    dateFormat: null,
    defaultHomepage: null,
    email: null,
    firstname: null,
    fullName: null,
    image: null,
    inUseOngId: null,
    inUseOngName: null,
    language: null,
    lastname: null,
    ongConnected: null,
    role: null,
    permissionSet: null,
    userId: null,
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  //Set User
  const setUserFunction = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/charity/accessAndRole?userId=${userId}`
      );
      const available = await response.json();
      if (available) {
        if (available === "userId invalid") {
          setError("Il semble que l'identifiant envoyé n'a pas le bon format.");
        } else if (available === "userId mismatch session") {
          setError(
            "Il semble que l'identifiant envoyé ne correspond pas à l'identifiant en session."
          );
        } else if (available === "unknown") {
          setError("Il semble que votre compte n'existe pas.");
        } else if (available === "unknownOngLinked") {
          setError("Il semble que votre compte est n'est lié à aucune ONG.");
        } else if (available === "error") {
          setError("Il semble qu'une erreur c'est produite sur le serveur.");
        } else {
          setUser({
            dateFormat: available.dateFormat,
            defaultHomepage: available.defaultHomepage,
            email: available.email,
            firstname: available.firstname,
            fullName: available.fullName,
            image: available.image,
            inUseOngId: available.inUseOngId,
            inUseOngName: available.inUseOngName,
            language: available.language,
            lastname: available.lastname,
            ongConnected: available.ongConnected,
            role: available.role,
            permissionSet: available.permissionSet,
            userId: userId,
          });
        }
        setLoading(false);
      } else {
        setError("Un probleme est survenu en tentant de trouver vos données.");
        setUser({
          dateFormat: null,
          defaultHomepage: null,
          email: null,
          firstname: null,
          fullName: null,
          image: null,
          inUseOngId: null,
          inUseOngName: null,
          language: null,
          lastname: null,
          ongConnected: null,
          role: null,
          permissionSet: null,
          userId: null,
        });
        setLoading(false);
      }
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  };

  // changeAccount
  const changeAccount = async (ongId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/charity/changeAccount?ongId=${ongId}`);
      const available = await response.json();
      if (available) {
        setUser({
          dateFormat: user.dateFormat,
          defaultHomepage: available.defaultHomepage,
          email: user.email,
          firstname: user.firstname,
          fullName: user.fullName,
          image: user.image,
          inUseOngId: available.inUseOngId,
          inUseOngName: available.inUseOngName,
          language: user.language,
          lastname: user.lastname,
          ongConnected: user.ongConnected,
          role: available.role,
          permissionSet: available.permissionSet,
          userId: user.userId,
        });

        setLoading(false);
        router.push(`/${available.defaultHomepage}`);
      } else {
        setError("une erreur est survenue");
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  // Root Modal
  const [useRootModal, setUseRootModal] = useState(false);
  const [modalContent, setModalContent] = useState<ReactElement<any, any> | null>(null);
  const setRootModal = (component: ReactElement<any, any>) => {
    setUseRootModal(true);
    setModalContent(component);
  };
  const resetRootModal = () => {
    setUseRootModal(false);
    setModalContent(null);
  };

    // Root Drawer
    const [useRootDrawer, setUseRootDrawer] = useState(false);
    const [drawerContent, setDrawerContent] = useState<ReactElement<any, any> | null>(null);
    const setRootDrawer = (component: ReactElement<any, any>) => {
      setUseRootDrawer(true);
      setDrawerContent(component);
    };
    const resetRootDrawer = () => {
      setUseRootDrawer(false);
      setDrawerContent(null);
    };
  
  return (
    <AppLoggedInContext.Provider
      value={{
        user,
        loading,
        error,
        changeAccount,
        setError,
        setLoading,
        setUserFunction,
        setRootModal,
        useRootModal,
        modalContent,
        resetRootModal,
        setRootDrawer,
        useRootDrawer,
        drawerContent,
        resetRootDrawer
      }}
    >
      {children}
    </AppLoggedInContext.Provider>
  );
}
