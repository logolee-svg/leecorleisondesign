import { Routes, Route, Navigate } from 'react-router-dom';
import ProtoF from './proto/ProtoF';
import HeroProtoA from './proto/HeroProtoA';
import ProtoB from './proto/ProtoB';
import ProtoC from './proto/ProtoC';
import ProtoD from './proto/ProtoD';
import ProtoE from './proto/ProtoE';

function App() {
  return (
    <Routes>
      {/* Live site — the new single-page design */}
      <Route path="/" element={<ProtoF />} />

      {/* Dev-only scroll-model prototypes — disallowed from indexing via robots.txt */}
      <Route path="/proto-a" element={<HeroProtoA />} />
      <Route path="/proto-b" element={<ProtoB />} />
      <Route path="/proto-c" element={<ProtoC />} />
      <Route path="/proto-d" element={<ProtoD />} />
      <Route path="/proto-e" element={<ProtoE />} />

      {/* Anything else (incl. the retired /brand /product /consult) redirects home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
