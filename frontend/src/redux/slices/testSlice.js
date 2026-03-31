import { createSlice } from '@reduxjs/toolkit';

const testSlice = createSlice({
  name: 'test',
  initialState: {
    currentTest: null,
    answers: [],
    result: null,
  },
  reducers: {
    setTest(state, action) {
      state.currentTest = action.payload;
      state.answers = new Array(action.payload.questions.length).fill('');
      state.result = null;
    },
    setAnswer(state, action) {
      const { index, answer } = action.payload;
      state.answers[index] = answer;
    },
    setResult(state, action) {
      state.result = action.payload;
    },
    clearTest(state) {
      state.currentTest = null;
      state.answers = [];
      state.result = null;
    },
  },
});

export const { setTest, setAnswer, setResult, clearTest } = testSlice.actions;
export default testSlice.reducer;
