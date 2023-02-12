import { createContext, useState } from 'react';

interface LayoutState {
    theme: 'dark' | 'light';
    showSidebarPages: boolean;
    showPreview: boolean;
    previewSize: 'desktop' | 'tablet' | 'mobile';
    showSideBar: boolean;
}

interface LayoutActions {
    setTheme: (theme: 'dark' | 'light') => void;
    setShowSidebarPages: (showSidebarPages: boolean) => void;
    setShowPreview: (showPreview: boolean) => void;
    setPreviewSize: (previewSize: 'desktop' | 'tablet' | 'mobile') => void;
    setShowSideBar: (showSideBar: boolean) => void;
}

const initialState: LayoutState = {
    theme: 'dark',
    showSidebarPages: false,
    showPreview: true,
    previewSize: 'desktop',
    showSideBar: true,
};

export const LayoutContext = createContext<LayoutState & LayoutActions>({
    ...initialState,
    setTheme: () => { },
    setShowSidebarPages: () => { },
    setShowPreview: () => { },
    setPreviewSize: () => { },
    setShowSideBar: () => { },
});

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [layoutState, setLayoutState] = useState<LayoutState>(initialState);
    const setShowPreview = (showPreview: boolean) => {
        if (showPreview === true){
            setLayoutState({ ...layoutState, showPreview: showPreview });
        }else{
            setLayoutState({ ...layoutState, showPreview: showPreview, showSideBar : true });
        }
        
    }
    const setShowSideBar = (showSideBar: boolean) => {        
        setLayoutState({ ...layoutState, showSideBar });
    }

    return (
        <LayoutContext.Provider
            value={{
                ...layoutState,
                setTheme: (theme) => setLayoutState({ ...layoutState, theme }),
                setShowPreview,
                setShowSidebarPages: (showSidebarPages) => setLayoutState({ ...layoutState, showSidebarPages }),
                setPreviewSize: (previewSize) => setLayoutState({ ...layoutState, previewSize }),
                setShowSideBar,
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
};
