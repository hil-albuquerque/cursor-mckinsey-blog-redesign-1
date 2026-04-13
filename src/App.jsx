import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BentoLanding from './concepts/concept1/BentoLanding';
import EditorialLanding from './concepts/concept2/EditorialLanding';
import ImmersiveLanding from './concepts/concept3/ImmersiveLanding';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/concept-1" element={<BentoLanding />} />
      <Route path="/concept-2" element={<EditorialLanding />} />
      <Route path="/concept-3" element={<ImmersiveLanding />} />
    </Routes>
  );
}
