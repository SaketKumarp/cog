import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Id } from "../../convex/_generated/dataModel";

interface RenderState {
  isOpen: boolean;
  pending: boolean;
  auth: boolean;
  search: string;
  toggle: boolean;
  boardId?: Id<"boards">;
}

const initialState: RenderState = {
  isOpen: false,
  pending: true,
  auth: true,
  search: "",
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

    searchValue: (state, action) => {
      state.search = action.payload;
    }, // this is used to pass the search query for the baords
  },
});

export const { modalStatus, searchValue } = renderSlice.actions;
export default renderSlice.reducer;
