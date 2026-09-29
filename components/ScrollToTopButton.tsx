"use client";

import { ArrowUp } from "lucide-react";
import { RefObject, useEffect, useState } from "react";

type ScrollToTopButtonProps = {
    targetRef: RefObject<HTMLElement | null>;
    // how far (px) the target's top must be scrolled past before the button shows
    threshold?: number;
    label?: string;
}

export default function ScrollToTopButton({ targetRef, threshold = 300, label = "Back to top of table" }: ScrollToTopButtonProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let frame = 0;
        const check = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const top = targetRef.current?.getBoundingClientRect().top;
                setVisible(top !== undefined && top < -threshold);
            });
        };

        check();
        window.addEventListener("scroll", check, { passive: true });
        window.addEventListener("resize", check);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", check);
            window.removeEventListener("resize", check);
        };
    }, [targetRef, threshold]);

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            tabIndex={visible ? 0 : -1}
            onClick={() => targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className={`fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all duration-200 hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA1AD] focus-visible:ring-offset-2 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                }`}
        >
            <ArrowUp size={20} />
        </button>
    );
}
