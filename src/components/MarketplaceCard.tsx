import Image from "next/image";

type Props = {
  item: {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string | null;
  };
};

export default function MarketplaceCard({ item }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      {item.image_url ? (
        <div className="relative w-full h-48 mb-3 rounded overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 rounded mb-3">
          No image
        </div>
      )}

      <h2 className="text-lg font-semibold">{item.title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
        {item.description}
      </p>
      <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
        GH₵ {item.price.toFixed(2)}
      </p>
    </div>
  );
}
