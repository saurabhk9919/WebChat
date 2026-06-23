import React, { useState, useRef, useEffect } from "react";
import useConversation from "../statemanage/useConversation.js";
import { scrollToAndHighlightMessage } from "../utils/navigationHelper.js";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import toast from "react-hot-toast";

function SemanticSearch() {
    const { navigateToMessage } = useConversation();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const buttonRef = useRef(null);
    const popoverRef = useRef(null);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await axios.post(
                "/api/search",
                { query },
                { withCredentials: true }
            );
            setResults(response.data || []);
        } catch (error) {
            console.error("Semantic search error:", error);
            toast.error("Failed to perform semantic search");
        } finally {
            setLoading(false);
        }
    };

    const handleResultClick = (result) => {
        setIsOpen(false);
        const authUser = JSON.parse(localStorage.getItem("userInfo"));
        const currentUserId = authUser?._id || authUser?.user?._id;

        if (!currentUserId || !result.message) return;

        // Determine who the chat partner is in this conversation
        const partner = result.message.senderId._id === currentUserId
            ? result.message.recieverId
            : result.message.senderId;

        navigateToMessage({
            conversation: partner,
            messageId: result.message._id,
            source: "search"
        });
    };

    // Close popover when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                popoverRef.current?.contains(e.target) ||
                buttonRef.current?.contains(e.target)
            ) {
                return;
            }
            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/20 hover:text-white"
                title="Semantic search messages"
                aria-expanded={isOpen}
            >
                <BiSearch className="text-lg" />
                Search
            </button>

            {isOpen && (
                <div
                    ref={popoverRef}
                    className="absolute right-0 top-full z-40 mt-3 w-80 rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl"
                >
                    <form onSubmit={handleSearch} className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask conceptually... (e.g. Docker)"
                            className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-50"
                        >
                            {loading ? "..." : "Search"}
                        </button>
                    </form>

                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1 select-none">
                        {loading ? (
                            <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                                <span className="loading loading-spinner loading-xs text-indigo-400"></span>
                                Finding semantic matches...
                            </div>
                        ) : results.length > 0 ? (
                            results.map((result, idx) => {
                                const authUser = JSON.parse(localStorage.getItem("userInfo"));
                                const currentUserId = authUser?._id || authUser?.user?._id;
                                const isSenderMe = result.message.senderId._id === currentUserId;
                                const chatPartnerName = isSenderMe
                                    ? result.message.recieverId.name
                                    : result.message.senderId.name;

                                return (
                                    <div
                                        key={result.message._id || idx}
                                        onClick={() => handleResultClick(result)}
                                        className="group rounded-xl border border-white/5 bg-white/5 p-2.5 hover:bg-indigo-500/10 hover:border-indigo-500/20 cursor-pointer transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between text-[9px] mb-1">
                                            <span className="text-slate-400 font-semibold uppercase tracking-wider">
                                                👤 Chat with {chatPartnerName}
                                            </span>
                                            <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                                {Math.round(result.similarityScore * 100)}% match
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-200 line-clamp-2 break-words leading-relaxed group-hover:text-white">
                                            {result.message.message}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-6 text-center text-xs text-slate-600">
                                {query.trim() ? "No semantic matches found." : "Type a query and search."}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SemanticSearch;
