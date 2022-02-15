import React, {createContext, useContext, useState} from "react";
import {CategoryResponse} from "../types/dto/Category";
import {ItemResponse} from "../types/dto/InventoryItem";

interface INavigationContext {
  chosenCategory: CategoryResponse;
  setChosenCategory: (value: CategoryResponse) => void;
  resetChosenCategory: () => void;
  chosenItem: ItemResponse | null;
  setChosenItem: (value: ItemResponse) => void;
  resetChosenItem: () => void;
  isResetSearch: boolean;
  toggleResetSearch: () => void;
}

const defaultValues: INavigationContext = {
  chosenCategory: {id: -1, name: ""},
  setChosenCategory: value => {},
  resetChosenCategory: () => {},
  chosenItem: null,
  setChosenItem: value => {},
  resetChosenItem: () => {},
  isResetSearch: false,
  toggleResetSearch: () => {},
}

const NavigationContext = createContext<INavigationContext>(defaultValues);

const NavigationContextProvider: React.FC = ({children}) => {
  const [chosenItem, setChosenItem] = useState<ItemResponse | null>(null);
  const [chosenCategory, setChosenCategory] = useState<CategoryResponse>({id: -1, name: ""});
  const [resetSearch, setResetSearch] = useState<boolean>(false);

  const handleChosenItemChange = (value: ItemResponse) => setChosenItem(value);
  const handleResetChosenItem = () => setChosenItem(null);

  const handleChosenCategoryChange = (value: CategoryResponse) => setChosenCategory(value);
  const handleResetChosenCategory = () => setChosenCategory({id: -1, name: ""});

  const handleResetSearch = () => setResetSearch(!resetSearch);

  return (
    <NavigationContext.Provider value={{
      chosenCategory: chosenCategory,
      setChosenCategory: handleChosenCategoryChange,
      resetChosenCategory: handleResetChosenCategory,
      chosenItem: chosenItem,
      setChosenItem: handleChosenItemChange,
      resetChosenItem: handleResetChosenItem,
      isResetSearch: resetSearch,
      toggleResetSearch: handleResetSearch
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

const useNavigationContext = () => useContext(NavigationContext);

export {useNavigationContext, NavigationContextProvider, NavigationContext}
