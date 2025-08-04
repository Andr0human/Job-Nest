import { Suspense } from 'react';

import { Spin } from './components';
import { Authentication } from './modules/user';
import { Router } from './routes';

const App = () => (
  <Suspense fallback={<Spin fullscreen />}>
    <Authentication>
      <Router />
    </Authentication>
  </Suspense>
);
export default App;
