export const MockFetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: "John Doe",
        cards: [
          {
            title: "Pedidos",
            content: [
              "João da Silva - 5m³ Areia Fina - 7h",
              "Maria de Oliveira - 5m³ Areia c/ Brita - 8h",
              "José Costa - 2m³ - Areia c/ Brita - 9h",
            ],
          },
          {
            title: "Estoque",
            content: [
              "Areia c/ Brita - 10m³ - 30000 ton",
              "Areia Fina - 5m³ - 15000 ton",
              "Pedra de Rio - 10m³ - 40000 ton",
            ],
          },
          {
            title: "Cobranças",
            content: [
              "João da Silva - 24/01/25 - R$ 500",
              "Maria da Silva - 31/01/25 - R$ 495",
              "José Costa - 02/02/2025 - R$ 1000",
            ],
          },
          {
            title: "Balanço - Jan",
            content: [
              "Entradas: R$ 3.500,00",
              "Saídas: R$ 4.000,00",
              "Média de Lucro: R$ -1.000,00",
            ],
          },
        ],
      });
    }, 3000);
  });
};
