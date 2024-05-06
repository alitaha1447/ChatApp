import { configureStore } from "@reduxjs/toolkit";

import reducer from '../reducer';

const Store = configureStore({
  reducer: reducer,
});
export default Store;