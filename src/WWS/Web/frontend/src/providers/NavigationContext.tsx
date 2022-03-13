import React, {createContext, useContext, useState} from "react";
import {CategoryResponse} from "../types/dto/Category";
import {ItemResponse} from "../types/dto/InventoryItem";

interface INavigationContext {
  chosenCategoryId: number;
  setChosenCategoryId: (value: number) => void;
  chosenCategory: CategoryResponse;
  setChosenCategory: (value: CategoryResponse) => void;
  resetChosenCategory: () => void;
  chosenItem: ItemResponse | null;
  setChosenItem: (value: ItemResponse) => void;
  resetChosenItem: () => void;
  isResetSearch: boolean;
  toggleResetSearch: () => void;
  resetAll: () => void;
}

const defaultValues: INavigationContext = {
  chosenCategoryId: -1,
  setChosenCategoryId: value => {},
  chosenCategory: {id: -1, name: "", technicalSpecifications: []},
  setChosenCategory: value => {},
  resetChosenCategory: () => {},
  chosenItem: null,
  setChosenItem: value => {},
  resetChosenItem: () => {},
  isResetSearch: false,
  toggleResetSearch: () => {},
  resetAll: () => {},
}

const NavigationContext = createContext<INavigationContext>(defaultValues);

const NavigationContextProvider: React.FC = ({children}) => {
  const [chosenItem, setChosenItem] = useState<ItemResponse | null>(null);
  const [chosenCategoryId, setChosenCategoryId] = useState<number>(-1);
  const [chosenCategory, setChosenCategory] = useState<CategoryResponse>({id: -1, name: "", technicalSpecifications: []});
  const [resetSearch, setResetSearch] = useState<boolean>(false);

  const handleChosenItemChange = (value: ItemResponse) => setChosenItem(value);
  const handleResetChosenItem = () => setChosenItem(null);

  const handleChosenCategoryChange = (value: CategoryResponse) => setChosenCategory(value);
  const handleChosenCategoryIdChange = (value: number) => setChosenCategoryId(value);
  const handleResetChosenCategory = () => {
    setChosenCategoryId(-1);
    setChosenCategory({id: -1, name: "", technicalSpecifications: []});
  }
  const handleResetAll = () => {
    setChosenCategoryId(-1);
    setChosenCategory({id: -1, name: "", technicalSpecifications: []});
    setChosenItem(null);
    setResetSearch(false);
  }

  const handleResetSearch = () => setResetSearch(!resetSearch);

  return (
    <NavigationContext.Provider value={{
      chosenCategoryId: chosenCategoryId,
      setChosenCategoryId: handleChosenCategoryIdChange,
      chosenCategory: chosenCategory,
      setChosenCategory: handleChosenCategoryChange,
      resetChosenCategory: handleResetChosenCategory,
      chosenItem: chosenItem,
      setChosenItem: handleChosenItemChange,
      resetChosenItem: handleResetChosenItem,
      isResetSearch: resetSearch,
      toggleResetSearch: handleResetSearch,
      resetAll: handleResetAll
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

const useNavigationContext = () => useContext(NavigationContext);

export {useNavigationContext, NavigationContextProvider, NavigationContext}
