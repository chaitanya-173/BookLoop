import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { IoCopy } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";

import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prism-themes/themes/prism-dracula.css";

const handleCopy = (paste) => {
  navigator.clipboard
    .writeText(paste.content)
    .then(() => toast.success(`Copied to clipboard!`))
    .catch((err) => toast.error("Failed to copy: " + err.message));
};

const ViewPaste = () => {
  const { id } = useParams();

  const allPastes = useSelector((state) => state.paste.pastes);

  const paste = allPastes.find((p) => p._id === id);

  useEffect(() => {
    Prism.highlightAll();
  }, [paste]);

  return (
    <div>
      <div className="flex flex-row gap-7 place-content-between"></div>

      <div className="mt-8 border border-white">
        <div className="w-full rounded-t flex items-center justify-between gap-x-4 px-4 py-2">
          <div className="w-full flex gap-x-[6px] items-center select-none group">
            <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(255,95,87)]"></div>
            <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(254,188,46)]"></div>
            <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(45,200,66)]"></div>
          </div>
          <input
            className="p-2 rounded-2xl mt-2 w-[66%] pl-4 text-2xl bg-transparent"
            type="text"
            placeholder="Enter title here"
            value={paste?.title || ""}
            disabled
          />
          <div className="w-fit rounded-t flex items-center justify-between gap-x-4 px-4">
            <button
              title="Copy"
              className="hover:text-green-500 "
              onClick={() => handleCopy(paste)}
            >
              <IoCopy />
            </button>
            <button title="Edit" className="group hover:text-blue-500">
              <Link to={`/?pasteId=${paste?._id}`}>
                <FaEdit className="text-white group-hover:text-blue-500" />
              </Link>
            </button>
          </div>
        </div >
        {paste && paste.content ? (
          <pre className="border-t-2">
            <code className="language-javascript">{paste.content}</code>
          </pre>
        ) : (
          <p>No content available</p>
        )}
      </div>
    </div>
  );
};

export default ViewPaste;
