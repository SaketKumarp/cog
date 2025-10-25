import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RenderState {
  open: boolean;
  pending: boolean;
  auth: boolean;
  render: string;
  toggle: boolean;
}

const initialState: RenderState = {
  open: true,
  pending: true,
  auth: true,
  render: "",
  toggle: false,
};

const renderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    authStatus: (state, action: PayloadAction<boolean>) => {
      state.auth = action.payload;
    },
    toggleStatus: (state, action: PayloadAction<boolean>) => {
      state.toggle = action.payload;
    },
  },
});

export const { authStatus, toggleStatus } = renderSlice.actions;
export default renderSlice.reducer;
