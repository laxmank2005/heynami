import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from './App.jsx';
import { Toaster } from "react-hot-toast";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import CustomToaster from './components/CustomToaster';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        {/* Hidden Toaster — keeps the react-hot-toast event bus alive but renders nothing visible */}
        <Toaster containerStyle={{ display: "none" }} />
        <CustomToaster />
      </PersistGate>
    </Provider>
  </StrictMode>
);
