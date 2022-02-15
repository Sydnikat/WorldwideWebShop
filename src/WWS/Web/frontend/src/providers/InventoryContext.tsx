import React, {createContext, useContext, useState} from "react";
import {CategoryResponse} from "../types/dto/Category";
import {ItemResponse} from "../types/dto/InventoryItem";

interface IInventoryContext {
  selectedCategory: CategoryResponse;
  setSelectedCategory: (value: CategoryResponse) => void;
  resetSelectedCategory: () => void;
  toggleReloadCategories: () => void;
  isReloadCalled: boolean;
}

const defaultValues: IInventoryContext = {
  selectedCategory: {id: -1, name: ""},
  setSelectedCategory: value => {},
  resetSelectedCategory: () => {},
  toggleReloadCategories: () => {},
  isReloadCalled: false,
}

const InventoryContext = createContext<IInventoryContext>(defaultValues);

const InventoryContextProvider: React.FC = ({children}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse>({id: 0, name: ""});
  const [isReloadCalled, setIsReloadCalled] = useState<boolean>(false);

  const handleSelectedCategoryChange = (value: CategoryResponse) => setSelectedCategory(value);
  const handleResetSelectedCategory = () => setSelectedCategory({id: 0, name: ""});

  const handleToggleReloadCategories = () => {
    setSelectedCategory({id: 0, name: ""});
    setIsReloadCalled(!isReloadCalled);
  }

  return (
    <InventoryContext.Provider value={{
      selectedCategory: selectedCategory,
      setSelectedCategory: handleSelectedCategoryChange,
      resetSelectedCategory: handleResetSelectedCategory,
      toggleReloadCategories: handleToggleReloadCategories,
      isReloadCalled: isReloadCalled
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

const useInventoryContext = () => useContext(InventoryContext);

export {useInventoryContext, InventoryContextProvider, InventoryContext}
