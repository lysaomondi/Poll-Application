import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🚀 Lazy loaded components
const LoginForm = lazy(() => import("./components/LoginForm"));
const PollForm = lazy(() => import("./components/PollForm"));
const PollList = lazy(() => import("./components/PollList"));

export default function App() {
  return (
    <BrowserRouter>

      {/* Loading fallback */}
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center text-gray-600">
            Loading...
          </div>
        }
      >

        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/create" element={<PollForm />} />
          <Route path="/polls" element={<PollList />} />
        </Routes>

      </Suspense>

    </BrowserRouter>
  );
}