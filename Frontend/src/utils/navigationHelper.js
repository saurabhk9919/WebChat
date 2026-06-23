export const scrollToAndHighlightMessage = (messageId) => {
    if (!messageId) return;
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Remove highlight class to restart animation if clicked again
        element.classList.remove("highlight-msg");
        // Trigger reflow to restart animation
        void element.offsetWidth;
        element.classList.add("highlight-msg");

        // Clear after animation is done
        setTimeout(() => {
            element.classList.remove("highlight-msg");
        }, 2500);
    } else {
        console.warn(`Message element with id message-${messageId} not found in DOM.`);
    }
};

export const scrollToAndHighlightSidebarTask = (taskId) => {
    if (!taskId) return;
    const element = document.getElementById(`sidebar-task-${taskId}`);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        element.classList.remove("highlight-task");
        void element.offsetWidth;
        element.classList.add("highlight-task");

        setTimeout(() => {
            element.classList.remove("highlight-task");
        }, 2500);
    } else {
        console.warn(`Sidebar task element with id sidebar-task-${taskId} not found in DOM.`);
    }
};

export const slugify = (text) => {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};
