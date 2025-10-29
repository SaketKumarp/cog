import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Id } from "../../convex/_generated/dataModel";

interface RenderState {
  isOpen: boolean;
  pending: boolean;
  auth: boolean;
  render: string;
  toggle: boolean;
  boardId?: Id<"boards">;
}

const initialState: RenderState = {
  isOpen: false,
  pending: true,
  auth: true,
  render: "",
  toggle: false,
  boardId: undefined,
};

const renderSlice = createSlice({
  name: "render",
  initialState,
  reducers: {
    modalStatus: (
      state,
      action: PayloadAction<{
        isOpen: boolean;
        boardId: Id<"boards"> | undefined;
      }>
    ) => {
      state.isOpen = action.payload.isOpen;
      state.boardId = action.payload.boardId;
    },
  },
});

export const { modalStatus } = renderSlice.actions;
export default renderSlice.reducer;
