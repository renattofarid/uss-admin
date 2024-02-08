import { AuthProvider } from "./context/AuthContext";
import { RoutesApp } from "./components/Routes";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Toaster />
        <RoutesApp />
      </AuthProvider>
    </ThemeProvider>
  );
}


export default App;
