import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeCard(card: { title: string; content: string[] }) {
  return (
    <Card className="hover:shadow-lg px-4">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl lg:text-2xl">
          {card.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="ml-5 text-lg md:text-xl lg:text-2xl">
        <ul className="list-disc">
          {card.content.map((item) => (
            <li className="mb-2">{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
