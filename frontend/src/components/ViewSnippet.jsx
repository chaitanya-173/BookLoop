import { Copy, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import CodeBlock from "./CodeBlock";

const ViewSnippet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const snippets = useSelector((state) => state.snippet.snippets);
  const [snippet, setSnippet] = useState(null);

  useEffect(() => {
    const foundSnippet = snippets.find((p) => p._id === id);
    setSnippet(foundSnippet);
  }, [id, snippets]);

  const handleCopy = () => {
    if (snippet?.content) {
      navigator.clipboard.writeText(snippet.content);
      toast.success("Copied to Clipboard", {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  if (!snippet) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-2xl text-gray-500 dark:text-gray-400">
          Snippet not found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-5 items-start">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="w-full flex flex-row gap-x-4 justify-between items-center">
          <input
            type="text"
            placeholder="Snippet Title"
            value={snippet.title}
            readOnly
            className="w-[80%] text-black dark:text-white bg-transparent border border-input rounded-md p-2 placeholder-gray-500 dark:placeholder-gray-400"
          />
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

          <div className="w-full p-3 overflow-x-auto bg-code-light dark:bg-code-dark">
            <CodeBlock code={snippet.content} language="javascript" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSnippet;
