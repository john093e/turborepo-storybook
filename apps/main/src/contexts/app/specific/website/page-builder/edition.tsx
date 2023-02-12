import { createContext, useState } from 'react';
import { ComponentList, IComponent } from "@lib/dynamic-rendering/dynamic-rendering.interfaces";

interface EditionState {
    selectedComponentId: string | null;
    sidebarMode: 'scheme' | 'edit' | 'components';
    components: { id: string; name: string; icon: string }[];
    pageBody: IComponent;
}

interface EditionActions {
    setSelectedComponentId: (id: string | null) => void;
    setSidebarMode: (mode: 'scheme' | 'edit' | 'components') => void;
    setComponents: (components: { id: string; name: string; icon: string }[]) => void;
    setPageBody: (components: IComponent) => void;
    moveComponent: (index: number, direction: 'up' | 'down') => void;
    deleteComponent: (index: number) => void;
}

const initialEditionState: EditionState = {
    selectedComponentId: null,
    sidebarMode: 'scheme',
    components: [],
    pageBody: {
        component: "Container",
        data: {
            id: "4400936b-6158-1354-9dc8-a04c57e1af46",
            fluid: true,
            items: [
                {
                    component: "Card",
                    data: {
                        id: "26b3f355-2f65-4aae-b9fd-609779f24fdd",
                        title: "A custom title",
                        headline: "A random Headline",
                        copy: "A really long text....",
                        items: [
                          {
                            component: "Button",
                            data: {
                                id: "4400936b-6158-9087-9dc8-a04c57e1af46",
                                title: "Button example",
                                className: "btn-primary",
                                action: {
                                    type: "call",
                                    url: "https://pokeapi.co/api/v2/"
                                },
                            }
                          },
                        ]
                    }
                },
                {
                    component: "Divider",
                    data: {
                        id: "4400936b-6158-4943-9dc8-dsfhjs32723",
                        marginY: 5,
                    }
                },
                {
                    component: "Card",
                    data: {
                        id: "4400936b-6158-4943-9dc8-a04c57e1af46",
                        title: "Title",
                        headline: "This can be anything",
                        copy: "A really long text....",
                        image: {
                            url: "https://i.stack.imgur.com/y9DpT.jpg"
                        },
                    }
                },
                {
                  component: "Divider",
                  data: {
                      id: "4400936b-6158-4845-9dc8-dsfhjs32723",
                      marginY: 5,
                  }
                },
                {
                    component: "Container",
                    data: {
                        id: "d76e3a5f-01ad-46f6-a45d-3ad9699ecf99",
                        embeddedView: {
                            component: "Input",
                            data: {
                                id: "26b3f355-2f65-4aae-b9fd-609779f24fdd",
                                label: "Input",
                                type: "password",
                                placeholder: "Password",
                                isRequired: false,
                                minCharactersAllowed: 1,
                                maxCharactersAllowed: 100,
                                validations: [
                                    {
                                        regexType: "eightOrMoreCharacters",
                                        regexErrorCopy: "Use 8 or more characters"
                                    },
                                ]
                            }
                        }
                    }
                },
                {
                    component: "Divider",
                    data: {
                        id: "4400936b-6158654-4943-9dc8-dsfhjs32723",
                        marginY: 5,
                    }
                },
                {
                    component: "Card",
                    data: {
                        id: "4400936b-6158-4943-9dc7658-a04c57e1af46",
                        title: "Title",
                        headline: "This can be anything",
                        copy: "A really long text....",
                        image: {
                            url: "https://i.stack.imgur.com/y9DpT.jpg"
                        },
                    }
                },
                {
                    component: "Divider",
                    data: {
                        id: "4400936b-6158-4943-9dc868-dsfhjs32723",
                        marginY: 5,
                    }
                },
                {
                    component: "Card",
                    data: {
                        id: "4400936b-6158-495443-9dc8-a04c57e1af46",
                        title: "Title",
                        headline: "This can be anything",
                        copy: "A really long text....",
                        image: {
                            url: "https://i.stack.imgur.com/y9DpT.jpg"
                        },
                    }
                }
            ]
        }
      },
};

export const EditionContext = createContext<EditionState & EditionActions>({
    ...initialEditionState,
    setSelectedComponentId: () => { },
    setSidebarMode: () => { },
    setComponents: () => { },
    setPageBody: () => { },
    moveComponent: () => { },
    deleteComponent: () => { },
});

export const EditionProvider = ({ children }: { children: React.ReactNode }) => {
    const [editionState, setEditionState] = useState<EditionState>(initialEditionState);
    const setSelectedComponentId = (id: string | null) => {
        setEditionState({ ...editionState, selectedComponentId: id });
    };

    const setSidebarMode = (mode: 'scheme' | 'edit' | 'components') => {
        setEditionState({ ...editionState, sidebarMode: mode });
    };

    const setComponents = (components: { id: string; name: string; icon: string }[]) => {
        setEditionState({ ...editionState, components });
    };

    const setPageBody = (pageBody: IComponent) => {
        setEditionState({ ...editionState, pageBody });
    }

    const moveComponent = (index: number, direction: 'up' | 'down') => {
        const newComponents = [...editionState.components];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newComponents.length) {
            return;
        }
        const temp = newComponents[index];
        newComponents[index] = newComponents[targetIndex];
        newComponents[targetIndex] = temp;
        setComponents(newComponents);
    };

    const deleteComponent = (index: number) => {
        const newComponents = [...editionState.components];
        newComponents.splice(index, 1);
        setComponents(newComponents);
    };


    return (
        <EditionContext.Provider
            value={{
                ...editionState,
                setSelectedComponentId,
                setSidebarMode,
                setComponents,
                setPageBody,
                moveComponent,
                deleteComponent,
            }}
        >
            {children}
        </EditionContext.Provider>
    );

};