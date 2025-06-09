import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./redux/store";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Snippet from "./components/Snippet";
import ViewSnippet from "./components/ViewSnippet";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/snippets" element={<Snippet />} />
              <Route path="/snippet/:id" element={<ViewSnippet />} />
            </Routes>
          </div>
          <Toaster position="top-center" />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
