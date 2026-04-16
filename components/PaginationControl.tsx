import { InvitationData, PoolData } from "@/app/type/Type";

type PaginationControlProps = {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    data: InvitationData[] | PoolData[];
}

export const PaginationControl = ({ page, totalPages, data, setPage }: PaginationControlProps) => {
    return (
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
            <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 py-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition ${page === 1 && 'invisible'}`}
            >
                ← Prev
            </button>
            <span>
                Page <span className="font-medium text-gray-800">{page}</span> of{" "}
                <span className="font-medium text-gray-800">{totalPages}</span>
                <span className="ml-2 text-gray-400">({data.length} total)</span>
            </span>
            <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50 transition ${page === totalPages && 'invisible'}`}
            >
                Next →
            </button>
        </div>
    )
}