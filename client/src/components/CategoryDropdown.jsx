import { useState } from "react";
import { ChevronDown } from "lucide-react";

const categories = [
  {
    name: "School",
    options: ["Class 12","Class 11","Class 10","Class 9","Class 1-8","Others"],
  },
  {
    name: "College / University",
    options: ["B.A","B.Com","B.Sc","B.Tech","BCA","BBA","LLB","MBBS","M.A","M.Com","M.Sc","M.Tech","MCA","MBA","MD/MS","LLM","Certificate","Diploma","MPhil/PhD","Other"],
  },
  {
    name: "Entrance / Competitive",
    options: ["IIT JEE","NEET","UPSC","SSC","GATE","NDA","CAT","CUET","BITSAT","CLAT","State PCS","IELTS/TOEFL","Other"],
  },
  {
    name: "Fiction",
    options: ["Novels","Manga","Children Books","Picture Books","Romance","Fantasy","Science Fiction","Mystery","Horror","Thriller","Action & Adventure","Young Adult","Historical Fiction"],
  },
  {
    name: "Non-fiction",
    options: ["Self-help","Biographies","Business & Finance","Health","History & Humanities","Language Learning","Lifestyle","Cooking Food & Wine","Music","Personal & Social Issues","Religion","Sports","Travel","Dictionary","Encyclopedia"],
  },
  {
    name: "Others",
    options: ["Agriculture","Architecture","Art & Photography","Computer Science","Other"],
  },
];

export default function CategoryDropdown({ onSelect }) { // ✅ CHANGE 1
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [selected, setSelected] = useState("");

  return (
    <div className="relative">
      <label className="text-xs text-[var(--text)] uppercase">
        Category *
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="w-full mt-1 px-4 py-3 rounded-xl 
        bg-[var(--bg)] border border-[var(--border)] text-sm 
        flex justify-between items-center cursor-pointer"
      >
        <span className={selected ? "" : "text-[var(--text-muted)]"}>
          {selected || "Select category"}
        </span>
        <ChevronDown size={16} />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl 
        bg-[var(--surface)] border border-[var(--border)] 
        shadow-[0_10px_25px_rgba(0,0,0,0.2)] max-h-72 overflow-y-auto">

          {categories.map((cat, index) => (
            <div key={index}>
              <button
                onClick={() => setActive(active === index ? null : index)}
                className="w-full flex justify-between items-center 
                px-4 py-3 text-sm hover:bg-[var(--bg)]"
              >
                {cat.name}
                <ChevronDown
                  size={14}
                  className={`transition ${active === index ? "rotate-180" : ""}`}
                />
              </button>

              {active === index && (
                <div className="px-2 pb-2 space-y-1">
                  {cat.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const value = `${cat.name} • ${opt}`;

                        setSelected(value);
                        setOpen(false);
                        setActive(null);

                        onSelect(value); 
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg 
                      text-[var(--text-muted)] hover:text-[var(--text)] 
                      hover:bg-[var(--bg)]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}