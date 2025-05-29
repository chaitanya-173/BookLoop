import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToSnippets, updateSnippets } from "../redux/snippetSlice";
import { useSearchParams } from "react-router-dom";
import CodeBlock from "./CodeBlock";

const Home = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const snippetId = searchParams.get("snippetId");
  const snippets = useSelector((state) => state.snippet.snippets);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);

  const createSnippet = () => {
    const snippet = {
      title: title,
      content: value,
      _id:
        snippetId ||
        Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };

    if (snippetId) {
      dispatch(updateSnippets(snippet));
      toast.success("Snippet updated", {
        position: "top-center",
        duration: 2000,
      });
    } else {
      dispatch(addToSnippets(snippet));
      toast.success("Snippet created", {
        position: "top-center",
        duration: 2000,
      });
    }

    setTitle("");
    setValue("");
    setSearchParams({});
  };

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      toast.success("Copied to Clipboard", {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (snippetId) {
      const snippet = snippets.find((p) => p._id === snippetId);
      if (snippet) {
        setTitle(snippet.title);
        setValue(snippet.content);
      }
    }
  }, [snippetId, snippets]);

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-5 items-start">
        <div className="w-full flex flex-row gap-x-4 justify-between items-center">
          <input
            type="text"
            placeholder="Snippet Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[80%] text-black dark:text-white bg-transparent border border-input rounded-md p-2 placeholder-gray-500 dark:placeholder-gray-400"
            style={{
              caretColor: isDarkMode ? "#fff" : "#000",
            }}
          />
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={createSnippet}
          >
            {snippetId ? "Update Snippet" : "Create Snippet"}
          </button>
        </div>

        <div className="w-full flex flex-col items-start relative rounded bg-opacity-10 border border-[rgba(128,121,121,0.3)] backdrop-blur-2xl">
          <div className="w-full rounded-t flex items-center justify-between gap-x-4 px-4 py-2 border-b border-[rgba(128,121,121,0.3)]">
            <div className="w-full flex gap-x-[6px] items-center select-none group">
              <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(255,95,87)]" />
              <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(254,188,46)]" />
              <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(45,200,66)]" />
            </div>
            <div className="w-fit rounded-t flex items-center justify-between gap-x-4 px-4">
              <button
                className="flex justify-center items-center transition-all duration-300 ease-in-out group hover:text-primary-light dark:hover:text-primary-dark text-black dark:text-white"
                onClick={handleCopy}
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write your code here..."
            className="w-full p-3 focus-visible:ring-0 bg-transparent text-black dark:text-white min-h-[400px] placeholder-gray-500 dark:placeholder-gray-400"
            style={{
              caretColor: isDarkMode ? "#fff" : "#000",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
