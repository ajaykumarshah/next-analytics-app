"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useDeleteExcelFromMongoOnReloadOrTabClose } from "@/customHooks/useDeleteExcelFromMongoOnReloadOrTabClose";
const withReduxProvider = (WrappedComponent) => {

  const WithReduxProvider = (props) => (
    <Provider store={store}>
      <WrappedComponent {...props} useDeleteExcelFromMongoOnReloadOrTabClose={useDeleteExcelFromMongoOnReloadOrTabClose} />
    </Provider>
  );
  return WithReduxProvider;
};

export default withReduxProvider;


