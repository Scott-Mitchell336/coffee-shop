export const getItems = async () => {
  // Simulate dummy before merging with backend
  return [
    {
      id: 1,
      name: 'Iced Latte',
      description: 'Chilled espresso with milk over ice.',
      price: 4.50,
    },
    {
      id: 2,
      name: 'Cold Brew',
      description: 'Smooth, slow-steeped coffee.',
      price: 3.75,
    },
    {
      id: 3,
      name: 'Churro Latte',
      description: 'Espresso with cinnamon and sugar.',
      price: 5.00,
    },
  ];
};
