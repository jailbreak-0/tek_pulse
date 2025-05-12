import Link from "next/link";

type Props = {
  item: {
    id: string;
    title: string;
    description: string;
    type: "lost" | "found";
    is_claimed: boolean;
    created_at: string;
  };
};

export default function LostItemCard({ item }: Props) {
  return (
    <div className="border w-md rounded-lg p-4 shadow bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{item.title}</h2>
        <span
          className={`px-2 py-1 rounded text-sm ${
            item.type === "lost"
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {item.type.toUpperCase()}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mt-2">{item.description}</p>
      
      <div className="flex flex-col justify-start max-w-30 mt-4">
        {item.is_claimed && (
          <span className="text-sm text-yellow-600 font-medium gap-2">
            ✅ Claimed
          </span>
        )}
        <Link
          href={`/lost-and-found/${item.id}`}
          className="inline-block text-center mt-3 hover:text-blue-600 hover:underline text-sm bg-[#22AB39] text-white py-2 px-4 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
