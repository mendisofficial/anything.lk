import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navigation } from "./components/Navigation";

export default function Home() {
  return (
    <ProtectedRoute>
      <Navigation />
      <h1>Welcome to Anything.lk</h1>
    </ProtectedRoute>
  );
}
