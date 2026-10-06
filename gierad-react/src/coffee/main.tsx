import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CoffeeApp from './CoffeeApp';

createRoot(document.getElementById('coffee-root')!).render(
  <StrictMode>
    <CoffeeApp />
  </StrictMode>
);
