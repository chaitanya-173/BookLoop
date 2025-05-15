import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFomPastes } from "../redux/pasteSlice";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

import { IoCopy } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { FaShareSquare } from "react-icons/fa";

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const filteredData = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (pasteId, paste) => {
    dispatch(removeFomPastes(pasteId));
    toast(`${paste.title} deleted`);
  };

  const handleCopy = (paste) => {
    navigator.clipboard
      .writeText(paste.content)
      .then(() => toast.success("Copied to clipboard!"))
      .catch((err) => toast.error("Failed to copy: " + err.message));
  };

  const handleShare = (paste) => {
    const shareUrl = `${window.location.origin}/view/${paste._id}`;
    if (navigator.share) {
      navigator
        .share({
          title: paste.title,
          text: "Check out this paste!",
          url: shareUrl,
        })
        // .then(() => toast.success("Shared successfully!"))
        .catch((err) => toast.error("Failed to share: " + err.message));
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div>
      {pastes.length > 0 && (
        <input
          className="p-2 rounded-2xl min-w-[600px] mt-5 pl-4"
          type="search"
          placeholder="Search here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      <div className="flex flex-col gap-5 mt-5">
        {filteredData.length > 0 ? (
          filteredData.map((paste) => {
            return (
              <div className="border" key={paste?._id}>
                <div className="font-bold text-2xl align-baseline">{paste.title}</div>
                <div className="text-left pl-5 mb-3 mt-3">
                  {paste.content.length > 150
                    ? `${paste.content.slice(0, 150)}...`
                    : paste.content}
                </div>
                <div className="flex flex-row gap-4 place-content-evenly">
                  <button title="Edit" className="group hover:text-blue-500">
                    <Link to={`/?pasteId=${paste?._id}`}>
                      <FaEdit className="text-white group-hover:text-blue-500" />
                    </Link>
                  </button>
                  <button title="View" className="group hover:text-purple-500">
                    <Link to={`/pastes/${paste?._id}`}>
                      <IoMdEye className="text-white group-hover:text-purple-500" />
                    </Link>
                  </button>
                  <button
                    title="Delete"
                    className="hover:text-red-500"
                    onClick={() => handleDelete(paste?._id, paste)}
                  >
                    <MdDelete />
                  </button>
                  <button
                    title="Copy"
                    className="hover:text-green-500"
                    onClick={() => handleCopy(paste)}
                  >
                    <IoCopy />
                  </button>
                  <button
                    title="Share"
                    className="hover:text-orange-500"
                    onClick={() => handleShare(paste)}
                  >
                    <FaShareSquare />
                  </button>
                </div>
                <div className="mt-3">{paste.createdAt}</div>
              </div>
            );
          })
        ) : (
          // Display "No Pastes Available" if no pastes are present
          <div className="text-center text-lg mt-5">No Pastes Available</div>
        )}
      </div>
    </div>
  );
};

export default Paste;
