const LoadingCard = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="flex-1 p-4 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
};

export default LoadingCard;