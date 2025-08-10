import { useQuery } from "@tanstack/react-query";
import { Rate } from "@shared/schema";
import { TrendingUp, TrendingDown, Wifi } from "lucide-react";

export default function RatesDisplay() {
  const { data: rates, isLoading, isFetching } = useQuery<Rate[]>({
    queryKey: ["/api/rates"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const goldRate = rates?.find(rate => rate.material === "gold");
  const silverRate = rates?.find(rate => rate.material === "silver");

  const formatChange = (change: string) => {
    const changeNum = parseFloat(change);
    const isPositive = changeNum >= 0;
    return {
      value: Math.abs(changeNum).toFixed(2),
      isPositive,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? "text-green-400" : "text-red-400"
    };
  };

  return (
    <section className="bg-navy text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-center">
          {/* Live indicator */}
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <Wifi className={`w-4 h-4 ${isFetching ? 'animate-pulse text-green-400' : 'text-green-400'}`} />
            <span className="text-sm text-gray-300 hidden sm:inline">Live from OMGolds</span>
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded animate-pulse">LIVE</span>
          </div>
          {goldRate && (
            <div className="flex items-center space-x-2">
              <i className="fas fa-coins text-gold text-xl"></i>
              <span className="font-medium">Gold (22K):</span>
              <span className="font-bold text-gold text-lg">₹{parseFloat(goldRate.rate).toFixed(0)}/gram</span>
              {(() => {
                const change = formatChange(goldRate.change);
                const Icon = change.icon;
                return (
                  <span className={`${change.color} text-sm flex items-center`}>
                    <Icon className="w-4 h-4 mr-1" />
                    ₹{change.value}
                  </span>
                );
              })()}
            </div>
          )}
          
          <div className="hidden md:block w-px h-6 bg-gray-500"></div>
          
          {silverRate && (
            <div className="flex items-center space-x-2">
              <i className="fas fa-coins text-silver text-xl"></i>
              <span className="font-medium">Silver:</span>
              <span className="font-bold text-silver text-lg">₹{parseFloat(silverRate.rate).toFixed(1)}/gram</span>
              {(() => {
                const change = formatChange(silverRate.change);
                const Icon = change.icon;
                return (
                  <span className={`${change.color} text-sm flex items-center`}>
                    <Icon className="w-4 h-4 mr-1" />
                    ₹{change.value}
                  </span>
                );
              })()}
            </div>
          )}
          
          <div className="hidden lg:block">
            <span className="text-sm text-gray-300">
              {isFetching ? (
                <span className="animate-pulse">Updating rates...</span>
              ) : (
                `Updated: ${goldRate ? new Date(goldRate.updatedAt).toLocaleTimeString() : "Loading..."}`
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
