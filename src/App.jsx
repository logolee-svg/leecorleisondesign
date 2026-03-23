import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Logos from './pages/Logos';
import Product from './pages/Product';
import Consult from './pages/Consult';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/brand" element={<Logos />} />
        <Route path="/product" element={<Product />} />
        <Route path="/consult" element={<Consult />} />
      </Route>
    </Routes>
  );
}

export default App;
