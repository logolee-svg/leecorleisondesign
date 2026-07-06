import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtoF from './proto/ProtoF';

// Dev-only scroll-model prototypes. These are LAZY-loaded so their libraries (notably
// GSAP/ScrollTrigger in proto-a, which registers global wheel+touch listeners at module
// scope) never load on the live homepage — that global handler was eating the first
// touch on mobile. Now their code only loads if someone actually visits /proto-*.
const HeroProtoA = lazy(() => import('./proto/HeroProtoA'));
const ProtoB = lazy(() => import('./proto/ProtoB'));
const ProtoC = lazy(() => import('./proto/ProtoC'));
const ProtoD = lazy(() => import('./proto/ProtoD'));
const ProtoE = lazy(() => import('./proto/ProtoE'));

function App() {
  return (
    <Routes>
      {/* Live site — the new single-page design (eager; no scroll-library deps) */}
      <Route path="/" element={<ProtoF />} />

      {/* Dev-only prototypes — disallowed from indexing via robots.txt, lazy-loaded */}
      <Route path="/proto-a" element={<Suspense fallback={null}><HeroProtoA /></Suspense>} />
      <Route path="/proto-b" element={<Suspense fallback={null}><ProtoB /></Suspense>} />
      <Route path="/proto-c" element={<Suspense fallback={null}><ProtoC /></Suspense>} />
      <Route path="/proto-d" element={<Suspense fallback={null}><ProtoD /></Suspense>} />
      <Route path="/proto-e" element={<Suspense fallback={null}><ProtoE /></Suspense>} />

      {/* Anything else (incl. the retired /brand /product /consult) redirects home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
