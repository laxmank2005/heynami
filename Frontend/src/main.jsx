import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from './App.jsx';
import { Toaster } from "react-hot-toast";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster 
          position="bottom-center"
          toastOptions={{
            className: 'bg-white text-stone-900 border border-stone-200 shadow-xl dark:bg-[#111111] dark:text-white dark:border-stone-800 font-medium rounded-xl transition-colors duration-300',
            duration: 3000,
          }}
        />
      </PersistGate>
    </Provider>
  </StrictMode>
);
