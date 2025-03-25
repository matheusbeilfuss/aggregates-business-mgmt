import { Layout } from "@/components/layout";
import { HomeCard } from "@/components/home-card";
import { useEffect, useState } from "react";
import { MockFetchData } from "@/MockFetchData";
import { Skeleton } from "@/components/ui/skeleton";

export function Home() {
  const [homeData, setHomeData] = useState<{
    user: string;
    cards: { title: string; content: string[] }[];
  } | null>(null);

  useEffect(() => {
    MockFetchData().then((data) => {
      setHomeData(data as any);
    });
  }, []);

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center mx-auto">
        <div className="w-[80%] h-[20vh] flex flex-col justify-center items-start">
          {homeData ? (
            <h1 className="text-3xl">Olá, {homeData.user}</h1>
          ) : (
            <Skeleton className="h-8 w-48 rounded-full" />
          )}
        </div>
        <div className="w-[80%] grid grid-cols-1 md:grid-cols-2 gap-10">
          {homeData
            ? homeData.cards.map((card) => (
                <HomeCard
                  key={card.title}
                  title={card.title}
                  content={card.content}
                />
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-48 w-full" />
              ))}
        </div>
      </div>
    </Layout>
  );
}
