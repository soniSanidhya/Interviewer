## React Redux Full Configuration Notes

### 1. **Installing Required Packages**

Ensure you have the following installed:

```bash
npm install @reduxjs/toolkit react-redux
```

---

### 2. **Creating the Redux Slice**

- A slice contains the reducer logic and actions for a feature.

**`room.slice.js`**

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  data: "hii",
  isError: false,
};

// Async thunk for fetching data
export const fetchRoomData = createAsyncThunk(
  "room/fetchRoomData",
  async () => {
    const response = await fetch("/api/room");
    return await response.json();
  }
);

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
    setData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    setError: (state) => {
      state.isError = true;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRoomData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchRoomData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setLoading, setData, setError } = roomSlice.actions;
export default roomSlice.reducer;
```

**Key Points:**

- `createSlice` automatically generates action creators.
- Reducers are synchronous and modify the state directly using Immer.
- `createAsyncThunk` handles async logic like fetching data.

---

### 3. **Configuring the Store**

Create the store and add slices to the reducer.

**`store.js`**

```javascript
import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "../features/room.slice.js";

export const store = configureStore({
  reducer: {
    room: roomReducer,
  },
});
```

**Key Points:**

- `configureStore` simplifies store setup and integrates Redux DevTools by default.

---

### 4. **Providing the Store**

Wrap the app with the `Provider` component to give components access to the Redux store.

**`main.jsx`**

```javascript
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { RouterProvider } from "react-router-dom";
import router from "./router";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
```

---

### 5. **Using Redux in Components**

- Use hooks to interact with Redux state and dispatch actions.

**`Component.jsx`**

```javascript
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { setData, fetchRoomData } from "../features/room.slice";
import { useEffect } from "react";

const MyComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.room);

  const onSubmit = (formData) => {
    dispatch(setData(formData));
    navigate("/roomid");
  };

  useEffect(() => {
    dispatch(fetchRoomData());
  }, [dispatch]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("roomName", { required: true })} />
      {errors.roomName && <p>Room name is required</p>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyComponent;
```

---

### 6. **Recap of Important Hooks**

- **`useSelector`**: Access the Redux state.
- **`useDispatch`**: Dispatch actions to update the state.
- **`useEffect`**: Respond to changes in state or props.

---

### 7. **Adding Async Logic (Thunk)**

- **`createAsyncThunk`** is used for handling async logic.
- Handles **pending**, **fulfilled**, and **rejected** states automatically.

**Usage:**

```javascript
import { fetchRoomData } from "../features/room.slice";

useEffect(() => {
  dispatch(fetchRoomData());
}, [dispatch]);
```

Would you like to extend this further with custom middleware or testing strategies?
